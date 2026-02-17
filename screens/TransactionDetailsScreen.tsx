
import React from 'react';
import { useToast } from '../components/Toast';

interface TransactionDetailsScreenProps {
  onBack: () => void;
}

const TransactionDetailsScreen: React.FC<TransactionDetailsScreenProps> = ({ onBack }) => {
  const { showToast } = useToast();

  const handleAction = (label: string) => {
    showToast(`${label} coming soon!`, 'info');
  };

  return (
    <div className="bg-background-dark text-white font-display min-h-screen flex flex-col overflow-x-hidden animate-fade-in custom-scrollbar overflow-y-auto pb-10">
      <header className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 glass border-b border-white/5">
        <button onClick={onBack} className="flex items-center justify-center size-11 rounded-2xl bg-white/5 hover:bg-white/10 transition-all active:scale-90 shadow-lg">
          <span className="material-symbols-outlined text-2xl">arrow_back</span>
        </button>
        <h1 className="text-xl font-black leading-tight tracking-tight uppercase tracking-widest text-primary-light">Transaction</h1>
        <button onClick={() => showToast('Share receipt coming soon!', 'info')} className="flex items-center justify-center size-11 rounded-2xl bg-white/5 hover:bg-white/10 transition-all active:scale-90 text-primary shadow-lg">
          <span className="material-symbols-outlined text-2xl font-bold">ios_share</span>
        </button>
      </header>

      <main className="flex-1 flex flex-col p-6 gap-8 pt-10">
        <section className="flex flex-col items-center">
          <div className="relative mb-8">
            <div className="absolute -inset-4 bg-green-500/10 rounded-full blur-2xl animate-pulse"></div>
            <div className="size-24 rounded-[2rem] bg-green-500/10 flex items-center justify-center border border-green-500/30 relative z-10">
              <span className="material-symbols-outlined text-green-500 text-5xl font-bold">check_circle</span>
            </div>
          </div>
          <h2 className="text-sm font-black text-green-400 uppercase tracking-[0.4em] mb-4">Transfer Complete</h2>
          <div className="flex items-baseline gap-2">
            <span className="text-6xl font-black text-white tracking-tighter">120.00</span>
            <span className="text-2xl font-black text-primary-light/40 tracking-tighter uppercase">SUI</span>
          </div>
          <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-2">≈ $150.00 USD</p>
        </section>

        <section className="bg-surface-dark border border-white/5 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <span className="material-symbols-outlined text-7xl text-primary">analytics</span>
          </div>
          
          <h3 className="text-[10px] font-black text-gray-500 mb-6 uppercase tracking-[0.3em]">Network Settlement Details</h3>
          
          <div className="flex flex-col gap-6">
            {[
              { label: 'Recipient', value: 'Bob Smith', sub: '0x7a...c3f8', icon: 'person' },
              { label: 'Network', value: 'SUI Mainnet', sub: 'Instant Confirmation', icon: 'lan' },
              { label: 'Status', value: 'Confirmed', sub: 'Block #284,910,234', icon: 'verified' },
              { label: 'Transaction Hash', value: '0x9d2b...4e21', sub: 'View on SuiVision', icon: 'hub' },
              { label: 'Timestamp', value: 'Jan 10, 2026', sub: '12:45:08 PM', icon: 'schedule' }
            ].map((detail, i) => (
              <div key={i} className="flex justify-between items-start group/item cursor-pointer">
                <div className="flex gap-4">
                  <div className="size-10 rounded-xl bg-white/5 flex items-center justify-center text-gray-500 group-hover/item:text-primary transition-colors">
                    <span className="material-symbols-outlined text-xl">{detail.icon}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest leading-none mb-1">{detail.label}</span>
                    <span className="text-sm font-black text-white">{detail.value}</span>
                    <span className="text-[10px] font-bold text-gray-600 truncate max-w-[120px]">{detail.sub}</span>
                  </div>
                </div>
                <button className="material-symbols-outlined text-gray-700 text-lg hover:text-white transition-colors">open_in_new</button>
              </div>
            ))}
          </div>
        </section>

        <section className="grid grid-cols-2 gap-4">
          <button 
            onClick={() => handleAction('Support')}
            className="flex flex-col items-center gap-4 p-6 bg-surface-dark/40 hover:bg-surface-dark border border-white/5 rounded-[2rem] transition-all active:scale-95 group shadow-xl"
          >
            <div className="size-14 rounded-2xl bg-orange-500/10 text-orange-400 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
              <span className="material-symbols-outlined text-3xl font-bold">support_agent</span>
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Report Issue</span>
          </button>
          
          <button 
            onClick={() => handleAction('Export')}
            className="flex flex-col items-center gap-4 p-6 bg-surface-dark/40 hover:bg-surface-dark border border-white/5 rounded-[2rem] transition-all active:scale-95 group shadow-xl"
          >
            <div className="size-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
              <span className="material-symbols-outlined text-3xl font-bold">description</span>
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Export PDF</span>
          </button>
        </section>
      </main>

      <footer className="p-10 pb-16 flex flex-col items-center gap-4">
        <button 
          onClick={onBack}
          className="w-full h-18 bg-primary hover:bg-primary-hover text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl flex items-center justify-center gap-3 shadow-2xl shadow-primary/30 transition-all active:scale-95 border border-white/10"
        >
          Return to Dashboard
        </button>
        <p className="text-[9px] font-bold text-gray-700 uppercase tracking-[0.4em]">Transaction Finality Reached</p>
      </footer>
    </div>
  );
};

export default TransactionDetailsScreen;
