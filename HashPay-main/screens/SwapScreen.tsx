import React, { useState, useEffect } from 'react';
import { AppScreen } from '../types';
import { useWallet } from '../WalletContext';
import { useToast } from '../components/Toast';

interface SwapScreenProps {
  onBack: () => void;
}

const SwapScreen: React.FC<SwapScreenProps> = ({ onBack }) => {
  const { wallets, swapAssets, prices, isLoading } = useWallet();
  const { showToast } = useToast();
  
  const [fromAsset, setFromAsset] = useState(wallets[0] || { symbol: 'SUI', balance: '0', fiatValue: '0', color: 'bg-primary', icon: 'payments' });
  const [toAsset, setToAsset] = useState(wallets[1] || { symbol: 'USDC', balance: '0', fiatValue: '0', color: 'bg-blue-500', icon: 'toll' });
  const [amount, setAmount] = useState('');
  const [estimatedOutput, setEstimatedOutput] = useState('0.00');

  useEffect(() => {
    if (amount && parseFloat(amount) > 0) {
      const fromRate = prices[fromAsset.symbol] || 1;
      const toRate = prices[toAsset.symbol] || 1;
      const output = (parseFloat(amount) * fromRate) / toRate;
      setEstimatedOutput(output.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 }));
    } else {
      setEstimatedOutput('0.00');
    }
  }, [amount, fromAsset, toAsset, prices]);

  const handleSwap = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      showToast('Please enter a valid amount', 'error');
      return;
    }

    if (parseFloat(amount) > parseFloat(fromAsset.balance.replace(/,/g, ''))) {
      showToast('Insufficient balance', 'error');
      return;
    }

    await swapAssets(fromAsset.symbol, toAsset.symbol, parseFloat(amount));
    setAmount('');
    onBack();
  };

  const switchAssets = () => {
    const temp = fromAsset;
    setFromAsset(toAsset);
    setToAsset(temp);
  };

  return (
    <div className="bg-background-dark text-white font-display min-h-screen flex flex-col overflow-x-hidden animate-fade-in pb-10">
      <header className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 glass border-b border-white/5">
        <button onClick={onBack} className="flex items-center justify-center size-11 rounded-2xl bg-white/5 hover:bg-white/10 transition-all active:scale-90 shadow-lg border border-white/5">
          <span className="material-symbols-outlined text-2xl">arrow_back</span>
        </button>
        <h1 className="text-xl font-black leading-tight tracking-tight uppercase tracking-widest text-primary-light">Swap Assets</h1>
        <button onClick={() => showToast('Swap history coming soon!', 'info')} className="flex items-center justify-center size-11 rounded-2xl bg-white/5 hover:bg-white/10 transition-all active:scale-90 text-gray-400 shadow-lg border border-white/5">
          <span className="material-symbols-outlined text-2xl">history</span>
        </button>
      </header>

      <main className="flex-1 p-6 flex flex-col gap-6 max-w-sm mx-auto w-full pt-10">
        <div className="relative flex flex-col gap-2">
          {/* From Section */}
          <div className="bg-surface-dark/40 border border-white/10 rounded-[2.5rem] p-6 flex flex-col gap-4 shadow-xl">
            <div className="flex justify-between items-center px-1">
              <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Pay with</span>
              <span className="text-[10px] font-bold text-gray-600 uppercase">Balance: {fromAsset.balance} {fromAsset.symbol}</span>
            </div>
            <div className="flex items-center gap-4">
              <input 
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="flex-1 bg-transparent border-none text-3xl font-black focus:outline-none placeholder:text-gray-800"
              />
              <button 
                onClick={() => showToast('Asset selection coming soon!', 'info')}
                className="flex items-center gap-2 bg-white/5 hover:bg-white/10 p-2 pr-4 rounded-2xl border border-white/5 transition-all"
              >
                <div className={`size-8 rounded-xl flex items-center justify-center ${fromAsset.color.includes('bg-') ? fromAsset.color : 'bg-gradient-to-br ' + fromAsset.color}`}>
                  <span className="material-symbols-outlined text-sm">{fromAsset.icon}</span>
                </div>
                <span className="text-sm font-black">{fromAsset.symbol}</span>
                <span className="material-symbols-outlined text-gray-600 text-sm">expand_more</span>
              </button>
            </div>
          </div>

          {/* Switch Button */}
          <button 
            onClick={switchAssets}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 size-12 bg-primary rounded-2xl flex items-center justify-center border-4 border-background-dark shadow-2xl active:rotate-180 transition-all active:scale-90"
          >
            <span className="material-symbols-outlined text-white font-black">swap_vert</span>
          </button>

          {/* To Section */}
          <div className="bg-surface-dark/40 border border-white/10 rounded-[2.5rem] p-6 flex flex-col gap-4 shadow-xl">
            <div className="flex justify-between items-center px-1">
              <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Receive</span>
              <span className="text-[10px] font-bold text-gray-600 uppercase">Balance: {toAsset.balance} {toAsset.symbol}</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex-1 text-3xl font-black text-white/40">
                {estimatedOutput}
              </div>
              <button 
                 onClick={() => showToast('Asset selection coming soon!', 'info')}
                className="flex items-center gap-2 bg-white/5 hover:bg-white/10 p-2 pr-4 rounded-2xl border border-white/5 transition-all"
              >
                <div className={`size-8 rounded-xl flex items-center justify-center ${toAsset.color.includes('bg-') ? toAsset.color : 'bg-gradient-to-br ' + toAsset.color}`}>
                  <span className="material-symbols-outlined text-sm">{toAsset.icon}</span>
                </div>
                <span className="text-sm font-black">{toAsset.symbol}</span>
                <span className="material-symbols-outlined text-gray-600 text-sm">expand_more</span>
              </button>
            </div>
          </div>
        </div>

        {/* Swap Details */}
        <section className="bg-white/5 rounded-3xl p-6 border border-white/5 flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Exchange Rate</span>
            <span className="text-[10px] font-bold text-gray-300 uppercase">1 {fromAsset.symbol} ≈ {(prices[fromAsset.symbol]/prices[toAsset.symbol]).toFixed(6)} {toAsset.symbol}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Slippage Tolerance</span>
            <span className="text-[10px] font-bold text-primary uppercase">0.5%</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Network Fee</span>
            <span className="text-[10px] font-bold text-gray-300 uppercase">≈ 0.001 SUI</span>
          </div>
        </section>

        {/* Action Button */}
        <button 
          onClick={handleSwap}
          disabled={isLoading || !amount}
          className={`w-full py-6 rounded-[2rem] font-black uppercase tracking-[0.2em] shadow-2xl transition-all active:scale-95 flex items-center justify-center gap-3 overflow-hidden group ${isLoading || !amount ? 'bg-gray-800 text-gray-600 cursor-not-allowed' : 'btn-primary'}`}
        >
          {isLoading ? (
            <>
              <div className="size-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
              Swapping...
            </>
          ) : (
            <>
              <span className="material-symbols-outlined group-hover:rotate-180 transition-transform font-bold">currency_exchange</span>
              Confirm Swap
            </>
          )}
        </button>
      </main>

      <footer className="px-10 text-center mt-auto">
        <p className="text-[9px] font-bold text-gray-600 uppercase tracking-widest">
          Hash-pay ensures minimal slippage and best rates <br/> 
          across multiple decentralized liquidity pools.
        </p>
      </footer>
    </div>
  );
};

export default SwapScreen;
