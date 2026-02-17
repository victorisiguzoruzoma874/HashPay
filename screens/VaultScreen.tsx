import React, { useState } from 'react';
import { AppScreen } from '../types';
import { useWallet } from '../WalletContext';
import { useToast } from '../components/Toast';

interface VaultScreenProps {
  onBack: () => void;
}

const VaultScreen: React.FC<VaultScreenProps> = ({ onBack }) => {
  const { wallets, vaultBalances, moveToVault, removeFromVault, prices } = useWallet();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'storage' | 'security'>('storage');
  const [selectedAsset, setSelectedAsset] = useState(wallets[0]);
  const [amount, setAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleAction = (type: 'deposit' | 'withdraw') => {
    if (!amount || parseFloat(amount) <= 0) {
      showToast('Please enter a valid amount', 'error');
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      if (type === 'deposit') {
        moveToVault(selectedAsset.symbol, parseFloat(amount));
      } else {
        removeFromVault(selectedAsset.symbol, parseFloat(amount));
      }
      setIsProcessing(false);
      setAmount('');
    }, 1500);
  };

  return (
    <div className="bg-background-dark text-white font-display min-h-screen flex flex-col overflow-x-hidden animate-fade-in pb-10">
      <header className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 glass border-b border-white/5">
        <button onClick={onBack} className="flex items-center justify-center size-11 rounded-2xl bg-white/5 hover:bg-white/10 transition-all active:scale-90 shadow-lg border border-white/5">
          <span className="material-symbols-outlined text-2xl">arrow_back</span>
        </button>
        <div className="flex items-center gap-2">
           <span className="material-symbols-outlined text-primary text-2xl font-fill">verified_user</span>
           <h1 className="text-xl font-black leading-tight tracking-tight uppercase tracking-widest text-primary-light">Secure Vault</h1>
        </div>
        <button onClick={() => showToast('Vault Settings coming soon!', 'info')} className="flex items-center justify-center size-11 rounded-2xl bg-white/5 hover:bg-white/10 transition-all active:scale-90 text-gray-400 shadow-lg border border-white/5">
          <span className="material-symbols-outlined text-2xl">security</span>
        </button>
      </header>

      <main className="flex-1 p-6 flex flex-col gap-8 pt-8">
        {/* Vault Status Card */}
        <section className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-primary/30 via-surface-dark to-background-dark p-8 border border-primary/20 shadow-2xl group">
          <div className="absolute top-0 right-0 w-48 h-48 bg-primary/20 rounded-full blur-[80px] -mr-24 -mt-24 group-hover:bg-primary/30 transition-all duration-1000"></div>
          
          <div className="flex justify-between items-start mb-6">
            <div className="flex flex-col gap-1">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Vault Connectivity</p>
              <div className="flex items-center gap-2">
                 <span className="size-2 bg-green-500 rounded-full pulse"></span>
                 <span className="text-[10px] font-black text-white uppercase tracking-widest">Encrypted & Cold</span>
              </div>
            </div>
            <div className="size-12 rounded-2xl bg-primary/20 flex items-center justify-center text-primary shadow-lg border border-primary/20">
               <span className="material-symbols-outlined text-3xl">lock</span>
            </div>
          </div>

          <h2 className="text-4xl font-black text-white tracking-tighter mb-2">
            ${Object.entries(vaultBalances).reduce((acc, [sym, bal]) => acc + (bal * (prices[sym] || 0)), 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </h2>
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Total Value in Secured Storage</p>
        </section>

        {/* Tabs */}
        <div className="flex p-1.5 bg-white/5 rounded-2xl border border-white/5 mx-auto w-full max-w-xs">
          <button 
            onClick={() => setActiveTab('storage')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'storage' ? 'bg-primary text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}
          >
            <span className="material-symbols-outlined text-lg">inventory_2</span>
            Assets
          </button>
          <button 
            onClick={() => setActiveTab('security')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'security' ? 'bg-primary text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}
          >
            <span className="material-symbols-outlined text-lg">shield_person</span>
            Security
          </button>
        </div>

        {activeTab === 'storage' ? (
          <div className="flex flex-col gap-6 animate-slide-up">
            {/* Asset Selector & Amount */}
            <section className="bg-surface-dark/40 border border-white/10 rounded-[2.5rem] p-8 flex flex-col gap-6 shadow-xl">
              <div className="flex justify-between items-center">
                 <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-primary-light">Manage Assets</h3>
                 <button className="size-8 rounded-lg bg-white/5 flex items-center justify-center text-gray-500">
                    <span className="material-symbols-outlined text-lg">info</span>
                 </button>
              </div>

              <div className="flex flex-col gap-5">
                <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/5">
                   <div className={`size-12 rounded-xl flex items-center justify-center ${selectedAsset.color.includes('bg-') ? selectedAsset.color : 'bg-gradient-to-br ' + selectedAsset.color}`}>
                      <span className="material-symbols-outlined text-2xl">{selectedAsset.icon}</span>
                   </div>
                   <div className="flex-1">
                      <p className="text-white font-black text-sm">{selectedAsset.name}</p>
                      <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Wallet: {selectedAsset.balance} {selectedAsset.symbol}</p>
                   </div>
                   <span className="material-symbols-outlined text-gray-600">expand_more</span>
                </div>

                <div className="relative">
                   <input 
                     type="number"
                     placeholder="0.00"
                     value={amount}
                     onChange={(e) => setAmount(e.target.value)}
                     className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-2xl font-black focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-gray-800"
                   />
                   <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                      <button onClick={() => setAmount(selectedAsset.balance.replace(/,/g, ''))} className="px-3 py-1.5 bg-primary/20 text-primary border border-primary/30 rounded-lg text-[9px] font-black uppercase hover:bg-primary hover:text-white transition-all">MAX</button>
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <button 
                     onClick={() => handleAction('deposit')}
                     disabled={isProcessing}
                     className="py-5 bg-primary hover:bg-primary-dark rounded-2xl font-black uppercase tracking-widest text-[11px] transition-all active:scale-95 shadow-xl disabled:opacity-50 flex items-center justify-center gap-2"
                   >
                     {isProcessing ? <div className="size-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div> : <span className="material-symbols-outlined text-lg">download</span>}
                     Deposit
                   </button>
                   <button 
                     onClick={() => handleAction('withdraw')}
                     disabled={isProcessing}
                     className="py-5 bg-white/5 border border-white/10 hover:bg-white/10 rounded-2xl font-black uppercase tracking-widest text-[11px] transition-all active:scale-95 shadow-xl disabled:opacity-50 flex items-center justify-center gap-2"
                   >
                      {isProcessing ? <div className="size-4 border-2 border-primary/20 border-t-primary rounded-full animate-spin"></div> : <span className="material-symbols-outlined text-lg">upload</span>}
                      Release
                   </button>
                </div>
              </div>
            </section>

            {/* Vault Balances List */}
            <section className="flex flex-col gap-4">
               <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 px-2">Currently Secure</h3>
               <div className="flex flex-col gap-3">
                  {wallets.map(w => (
                    <div key={w.id} className="flex items-center justify-between p-5 bg-white/2 rounded-3xl border border-white/5 grayscale-[0.5] hover:grayscale-0 transition-all group">
                       <div className="flex items-center gap-4">
                          <div className={`size-10 rounded-xl flex items-center justify-center opacity-40 group-hover:opacity-100 transition-opacity ${w.color.includes('bg-') ? w.color : 'bg-gradient-to-br ' + w.color}`}>
                             <span className="material-symbols-outlined text-lg">{w.icon}</span>
                          </div>
                          <div className="flex flex-col">
                             <span className="text-xs font-black text-white/60 group-hover:text-white transition-colors">{w.name}</span>
                             <span className="text-[9px] font-bold text-gray-600 uppercase tracking-widest">Secured</span>
                          </div>
                       </div>
                       <div className="text-right">
                          <p className="text-base font-black text-primary-light">
                             {vaultBalances[w.symbol] || 0} <span className="text-[10px] text-gray-600 ml-1">{w.symbol}</span>
                          </p>
                          <p className="text-[9px] font-bold text-gray-700 uppercase">≈ ${((vaultBalances[w.symbol] || 0) * (prices[w.symbol] || 0)).toLocaleString()}</p>
                       </div>
                    </div>
                  ))}
               </div>
            </section>
          </div>
        ) : (
          <div className="flex flex-col gap-6 animate-slide-up">
             {/* Security Features */}
             {[
               { title: 'Biometric Unlock', desc: 'Secure your vault with FaceID or Fingerprint', icon: 'fingerprint', enabled: true },
               { title: 'Time Lock', desc: 'Assets require 24h wait for large releases', icon: 'timer', enabled: false },
               { title: 'Panic Mode', desc: 'Immediately hide and lock all vault assets', icon: 'gpp_maybe', enabled: false, danger: true }
             ].map((feat, i) => (
                <div key={i} className="flex items-center justify-between p-6 bg-surface-dark/40 border border-white/5 rounded-[2rem] hover:bg-surface-dark transition-all group">
                   <div className="flex items-center gap-4">
                      <div className={`size-12 rounded-2xl flex items-center justify-center border shadow-lg ${feat.danger ? 'bg-red-500/10 border-red-500/20 text-red-500' : 'bg-primary/10 border-primary/20 text-primary'}`}>
                         <span className="material-symbols-outlined text-2xl">{feat.icon}</span>
                      </div>
                      <div className="flex flex-col">
                         <span className="text-sm font-black text-white group-hover:text-primary transition-colors">{feat.title}</span>
                         <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">{feat.desc}</span>
                      </div>
                   </div>
                   <div className={`size-10 rounded-xl flex items-center justify-center transition-all ${feat.enabled ? 'bg-green-500/20 text-green-500' : 'bg-white/5 text-gray-700'}`}>
                      <span className="material-symbols-outlined text-xl">{feat.enabled ? 'toggle_on' : 'toggle_off'}</span>
                   </div>
                </div>
             ))}

             <div className="mt-4 p-8 bg-primary/5 rounded-[2.5rem] border border-primary/10 flex flex-col items-center gap-4 text-center">
                <span className="material-symbols-outlined text-4xl text-primary font-fill">verified</span>
                <div>
                   <h4 className="text-xs font-black text-white uppercase tracking-widest">Multi-Signature Recovery</h4>
                   <p className="text-[10px] font-bold text-gray-500 mt-2 leading-relaxed">Your vault recovery key is split into 3 fragments, stored independently on decentralized nodes.</p>
                </div>
                <button onClick={() => showToast('Backup setup coming soon!', 'info')} className="px-8 py-3 bg-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20 active:scale-95 transition-all">Setup Backup</button>
             </div>
          </div>
        )}
      </main>

      <footer className="px-10 py-6 text-center mt-auto opacity-40">
        <p className="text-[9px] font-bold text-gray-600 uppercase tracking-[0.2em] leading-relaxed">
          The vault utilizes industry-standard AES-256 encryption. <br/>
          Hash-pay cannot access or recover your vault assets.
        </p>
      </footer>
    </div>
  );
};

export default VaultScreen;
