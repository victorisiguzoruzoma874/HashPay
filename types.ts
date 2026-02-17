
export enum AppScreen {
  SPLASH = 'splash',
  ONBOARDING = 'onboarding',
  AUTH = 'auth',
  DASHBOARD = 'dashboard',
  SEND = 'send',
  RECEIVE = 'receive',
  TRANSACTION_DETAILS = 'transaction_details',
  ESCROW = 'escrow',
  VOICE_ASSISTANT = 'voice_assistant',
  SETTINGS = 'settings',
  OFFLINE_MODE = 'offline_mode',
  ASSETS = 'assets',
  SWAP = 'swap',
  SCAN = 'scan',
  VAULT = 'vault',
  BUY = 'buy',
  NOTIFICATIONS = 'notifications',
  CONTACTS = 'contacts',
  ASSET_DETAILS = 'asset_details',
  RECOVERY_PHRASE = 'recovery_phrase',
  NETWORK_SETTINGS = 'network_settings',
  FIAT_DASHBOARD = 'fiat_dashboard',
  EXCHANGE = 'exchange',
  KYC = 'kyc'
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'transaction' | 'security' | 'promo';
  date: string;
  read: boolean;
}

export interface Escrow {
  id: string;
  amount: string;
  recipient: string;
  status: 'pending' | 'completed' | 'disputed';
  expiryDate: string;
}

export interface Contact {
  id: string;
  name: string;
  address: string;
  avatar?: string;
}

export interface Transaction {
  id: string;
  type: 'sent' | 'received';
  amount: string;
  currency: string;
  recipient: string;
  date: string;
  avatar?: string;
}

export interface Wallet {
  id: string;
  name: string;
  balance: string;
  fiatValue: string;
  color: string;
  symbol: string;
  icon: string;
}
