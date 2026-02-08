import { useState, useEffect, type FC } from 'react';
import { motion } from 'framer-motion';
import { AppScreen } from '../types';
import { useWallet } from '../WalletContext';
import { AssetsSkeleton } from '../components/Skeleton';

interface AssetsScreenProps {
   onBack: () => void;
   onNavigate: (screen: AppScreen, params?: any) => void;
}

const AssetsScreen: FC<AssetsScreenProps> = ({ onBack, onNavigate }) => {
   const { wallets, totalFiatValue, isLoading } = useWallet();

   const containerVariants = {
      hidden: { opacity: 0 },
      show: {
         opacity: 1,
         transition: {
            staggerChildren: 0.1
         }
      }
   };

   const itemVariants = {
      hidden: { y: 20, opacity: 0 },
      show: { y: 0, opacity: 1 }
   };

   return (
      <div className="bg-background-dark text-white font-display min-h-screen flex flex-col overflow-x-hidden animate-fade-in custom-scrollbar overflow-y-auto pb-10">
         <header className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 glass border-b border-white/5">
            <button onClick={onBack} className="flex items-center justify-center size-11 rounded-2xl bg-white/5 hover:bg-white/10 transition-all active:scale-90 shadow-lg">
               <span className="material-symbols-outlined text-2xl">arrow_back</span>
            </button>
            <h1 className="text-xl font-black leading-tight tracking-tight uppercase tracking-widest text-primary-light">My Assets</h1>
            <button onClick={() => onNavigate(AppScreen.SCAN)} className="flex items-center justify-center size-11 rounded-2xl bg-white/5 hover:bg-white/10 transition-all active:scale-90 text-gray-400">
               <span className="material-symbols-outlined text-2xl">qr_code_scanner</span>
            </button>
         </header>

         {isLoading ? (
            <AssetsSkeleton />
         ) : (
            <motion.main
               variants={containerVariants}
               initial="hidden"
               animate="show"
               className="flex-1 p-6 lg:p-12 flex flex-col gap-10 pt-10 max-w-7xl mx-auto w-full"
            >
               {/* Portfolio Overview */}
               <motion.section variants={itemVariants} className="flex flex-col items-center text-center gap-2">
                  <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.5em] mb-2">Portfolio Value</p>
                  <h2 className="text-5xl font-black text-white tracking-tighter">${totalFiatValue}</h2>
                  <div className="flex items-center gap-2 mt-4 px-4 py-1.5 bg-green-500/10 text-green-500 rounded-full border border-green-500/10">
                     <span className="material-symbols-outlined text-[14px]">trending_up</span>
                     <span className="text-[10px] font-black uppercase tracking-widest">+$420.50 Today</span>
                  </div>
               </motion.section>

               {/* Quick Actions */}
               <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <button
                     onClick={() => onNavigate(AppScreen.BUY)}
                     className="flex items-center justify-center gap-3 py-6 h-18 bg-primary rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-2xl shadow-primary/30 active:scale-95 transition-all text-white"
                  >
                     <span className="material-symbols-outlined text-xl">add_shopping_cart</span>
                     Buy Crypto
                  </button>
                  <button
                     onClick={() => onNavigate(AppScreen.SWAP)}
                     className="flex items-center justify-center gap-3 py-6 h-18 bg-white/5 border border-white/10 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-white/10 active:scale-95 transition-all"
                  >
                     <span className="material-symbols-outlined text-xl">currency_exchange</span>
                     Swap
                  </button>
               </motion.div>

               {/* Assets Grid */}
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                  {/* Assets List */}
                  <motion.section variants={itemVariants} className="flex flex-col gap-4">
                     <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-600 px-2">Individual Protocols</h3>
                     <div className="flex flex-col gap-3">
                        {wallets.map(w => (
                           <motion.div
                              key={w.id}
                              variants={itemVariants}
                              onClick={() => onNavigate(AppScreen.ASSET_DETAILS, w.symbol)}
                              className="flex items-center justify-between p-6 bg-surface-dark/40 border border-white/5 rounded-[2rem] hover:bg-surface-dark transition-all group active:scale-[0.98] cursor-pointer"
                           >
                              <div className="flex items-center gap-5">
                                 <div className={`size-14 rounded-2xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-110 ${w.color.includes('bg-') ? w.color : 'bg-gradient-to-br ' + w.color}`}>
                                    <span className="material-symbols-outlined text-2xl font-bold">{w.icon}</span>
                                 </div>
                                 <div className="flex flex-col">
                                    <span className="text-base font-black text-white group-hover:text-primary transition-colors">{w.name}</span>
                                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-0.5">{w.symbol} @ Mainnet</span>
                                 </div>
                              </div>
                              <div className="text-right">
                                 <p className="text-lg font-black text-white">{w.balance}</p>
                                 <p className="text-[10px] font-bold text-gray-600 uppercase tracking-tighter">≈ ${(parseFloat(w.balance.replace(/,/g, '')) * (w.symbol === 'SUI' ? 1.25 : w.symbol === 'BTC' ? 42000 : 1)).toLocaleString()}</p>
                              </div>
                           </motion.div>
                        ))}
                     </div>
                  </motion.section>

                  {/* Staked / DeFi Section */}
                  <motion.section variants={itemVariants} className="flex flex-col gap-4">
                     <div className="flex justify-between items-center px-2">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-600">DeFi Rewards</h3>
                        <span className="text-[9px] font-bold text-primary-light uppercase tracking-widest">Live APR 12%</span>
                     </div>
                     <div className="p-8 bg-gradient-to-br from-indigo-900/40 to-surface-dark border border-indigo-500/20 rounded-[2.5rem] shadow-2xl relative overflow-hidden group h-fit">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl"></div>
                        <div className="flex flex-col gap-1 relative z-10">
                           <p className="text-[10px] font-black text-indigo-300 uppercase tracking-widest">Total Staked SUI</p>
                           <h4 className="text-2xl font-black text-white tracking-tight">4,200.00 SUI</h4>
                           <div className="h-px bg-indigo-500/20 my-4 w-full"></div>
                           <div className="flex justify-between items-end">
                              <div>
                                 <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-1">Unclaimed Rewards</p>
                                 <p className="text-sm font-black text-green-400 tracking-widest">+12.5 SUI</p>
                              </div>
                              <button className="px-5 py-2.5 bg-indigo-600 text-[9px] font-black uppercase tracking-widest text-white rounded-xl shadow-lg shadow-indigo-500/20 active:scale-95 transition-all">Claim</button>
                           </div>
                        </div>
                     </div>
                  </motion.section>
               </div>
            </motion.main>
         )}

         <footer className="p-10 text-center opacity-30 mt-auto">
            <p className="text-[10px] font-bold uppercase tracking-[0.5em]">H-Pay Asset Management Oracle</p>
         </footer>
      </div>
   );
};

export default AssetsScreen;
