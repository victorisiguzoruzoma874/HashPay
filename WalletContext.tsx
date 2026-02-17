import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Transaction, Wallet, AppNotification, Escrow, Contact } from './types';
import { useToast } from './components/Toast';
import { apiClient } from './api/client';
import { suiClient } from './api/sui';
import { PACKAGE_ID, MODULE_PROFILE, MODULE_ESCROW } from './api/config';
import { Transaction as SuiTransaction } from '@mysten/sui/transactions';
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';
import { afriexClient } from './api/afriex';


interface UserProfile {
  name: string;
  email: string;
  username: string;
  avatar: string;
  address: string;
  kycStatus?: 'unverified' | 'pending' | 'verified';
}

interface AppSettings {
  voiceEnabled: boolean;
  biometricsEnabled: boolean;
  notificationsEnabled: boolean;
  theme: 'dark' | 'light' | 'system';
  language: string;
}

interface WalletContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithWallet: (address: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  balance: number;
  balanceVisible: boolean;
  toggleBalanceVisibility: () => void;
  transactions: Transaction[];
  addTransaction: (tx: Transaction) => void;
  sendFunds: (recipient: string, amount: string, symbol: string) => Promise<string | null>;
  wallets: Wallet[];
  totalFiatValue: string;
  userProfile: UserProfile;
  updateUserProfile: (profile: Partial<UserProfile>) => void;
  appSettings: AppSettings;
  updateAppSettings: (settings: Partial<AppSettings>) => void;
  swapAssets: (fromSymbol: string, toSymbol: string, amount: number) => Promise<void>;
  prices: Record<string, number>;
  vaultBalances: Record<string, number>;
  moveToVault: (symbol: string, amount: number) => void;
  removeFromVault: (symbol: string, amount: number) => void;
  notifications: AppNotification[];
  markNotificationRead: (id: string) => void;
  escrows: Escrow[];
  createEscrow: (escrow: Omit<Escrow, 'id' | 'status'>) => void;
  releaseEscrow: (id: string) => void;
  contacts: Contact[];
  addContact: (contact: Omit<Contact, 'id'>) => void;
  recoveryPhrase: string[];
  currentNetwork: string;
  setCurrentNetwork: (network: string) => void;
  networks: { id: string, name: string, rpc: string, type: 'mainnet' | 'testnet' | 'devnet' }[];
  addCustomNetwork: (name: string, rpc: string, type: 'mainnet' | 'testnet' | 'devnet') => void;
  isPhraseVerified: boolean;
  verifyPhrase: () => void;
  registerSuiProfile: (username: string, bio: string) => Promise<string | null>;
  createEscrowOnChain: (recipient: string, amount: string) => Promise<string | null>;
  afriexTransfer: (data: { amount: number, currency: string, recipient_address: string, recipient_name: string }) => Promise<void>;
  submitKYC: (data: any) => Promise<void>;
  onRamp: (data: any) => Promise<void>;
  offRamp: (data: any) => Promise<void>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('auth_token'));
  const [userId, setUserId] = useState<number | null>(localStorage.getItem('user_id') ? parseInt(localStorage.getItem('user_id')!) : null);

  const [balanceVisible, setBalanceVisible] = useState(true);
  const [balance, setBalance] = useState(0);
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [escrows, setEscrows] = useState<Escrow[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [vaultBalances, setVaultBalances] = useState<Record<string, number>>({});

  const [prices, setPrices] = useState<Record<string, number>>({
    'SUI': 1.25,
    'USDC': 1.00,
    'BTC': 65000.00,
    'ETH': 2200.00
  });

  const [networks, setNetworks] = useState([
    { id: '1', name: 'Sui Mainnet', rpc: 'https://fullnode.mainnet.sui.io:443', type: 'mainnet' as const },
    { id: '2', name: 'Sui Testnet', rpc: 'https://fullnode.testnet.sui.io:443', type: 'testnet' as const },
    { id: '3', name: 'Sui Devnet', rpc: 'https://fullnode.devnet.sui.io:443', type: 'devnet' as const }
  ]);
  const [currentNetwork, setCurrentNetwork] = useState('Sui Mainnet');
  const [isPhraseVerified, setIsPhraseVerified] = useState(false);
  const [recoveryPhrase] = useState(['harvest', 'brave', 'solid', 'ocean', 'wisdom', 'engine', 'pulse', 'vivid', 'light', 'stone', 'metal', 'force']);

  const { showToast } = useToast();

  const loginWithWallet = async (address: string) => {
    setIsLoading(true);
    try {
      const data = await apiClient.post('/auth/wallet-login', { address });
      localStorage.setItem('auth_token', data.token);
      localStorage.setItem('user_id', data.user.id.toString());
      setUserId(data.user.id);
      setIsAuthenticated(true);
      setUserProfile(prev => ({ ...prev, ...data.user, address }));
      showToast('Wallet connected successfully', 'success');
    } catch (error: any) {
      console.error('Wallet Login Error:', error);
      const simulatedUser = {
        id: Date.now(),
        name: 'Sui Explorer',
        email: 'explorer@sui.io',
        username: `sui_${address.slice(0, 6)}`,
        avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=' + address,
        address: address
      };
      localStorage.setItem('auth_token', 'simulated_token');
      localStorage.setItem('user_id', simulatedUser.id.toString());
      setUserId(simulatedUser.id);
      setIsAuthenticated(true);
      setUserProfile(simulatedUser);
      showToast('Simulated Wallet Connection Active', 'info');
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const data = await apiClient.post('/auth/login', { email, password });
      localStorage.setItem('auth_token', data.token);
      localStorage.setItem('user_id', data.user.id.toString());
      setUserId(data.user.id);
      setIsAuthenticated(true);
      setUserProfile(prev => ({ ...prev, ...data.user }));
      showToast('Login successful', 'success');
    } catch (error: any) {
      showToast(error.message || 'Login failed', 'error');
      throw error;
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      const data = await apiClient.post('/auth/register', { name, email, password });
      localStorage.setItem('auth_token', data.token);
      localStorage.setItem('user_id', data.user.id.toString());
      setUserId(data.user.id);
      setIsAuthenticated(true);
      setUserProfile(prev => ({ ...prev, ...data.user }));
      showToast('Account created successfully', 'success');
    } catch (error: any) {
      showToast(error.message || 'Registration failed', 'error');
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_id');
    setUserId(null);
    setIsAuthenticated(false);
    showToast('Logged out', 'info');
  };

  // Fetch initial data & Poll for updates (Simulation of WebSockets/Real-time)
  useEffect(() => {
    const fetchData = async (isSilent = false) => {
      if (!isAuthenticated || !userId) return;
      if (!isSilent) setIsLoading(true);
      try {
        // Fetch multiple resources in parallel
        const [userData, contactsData, notificationsData, escrowsData] = await Promise.all([
          apiClient.get(`/users/${userId}`),
          apiClient.get(`/contacts/${userId}`),
          apiClient.get(`/notifications/${userId}`),
          apiClient.get(`/escrow/${userId}`)
        ]);

        if (userData.user) {
          setUserProfile(prev => ({ ...prev, ...userData.user }));
        }
        if (userData.wallets) {
          let currentWallets = userData.wallets;

          // Fetch real on-chain SUI balance if we have an address
          if (userData.user?.address) {
            try {
              const coinBalance = await suiClient.getBalance({
                owner: userData.user.address,
              });
              const suiBalance = Number(coinBalance.totalBalance) / 1_000_000_000;
              currentWallets = currentWallets.map((w: any) =>
                w.symbol === 'SUI' ? { ...w, balance: suiBalance.toLocaleString() } : w
              );
            } catch (suiError) {
              console.error('Failed to fetch SUI on-chain balance', suiError);
            }
          }

          setWallets(currentWallets);
          const total = currentWallets.reduce((acc: number, w: any) => acc + parseFloat(w.fiatValue || 0), 0);
          setBalance(total);
        }
        if (userData.recentTransactions) {
          setTransactions(userData.recentTransactions);
        }

        setContacts(contactsData);
        setNotifications(notificationsData);
        setEscrows(escrowsData);

      } catch (error) {
        console.error('Failed to fetch user data', error);
        if (!isSilent && ((error as Error).message.includes('401') || (error as Error).message.includes('403'))) {
          logout();
        }
      } finally {
        if (!isSilent) setIsLoading(false);
      }
    };

    fetchData(); // Initial load
    const interval = setInterval(() => fetchData(true), 15000); // Silent poll every 15 seconds

    return () => clearInterval(interval);
  }, [isAuthenticated, userId]);



  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: 'Alex Mercer',
    email: 'alex.mercer@hashpay.io',
    username: 'amercer_sui',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC9VGYwzYN8uMNCP9CXM9GWi7ouTKj4ruwu7LjZ2-KxupQQKh-_ZiPsuf0LDDTKXHUE4hM10GBF84C50IuLgdxmwexqWYsUDcjzfagOAvrfde1xSvfVDz3YSefxx9QCGa5u8khd2tm5fVfZbQk81BRzhA8Jer3SJxITrtdGRNeOBEqeCOkWZmBzr8pMxZ163RF23O3JgyrQGh7gUYwEGsTv-68vRONVQpkBM_p9vcsQCYeayHyV75uqWBPTkDge38702-6ybOCRn-dN',
    address: '0x71c7656ec7ab88b098defb751b7401b5f6d8976f9a2b8e390c58e6d89b8e390c',
    kycStatus: 'unverified'
  });

  const [appSettings, setAppSettings] = useState<AppSettings>({
    voiceEnabled: true,
    biometricsEnabled: true,
    notificationsEnabled: true,
    theme: 'dark',
    language: 'English'
  });

  const fetchPrices = async () => {
    try {
      const ids = 'sui,bitcoin,ethereum,usd-coin';
      const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd`);
      const data = await response.json();
      if (data) {
        setPrices({
          'SUI': data.sui?.usd || 1.25,
          'USDC': data['usd-coin']?.usd || 1.00,
          'BTC': data.bitcoin?.usd || 65000.00,
          'ETH': data.ethereum?.usd || 2200.00
        });
      }
    } catch (error) {
      console.warn('Real-time price fetch failed, using fallbacks:', error);
    }
  };

  useEffect(() => {
    fetchPrices();
    const interval = setInterval(fetchPrices, 60000); // Poll every minute
    return () => clearInterval(interval);
  }, []);

  // Update total balance whenever wallets or prices change
  useEffect(() => {
    if (wallets.length > 0) {
      const total = wallets.reduce((acc, w) => {
        const price = prices[w.symbol] || 0;
        const amount = parseFloat(w.balance.replace(/,/g, '')) || 0;
        return acc + (amount * price);
      }, 0);
      setBalance(total);
    }
  }, [wallets, prices]);

  const toggleBalanceVisibility = () => setBalanceVisible(!balanceVisible);

  const addTransaction = (tx: Transaction) => {
    setTransactions(prev => [tx, ...prev]);
  };

  const moveToVault = (symbol: string, amount: number) => {
    const wallet = wallets.find(w => w.symbol === symbol);
    if (!wallet || parseFloat(wallet.balance.replace(/,/g, '')) < amount) {
      showToast('Insufficient balance in wallet', 'error');
      return;
    }

    setWallets(prev => prev.map(w => {
      if (w.symbol === symbol) {
        const newBalance = parseFloat(w.balance.replace(/,/g, '')) - amount;
        return { ...w, balance: newBalance.toLocaleString() };
      }
      return w;
    }));

    setVaultBalances(prev => ({
      ...prev,
      [symbol]: (prev[symbol] || 0) + amount
    }));

    showToast(`Successfully moved ${amount} ${symbol} to Vault`, 'success');
  };

  const removeFromVault = (symbol: string, amount: number) => {
    if ((vaultBalances[symbol] || 0) < amount) {
      showToast('Insufficient balance in Vault', 'error');
      return;
    }

    setVaultBalances(prev => ({
      ...prev,
      [symbol]: prev[symbol] - amount
    }));

    setWallets(prev => prev.map(w => {
      if (w.symbol === symbol) {
        const newBalance = parseFloat(w.balance.replace(/,/g, '')) + amount;
        return { ...w, balance: newBalance.toLocaleString() };
      }
      return w;
    }));

    showToast(`Successfully released ${amount} ${symbol} from Vault`, 'success');
  };

  const sendFunds = async (recipient: string, amount: string, symbol: string): Promise<string | null> => {
    if (!userId || !userProfile.address) return null;
    setIsLoading(true);
    try {
      let digest: string | null = null;

      if (symbol === 'SUI') {
        // Real Sui Testnet Transaction
        const txb = new SuiTransaction();
        const [coin] = txb.splitCoins(txb.gas, [txb.pure.u64(BigInt(parseFloat(amount) * 1_000_000_000))]);
        txb.transferObjects([coin], txb.pure.address(recipient));

        // NOTE: In a real app, the wallet extension would sign this.
        // For this demo, we'll simulate the "Waiting for approval" and then use the API to sync.
        // If the user has a private key in the project (not recommended but for demo), we could sign it here.

        // Simulating API sync for record keeping
        const response = await apiClient.post('/transactions/send', {
          recipientEmail: recipient,
          amount: amount,
          currency: symbol
        });
        digest = response.hash || `sim-${Math.random().toString(36).substr(2, 9)}`;
      } else {
        // Other assets simulation
        await apiClient.post('/transactions/send', {
          recipientEmail: recipient,
          amount: amount,
          currency: symbol
        });
        digest = `sim-${Math.random().toString(36).substr(2, 9)}`;
      }

      const newTx: Transaction = {
        id: digest || Math.random().toString(36).substr(2, 9),
        type: 'sent',
        amount: amount,
        currency: symbol,
        recipient: recipient,
        date: 'Just now'
      };

      addTransaction(newTx);
      showToast(`Transaction successful!`, 'success');

      // Refresh balances
      const userData = await apiClient.get(`/users/${userId}`);
      if (userData.wallets) {
        setWallets(userData.wallets);
        // Re-fetch on-chain balance too
        await refreshBalances(userData.user?.address, userData.wallets);
      }

      return digest;
    } catch (error: any) {
      console.error('Transaction failed', error);
      showToast(error.message || 'Transaction failed', 'error');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const refreshBalances = async (address: string, localWallets: Wallet[]) => {
    if (!address) return;
    try {
      const coinBalance = await suiClient.getBalance({ owner: address });
      const suiBalance = Number(coinBalance.totalBalance) / 1_000_000_000;
      const updatedWallets = localWallets.map(w =>
        w.symbol === 'SUI' ? { ...w, balance: suiBalance.toLocaleString() } : w
      );
      setWallets(updatedWallets);
      const total = updatedWallets.reduce((acc, w) => acc + parseFloat(w.fiatValue || '0'), 0);
      setBalance(total);
    } catch (e) {
      console.error('Failed to refresh on-chain balance', e);
    }
  };

  const updateUserProfile = (newProfile: Partial<UserProfile>) => {
    setUserProfile(prev => ({ ...prev, ...newProfile }));
  };
  const updateAppSettings = (newSettings: Partial<AppSettings>) => {
    setAppSettings(prev => ({ ...prev, ...newSettings }));
  };

  const addCustomNetwork = (name: string, rpc: string, type: 'mainnet' | 'testnet' | 'devnet') => {
    const newNetwork = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      rpc,
      type
    };
    setNetworks(prev => [...prev, newNetwork]);
    setCurrentNetwork(name);
  };

  const verifyPhrase = () => {
    setIsPhraseVerified(true);
    showToast('Recovery phrase verified and secured', 'success');
  };

  const markNotificationRead = async (id: string) => {
    try {
      await apiClient.patch(`/notifications/${id}/read`);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    } catch (error) {
      console.error('Failed to mark notification as read', error);
    }
  };

  const createEscrow = async (escrow: Omit<Escrow, 'id' | 'status'>) => {
    if (!userId) return;
    try {
      const data = await apiClient.post('/escrow', { ...escrow });
      setEscrows(prev => [data, ...prev]);
      showToast('Escrow initialized', 'success');
    } catch (error) {
      showToast('Failed to create escrow', 'error');
    }
  };

  const releaseEscrow = async (id: string) => {
    try {
      await apiClient.patch(`/escrow/${id}/status`, { status: 'completed' });
      setEscrows(prev => prev.map(e => e.id === id ? { ...e, status: 'completed' } : e));
      showToast('Escrow funds released', 'success');
    } catch (error) {
      showToast('Failed to release escrow', 'error');
    }
  };

  const addContact = async (contact: Omit<Contact, 'id'>) => {
    if (!userId) return;
    try {
      const data = await apiClient.post('/contacts', { ...contact });
      setContacts(prev => [data, ...prev]);
      showToast('Contact added', 'success');
    } catch (error) {
      showToast('Failed to add contact', 'error');
    }
  };

  const registerSuiProfile = async (username: string, bio: string): Promise<string | null> => {
    if (!userId || !userProfile.address) return null;
    setIsLoading(true);
    try {
      const txb = new SuiTransaction();
      txb.moveCall({
        target: `${PACKAGE_ID}::${MODULE_PROFILE}::register`,
        arguments: [
          txb.pure.string(username),
          txb.pure.string(bio),
        ],
      });

      // NOTE: Real signing would happen here via wallet extension.
      showToast('Profile registration initiated on Sui Testnet', 'info');
      // For demo, we simulate success as if the user signed in their wallet
      return '0xsimulated_profile_digest';
    } catch (error: any) {
      console.error('Profile registration failed', error);
      showToast(error.message || 'Profile registration failed', 'error');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const createEscrowOnChain = async (recipient: string, amount: string): Promise<string | null> => {
    if (!userId || !userProfile.address) return null;
    setIsLoading(true);
    try {
      const txb = new SuiTransaction();
      const [coin] = txb.splitCoins(txb.gas, [txb.pure.u64(BigInt(parseFloat(amount) * 1_000_000_000))]);

      txb.moveCall({
        target: `${PACKAGE_ID}::${MODULE_ESCROW}::create`,
        arguments: [
          txb.pure.address(recipient),
          coin,
        ],
      });

      showToast('Escrow initialization initiated on Sui Testnet', 'info');
      return '0xsimulated_escrow_digest';
    } catch (error: any) {
      console.error('Escrow creation failed', error);
      showToast(error.message || 'Escrow creation failed', 'error');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const afriexTransfer = async (data: { amount: number, currency: string, recipient_address: string, recipient_name: string }) => {
    setIsLoading(true);
    try {
      const response = await afriexClient.initiateTransfer(data);

      const newTx: Transaction = {
        id: response.transaction_id || `afx-${Date.now()}`,
        type: 'sent',
        amount: data.amount.toString(),
        currency: data.currency,
        recipient: data.recipient_name,
        date: 'Just now'
      };

      addTransaction(newTx);
      showToast(`Cross-border transfer to ${data.recipient_name} initiated!`, 'success');

      // Refresh balances (might need logic to deduct if it's fiat-linked)
      if (userId) {
        const userData = await apiClient.get(`/users/${userId}`);
        if (userData.wallets) setWallets(userData.wallets);
      }
    } catch (error: any) {
      showToast(error.message || 'Afriex Transfer Failed', 'error');
      console.error('Afriex Transfer Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const swapAssets = async (fromSymbol: string, toSymbol: string, amount: number) => {
    setIsLoading(true);
    try {
      const fromRate = prices[fromSymbol] || 1;
      const toRate = prices[toSymbol] || 1;
      const outputAmount = (amount * fromRate) / toRate;

      await new Promise(resolve => setTimeout(resolve, 1500));

      setWallets(prev => prev.map(w => {
        if (w.symbol === fromSymbol) {
          const newBalance = parseFloat(w.balance.replace(/,/g, '')) - amount;
          return { ...w, balance: newBalance.toLocaleString() };
        }
        if (w.symbol === toSymbol) {
          const newBalance = parseFloat(w.balance.replace(/,/g, '')) + outputAmount;
          return { ...w, balance: newBalance.toLocaleString() };
        }
        return w;
      }));

      addTransaction({
        id: Math.random().toString(36).substr(2, 9),
        type: 'sent',
        amount: amount.toString(),
        currency: fromSymbol,
        recipient: `Swapped to ${toSymbol}`,
        date: new Date().toISOString()
      });

      showToast(`Successfully swapped ${amount} ${fromSymbol} to ${toSymbol}`, 'success');

      if (userId && userProfile.address) {
        await refreshBalances(userProfile.address, wallets);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const submitKYC = async (data: any) => {
    if (!userId) return;
    try {
      await apiClient.post('/exchange/kyc', { user_id: userId, kycData: data });
      setUserProfile(prev => ({ ...prev, kycStatus: 'pending' }));
      showToast('KYC documents submitted!', 'success');
    } catch (e) {
      showToast('KYC submission failed', 'error');
    }
  };

  const onRamp = async (data: any) => {
    if (!userId) return;
    try {
      await apiClient.post('/exchange/on-ramp', { ...data, user_id: userId });
      showToast('On-ramp successful!', 'success');
      const userData = await apiClient.get(`/users/${userId}`);
      if (userData.wallets) setWallets(userData.wallets);
    } catch (e: any) {
      showToast(e.message || 'On-ramp failed', 'error');
    }
  };

  const offRamp = async (data: any) => {
    if (!userId) return;
    try {
      await apiClient.post('/exchange/off-ramp', { ...data, user_id: userId });
      showToast('Off-ramp initiated!', 'success');
      const userData = await apiClient.get(`/users/${userId}`);
      if (userData.wallets) setWallets(userData.wallets);
    } catch (e: any) {
      showToast(e.message || 'Off-ramp failed', 'error');
    }
  };

  return (
    <WalletContext.Provider value={{
      isAuthenticated,
      isLoading,
      login,
      loginWithWallet,
      register,
      logout,
      balance,
      balanceVisible,
      toggleBalanceVisibility,
      transactions,
      addTransaction,
      sendFunds,
      wallets,
      totalFiatValue: `$${balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      userProfile,
      updateUserProfile,
      appSettings,
      updateAppSettings,
      swapAssets,
      prices,
      vaultBalances,
      moveToVault,
      removeFromVault,
      notifications,
      markNotificationRead,
      escrows,
      createEscrow,
      releaseEscrow,
      contacts,
      addContact,
      recoveryPhrase,
      currentNetwork,
      setCurrentNetwork,
      networks,
      addCustomNetwork,
      isPhraseVerified,
      verifyPhrase,
      registerSuiProfile,
      createEscrowOnChain,
      afriexTransfer,
      submitKYC,
      onRamp,
      offRamp
    }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};
