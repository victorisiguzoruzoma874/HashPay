
import React, { useState, useEffect } from 'react';
import { useWallet } from '../WalletContext';
import { useToast } from '../components/Toast';
import { AppScreen } from '../types';

interface SendScreenProps {
  onBack: () => void;
  onConfirm: () => void;
  onNavigate: (screen: AppScreen) => void;
}

const SendScreen: React.FC<SendScreenProps> = ({ onBack, onConfirm, onNavigate }) => {
  const { wallets, sendFunds, isLoading: isWalletLoading, contacts, afriexTransfer } = useWallet();
  const { showToast } = useToast();

  const [transferType, setTransferType] = useState<'sui' | 'afriex'>('sui');
  const [recipient, setRecipient] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [amount, setAmount] = useState('10');
  const [selectedAsset, setSelectedAsset] = useState<'SUI' | 'USDC'>('SUI');
  const [targetCurrency, setTargetCurrency] = useState('NGN');

  const selectedWallet = wallets.find(w => w.symbol === selectedAsset);
  const currentBalance = selectedWallet ? parseFloat(selectedWallet.balance.replace(/,/g, '')) : 0;

  const afriexCurrencies = ['NGN', 'KES', 'GHS', 'ZAR', 'USD'];
  const fxRates: Record<string, number> = {
    'NGN': 1500,
    'KES': 130,
    'GHS': 13,
    'ZAR': 19,
    'USD': 1
  };

  const handleManualConfirm = async () => {
    if (!recipient) {
      showToast('Please enter a recipient', 'error');
      return;
    }
    if (parseFloat(amount) <= 0) {
      showToast('Please enter a valid amount', 'error');
      return;
    }

    if (transferType === 'sui') {
      const digest = await sendFunds(recipient, amount, selectedAsset);
      if (digest) onConfirm();
    } else {
      await afriexTransfer({
        amount: parseFloat(amount),
        currency: targetCurrency,
        recipient_address: recipient,
        recipient_name: recipientName || recipient
      });
      onConfirm();
    }
  };

  const selectContact = (contact: any) => {
    setRecipient(contact.address || contact.id);
    setRecipientName(contact.name);
    showToast(`Recipient set to ${contact.name}`, 'info');
  };

  const setMaxAmount = () => {
    setAmount(currentBalance.toString());
    showToast('Maximum amount selected', 'info');
  };

  return (
    <div className="bg-background-dark text-white font-display min-h-screen flex flex-col overflow-x-hidden animate-fade-in pb-32">
      <header className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 glass border-b border-white/5">
        <button onClick={onBack} className="flex items-center justify-center size-11 rounded-2xl bg-white/5 hover:bg-white/10 transition-all active:scale-90 shadow-lg">
          <span className="material-symbols-outlined text-2xl">arrow_back</span>
        </button>
        <div className="flex flex-col items-center">
          <h1 className="text-xl font-black leading-tight tracking-tight uppercase tracking-widest text-primary-light">Send Transfer</h1>
          <span className="text-[8px] font-black text-text-tertiary uppercase tracking-[0.3em]">Afriex Network & Sui</span>
        </div>
        <button onClick={() => showToast('Scanner coming soon!', 'info')} className="flex items-center justify-center size-11 rounded-2xl bg-white/5 hover:bg-white/10 transition-all active:scale-90 text-primary shadow-lg">
          <span className="material-symbols-outlined text-2xl font-bold">qr_code_scanner</span>
        </button>
      </header>

      <main className="flex-1 flex flex-col p-6 gap-8">
        {/* Transfer Type Toggle */}
        <section className="flex flex-col gap-3">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 pl-1">Transfer Network</label>
          <div className="flex p-1.5 bg-surface-dark/40 rounded-2xl border border-white/5 shadow-xl">
            <button
              onClick={() => setTransferType('sui')}
              className={`flex-1 h-12 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${transferType === 'sui' ? 'bg-primary text-white shadow-lg' : 'text-text-tertiary hover:text-white'}`}
            >
              Sui On-Chain
            </button>
            <button
              onClick={() => setTransferType('afriex')}
              className={`flex-1 h-12 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${transferType === 'afriex' ? 'bg-[#22c55e] text-white shadow-lg' : 'text-text-tertiary hover:text-white'}`}
            >
              Afriex Cross-border
            </button>
          </div>
        </section>

        <section className="flex flex-col gap-3">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 pl-1">Recipient Identity</label>
          <div className="relative group">
            <input
              className="w-full h-16 pl-6 pr-14 rounded-2xl bg-surface-dark/50 border border-white/10 focus:border-primary focus:ring-4 focus:ring-primary/10 text-lg font-bold placeholder:text-gray-600 outline-none transition-all shadow-xl"
              placeholder={transferType === 'sui' ? "SUI Address or ENS" : "Bank A/C or Mobile Number"}
              type="text"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
            />
            <button className="absolute right-4 top-1/2 -translate-y-1/2 p-2.5 text-primary hover:bg-primary/10 rounded-xl transition-all active:scale-90">
              <span className="material-symbols-outlined text-2xl">person_search</span>
            </button>
          </div>
          {transferType === 'afriex' && (
            <input
              className="w-full h-14 px-6 rounded-2xl bg-surface-dark/30 border border-white/5 focus:border-[#22c55e] text-sm font-bold placeholder:text-gray-700 outline-none transition-all"
              placeholder="Receiver Full Name"
              type="text"
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
            />
          )}
        </section>

        <section>
          <div className="flex justify-between items-center mb-4 px-1">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#6B7280]">Recent Links</h3>
            <button
              onClick={() => onNavigate(AppScreen.CONTACTS)}
              className="text-primary text-[10px] font-black uppercase tracking-widest hover:underline"
            >
              See All
            </button>
          </div>
          <div className="flex overflow-x-auto gap-5 hide-scrollbar pb-2 snap-x">
            <button
              onClick={() => onNavigate(AppScreen.CONTACTS)}
              className="flex flex-col items-center gap-3 min-w-[72px] snap-start group active:scale-90 transition-transform"
            >
              <div className="size-16 rounded-3xl bg-surface-dark border-2 border-dashed border-[#6B7280] flex items-center justify-center group-hover:border-primary group-hover:bg-primary/5 transition-all shadow-lg">
                <span className="material-symbols-outlined text-2xl text-[#6B7280] group-hover:text-primary">add</span>
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-[#6B7280]">New</span>
            </button>
            {contacts.slice(0, 5).map((c, i) => (
              <button
                key={i}
                onClick={() => selectContact(c)}
                className="flex flex-col items-center gap-3 min-w-[72px] snap-start active:scale-90 transition-transform"
              >
                <div className="size-16 rounded-[1.75rem] bg-cover bg-center border-4 border-background-dark ring-2 ring-white/5 hover:ring-primary transition-all relative overflow-hidden shadow-2xl" style={{ backgroundImage: `url(${c.avatar})` }}>
                  <div className="absolute inset-0 bg-primary/10 opacity-0 hover:opacity-100 transition-opacity"></div>
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-300 truncate max-w-[70px]">{c.name}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="flex flex-col items-center gap-6 mt-4">
          <div className="flex items-center gap-2 relative w-full justify-center">
            <span className="text-4xl font-black text-primary-light/40 mt-3 animate-pulse">
              {transferType === 'sui' ? '$' : ' '}
            </span>
            <input
              className="bg-transparent text-center text-7xl font-black text-white outline-none w-full max-w-[320px] p-0 border-none focus:ring-0 placeholder:text-gray-800 tracking-tighter"
              placeholder="0.00"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            {transferType === 'afriex' && <span className="text-4xl font-black text-[#22c55e]/40 mt-3">{targetCurrency}</span>}
          </div>

          <div className="flex items-center gap-4 bg-surface-dark/40 backdrop-blur-md border border-white/5 p-2 pr-5 rounded-[2rem] shadow-2xl ring-1 ring-white/5">
            <button
              onClick={() => setSelectedAsset(selectedAsset === 'SUI' ? 'USDC' : 'SUI')}
              className={`flex items-center gap-3 rounded-[1.5rem] px-5 py-2.5 cursor-pointer active:scale-95 transition-all shadow-lg ${transferType === 'sui' ? 'bg-primary' : 'bg-[#22c55e]'}`}
            >
              <span className="text-xs font-black uppercase tracking-widest">{selectedAsset}</span>
              <span className="material-symbols-outlined text-lg">swap_horiz</span>
            </button>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Available Balance</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-black text-white">{currentBalance} {selectedAsset}</span>
                <button onClick={setMaxAmount} className="text-[9px] font-black text-primary hover:text-white uppercase tracking-widest bg-primary/10 px-2 py-0.5 rounded-md transition-all">Max</button>
              </div>
            </div>
          </div>

          {transferType === 'afriex' && (
            <div className="flex flex-wrap justify-center gap-3">
              {afriexCurrencies.map(curr => (
                <button
                  key={curr}
                  onClick={() => setTargetCurrency(curr)}
                  className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${targetCurrency === curr ? 'bg-[#22c55e] text-white shadow-lg' : 'bg-surface-dark text-text-tertiary border border-white/5 hover:border-[#22c55e]/50'}`}
                >
                  {curr}
                </button>
              ))}
            </div>
          )}
        </section>

        <section className="mt-4 bg-surface-dark/30 rounded-[2.5rem] p-8 border border-white/5 shadow-2xl relative overflow-hidden group">
          <div className="absolute -top-10 -right-10 opacity-5 group-hover:opacity-10 transition-opacity rotate-12">
            <span className="material-symbols-outlined text-[10rem] text-primary">analytics</span>
          </div>

          <h3 className="text-[10px] font-black text-gray-400 mb-6 flex items-center gap-3 uppercase tracking-[0.25em]">
            <span className={`w-1.5 h-1.5 rounded-full pulse ${transferType === 'sui' ? 'bg-primary' : 'bg-[#22c55e]'}`}></span>
            {transferType === 'sui' ? 'On-Chain Transaction Insight' : 'Cross-Border Exchange Insight'}
          </h3>

          <div className="flex flex-col gap-6">
            <div className="flex justify-between items-start">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Exchange Rate</span>
                <span className="text-base font-black text-white">1 {selectedAsset} ≈ {transferType === 'sui' ? '$1.25' : `${fxRates[targetCurrency]} ${targetCurrency}`}</span>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Service Fee</span>
                <span className={`text-base font-black flex items-center gap-1.5 ${transferType === 'sui' ? 'text-green-400' : 'text-blue-400'}`}>
                  <span className="material-symbols-outlined text-lg font-bold">{transferType === 'sui' ? 'bolt' : 'public'}</span>
                  {transferType === 'sui' ? '0.001 SUI' : '0.5% Afriex'}
                </span>
              </div>
            </div>

            <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

            <div className="flex justify-between items-end">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Estimated Arrival</span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-4xl font-black text-white tracking-tighter">
                    {transferType === 'sui' ? 'Instant' : '2-3 Min'}
                  </span>
                </div>
              </div>
              <div className={`${transferType === 'sui' ? 'bg-primary' : 'bg-[#22c55e]'} shadow-lg rounded-2xl p-3 transform rotate-3 hover:rotate-0 transition-transform cursor-pointer active:scale-95`}>
                <span className="material-symbols-outlined text-white text-2xl font-bold">verified</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      <div className="fixed bottom-0 left-0 w-full glass border-t border-white/10 p-6 pb-10 z-40">
        <div className="max-w-md mx-auto relative px-2">
          <button
            disabled={isWalletLoading || !recipient || parseFloat(amount) <= 0}
            onClick={handleManualConfirm}
            className={`relative w-full h-18 rounded-full overflow-hidden flex items-center justify-center p-1.5 cursor-pointer select-none group border border-white/5 shadow-inner transition-all ${isWalletLoading ? 'bg-gray-800' : 'bg-white/5 hover:bg-white/10'}`}
          >
            {isWalletLoading ? (
              <div className="flex items-center gap-3">
                <div className="size-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                <span className="text-white font-black text-xs uppercase tracking-[0.4em]">Processing...</span>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <span className={`material-symbols-outlined text-2xl font-bold ${transferType === 'sui' ? 'text-primary' : 'text-[#22c55e]'}`}>
                  {transferType === 'sui' ? 'double_arrow' : 'send_money'}
                </span>
                <span className="text-gray-300 font-black text-xs uppercase tracking-[0.4em]">
                  {transferType === 'sui' ? 'Authorize On-Chain' : 'Confirm Cross-Border'}
                </span>
              </div>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SendScreen;
