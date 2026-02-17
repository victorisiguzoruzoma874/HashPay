import React, { useState } from 'react';
import { AppScreen } from '../types';
import { useWallet } from '../WalletContext';
import { useToast } from '../components/Toast';

interface BuyScreenProps {
  onBack: () => void;
}

const BuyScreen: React.FC<BuyScreenProps> = ({ onBack }) => {
  const { showToast } = useToast();
  const { wallets } = useWallet();
  const [amount, setAmount] = useState('100');
  const [selectedAsset, setSelectedAsset] = useState(wallets[0]);
  const [paymentMethod, setPaymentMethod] = useState<'apple' | 'card'>('apple');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleBuy = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      showToast(`Successfully purchased ${amount} USD worth of ${selectedAsset.symbol}`, 'success');
      onBack();
    }, 2500);
  };

  return (
    <div className="bg-background-dark text-white font-display min-h-screen flex flex-col animate-fade-in custom-scrollbar overflow-y-auto pb-10">
      <header className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 glass border-b border-white/5">
        <button onClick={onBack} className="flex items-center justify-center size-11 rounded-2xl bg-white/5 hover:bg-white/10 transition-all active:scale-90 shadow-lg">
          <span className="material-symbols-outlined text-2xl">arrow_back</span>
        </button>
        <h1 className="text-xl font-black leading-tight tracking-tight uppercase tracking-widest text-primary-light">Buy Assets</h1>
        <div className="size-11"></div>
      </header>

      <main className="flex-1 p-6 flex flex-col gap-8 pt-10">
        <section className="bg-surface-dark border border-white/5 rounded-[2.5rem] p-8 shadow-2xl flex flex-col gap-6">
          <div className="space-y-2">
            <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">You Pay</p>
            <div className="flex items-center gap-3">
               <span className="text-4xl font-black text-white">$</span>
               <input 
                 type="number" 
                 value={amount}
                 onChange={(e) => setAmount(e.target.value)}
                 className="bg-transparent text-5xl font-black text-white outline-none w-full tracking-tighter"
               />
               <span className="text-xl font-black text-gray-600">USD</span>
            </div>
          </div>

          <div className="h-px bg-white/5"></div>

          <div className="space-y-4">
            <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">Select Asset</p>
            <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
              {wallets.map(w => (
                <button 
                  key={w.id}
                  onClick={() => setSelectedAsset(w)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-2xl border transition-all whitespace-nowrap active:scale-95 ${selectedAsset.id === w.id ? 'bg-primary border-primary text-white shadow-lg' : 'bg-white/5 border-white/10 text-gray-400 opacity-60'}`}
                >
                  <div className={`size-8 rounded-lg flex items-center justify-center ${w.color.includes('bg-') ? w.color : 'bg-gradient-to-br ' + w.color}`}>
                     <span className="material-symbols-outlined text-lg">{w.icon}</span>
                  </div>
                  <span className="text-xs font-black uppercase tracking-widest">{w.name}</span>
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="flex flex-col gap-4">
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 pl-2">Payment Method</h3>
          <div className="space-y-3">
             <button 
               onClick={() => setPaymentMethod('apple')}
               className={`w-full flex items-center justify-between p-6 rounded-3xl border transition-all active:scale-98 ${paymentMethod === 'apple' ? 'bg-primary/10 border-primary/40' : 'bg-surface-dark border-white/5 opacity-60'}`}
             >
                <div className="flex items-center gap-4">
                   <div className="size-12 bg-white rounded-xl flex items-center justify-center shadow-lg">
                      <span className="material-symbols-outlined text-black text-3xl">apple</span>
                   </div>
                   <div className="text-left">
                      <p className="text-sm font-black text-white">Apple Pay</p>
                      <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Fast & Secure</p>
                   </div>
                </div>
                <div className={`size-6 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'apple' ? 'border-primary bg-primary' : 'border-gray-700'}`}>
                   {paymentMethod === 'apple' && <span className="material-symbols-outlined text-white text-base">check</span>}
                </div>
             </button>

             <button 
               onClick={() => setPaymentMethod('card')}
               className={`w-full flex items-center justify-between p-6 rounded-3xl border transition-all active:scale-98 ${paymentMethod === 'card' ? 'bg-primary/10 border-primary/40' : 'bg-surface-dark border-white/5 opacity-60'}`}
             >
                <div className="flex items-center gap-4">
                   <div className="size-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                      <span className="material-symbols-outlined text-white text-3xl">credit_card</span>
                   </div>
                   <div className="text-left">
                      <p className="text-sm font-black text-white">Credit / Debit Card</p>
                      <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Visa • MasterCard</p>
                   </div>
                </div>
                <div className={`size-6 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'card' ? 'border-primary bg-primary' : 'border-gray-700'}`}>
                   {paymentMethod === 'card' && <span className="material-symbols-outlined text-white text-base">check</span>}
                </div>
             </button>
          </div>
        </section>

        <section className="bg-primary/5 rounded-[2.5rem] border border-primary/10 p-8 flex flex-col gap-4">
           <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-gray-500">
              <span>Exchange Rate</span>
              <span className="text-white">1 USD ≈ 0.82 SUI</span>
           </div>
           <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-gray-500">
              <span>Network Fee</span>
              <span className="text-white">$0.00</span>
           </div>
           <div className="h-px bg-primary/10 my-2"></div>
           <div className="flex justify-between items-center">
              <span className="text-sm font-black uppercase tracking-widest text-white">Estimated {selectedAsset.symbol}</span>
              <span className="text-2xl font-black text-primary-light">{(parseFloat(amount) * 0.82).toFixed(2)}</span>
           </div>
        </section>
      </main>

      <footer className="p-8 pb-16">
        <button 
          onClick={handleBuy}
          disabled={isProcessing}
          className="w-full h-20 bg-primary hover:bg-primary-hover text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] shadow-2xl shadow-primary/30 flex items-center justify-center gap-4 transition-all active:scale-95 disabled:opacity-50"
        >
          {isProcessing ? (
             <div className="size-6 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
          ) : (
             <>
               <span className="material-symbols-outlined text-2xl">verified</span>
               Confirm Purchase
             </>
          )}
        </button>
      </footer>
    </div>
  );
};

export default BuyScreen;
