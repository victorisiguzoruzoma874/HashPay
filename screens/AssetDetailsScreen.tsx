import React from 'react';
import { useWallet } from '../WalletContext';

interface AssetDetailsScreenProps {
  onBack: () => void;
  assetSymbol: string;
}

const AssetDetailsScreen: React.FC<AssetDetailsScreenProps> = ({ onBack, assetSymbol }) => {
  const { wallets, transactions, prices } = useWallet();
  const asset = wallets.find(w => w.symbol === assetSymbol) || wallets[0];
  const assetPrice = prices[asset.symbol] || 0;
  
  const filteredTransactions = transactions.filter(tx => tx.currency === asset.symbol);

  return (
    <div className="bg-background-dark text-white font-display min-h-screen flex flex-col animate-fade-in custom-scrollbar overflow-y-auto pb-10">
      <header className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 glass border-b border-white/5">
        <button onClick={onBack} className="flex items-center justify-center size-11 rounded-2xl bg-white/5 hover:bg-white/10 transition-all active:scale-90 shadow-lg">
          <span className="material-symbols-outlined text-2xl">arrow_back</span>
        </button>
        <div className="flex flex-col items-center">
           <h1 className="text-xl font-black leading-tight tracking-tight uppercase tracking-widest text-primary-light">{asset.name}</h1>
           <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Mainnet Protocol</span>
        </div>
        <button className="flex items-center justify-center size-11 rounded-2xl bg-white/5 hover:bg-white/10 transition-all active:scale-90 text-gray-400">
           <span className="material-symbols-outlined text-2xl">star</span>
        </button>
      </header>

      <main className="flex-1 p-6 flex flex-col gap-8 pt-10">
        {/* Main Value Display */}
        <section className="flex flex-col items-center text-center gap-2">
           <div className={`size-20 rounded-[1.8rem] flex items-center justify-center mb-4 shadow-2xl ${asset.color.includes('bg-') ? asset.color : 'bg-gradient-to-br ' + asset.color}`}>
              <span className="material-symbols-outlined text-4xl">{asset.icon}</span>
           </div>
           <h2 className="text-5xl font-black text-white tracking-tighter">{asset.balance}</h2>
           <p className="text-sm font-black text-primary-light uppercase tracking-[0.3em]">{asset.symbol}</p>
           <p className="text-gray-500 font-bold text-lg mt-2 uppercase tracking-tighter">≈ ${ (parseFloat(asset.balance.replace(/,/g, '')) * assetPrice).toLocaleString(undefined, { minimumFractionDigits: 2 }) }</p>
        </section>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
           <button className="flex items-center justify-center gap-3 py-5 bg-primary rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-primary/20 active:scale-95 transition-all">
              <span className="material-symbols-outlined text-xl">send</span>
              Send {asset.symbol}
           </button>
           <button className="flex items-center justify-center gap-3 py-5 bg-white/5 border border-white/10 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-white/10 active:scale-95 transition-all">
              <span className="material-symbols-outlined text-xl">add</span>
              Buy {asset.symbol}
           </button>
        </div>

        {/* Chart Simulation */}
        <section className="bg-surface-dark border border-white/5 rounded-[2.5rem] p-8 shadow-2xl flex flex-col gap-6">
           <div className="flex justify-between items-end">
              <div>
                 <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Price Performance</p>
                 <h3 className="text-2xl font-black text-white">${assetPrice.toLocaleString()}</h3>
              </div>
              <div className="px-3 py-1.5 bg-green-500/10 text-green-500 rounded-lg text-[10px] font-black border border-green-500/20">
                 +12.4%
              </div>
           </div>
           
           {/* Mock Chart SVG */}
           <div className="h-40 w-full flex items-end gap-1 px-2 pt-4">
              {[40, 60, 45, 70, 55, 85, 65, 90, 80, 100, 95, 110].map((h, i) => (
                <div 
                  key={i} 
                  className={`flex-1 rounded-t-md transition-all duration-1000 bg-gradient-to-t ${i === 11 ? 'from-primary to-primary-light h-[80%]' : 'from-primary/10 to-primary/30'}`}
                  style={{ height: `${h}%` }}
                ></div>
              ))}
           </div>

           <div className="flex justify-between px-2">
              {['1D', '1W', '1M', '1Y', 'ALL'].map(t => (
                <button key={t} className={`text-[10px] font-black uppercase tracking-widest px-3 py-2 rounded-lg transition-all ${t === '1M' ? 'bg-primary text-white shadow-lg' : 'text-gray-600 hover:text-white'}`}>{t}</button>
              ))}
           </div>
        </section>

        {/* Recent Transactions */}
        <section className="flex flex-col gap-4">
           <div className="flex justify-between items-center px-2">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">History</h3>
              <button className="text-[10px] font-black uppercase text-primary tracking-widest">View All</button>
           </div>
           <div className="flex flex-col gap-3">
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map(tx => (
                  <div key={tx.id} className="flex items-center justify-between p-5 bg-white/2 rounded-3xl border border-white/5 hover:bg-white/5 transition-all group">
                     <div className="flex items-center gap-4">
                        <div className={`size-10 rounded-xl flex items-center justify-center shadow-lg ${tx.type === 'sent' ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500'}`}>
                           <span className="material-symbols-outlined text-lg">{tx.type === 'sent' ? 'north_east' : 'south_west'}</span>
                        </div>
                        <div className="flex flex-col">
                           <span className="text-xs font-black text-white uppercase group-hover:text-primary transition-colors">{tx.recipient}</span>
                           <span className="text-[9px] font-bold text-gray-600 uppercase tracking-widest">{tx.date}</span>
                        </div>
                     </div>
                     <div className="text-right">
                        <p className={`text-sm font-black ${tx.type === 'sent' ? 'text-red-500' : 'text-green-500'}`}>
                           {tx.type === 'sent' ? '-' : '+'}{tx.amount} {tx.currency}
                        </p>
                        <p className="text-[9px] font-bold text-gray-700 uppercase">≈ ${ (parseFloat(tx.amount.replace(/,/g, '')) * assetPrice).toLocaleString() }</p>
                     </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-10 bg-white/2 rounded-3xl border border-dashed border-white/5">
                   <p className="text-[10px] font-black text-gray-700 uppercase tracking-widest">No transaction history</p>
                </div>
              )}
           </div>
        </section>
      </main>

      <footer className="p-10 text-center opacity-30 mt-auto">
         <p className="text-[10px] font-bold uppercase tracking-[0.5em]">Real-time Market Data Powered by Oracle</p>
      </footer>
    </div>
  );
};

export default AssetDetailsScreen;
