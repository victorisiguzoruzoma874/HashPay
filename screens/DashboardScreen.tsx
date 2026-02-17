import { type FC } from 'react';
import { AppScreen } from '../types';
import { useWallet } from '../WalletContext';
import { useToast } from '../components/Toast';
import { motion } from 'framer-motion';
import { DashboardSkeleton } from '../components/Skeleton';

interface DashboardScreenProps {
  onNavigate: (screen: AppScreen) => void;
}

const DashboardScreen: FC<DashboardScreenProps> = ({ onNavigate }) => {
  const { isLoading, balanceVisible, toggleBalanceVisibility, userProfile, totalFiatValue, notifications, transactions } = useWallet();
  const { showToast } = useToast();
  const unreadCount = notifications.filter(n => !n.read).length;

  const handleActionClick = (label: string, screen?: AppScreen) => {
    if (screen) {
      onNavigate(screen);
    } else {
      showToast(`${label} coming soon!`, 'info');
    }
  };

  if (isLoading) return <DashboardSkeleton />;

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } }
  };

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={containerVariants}
      className="flex flex-col pb-24 lg:pb-10 bg-background-dark min-h-screen custom-scrollbar overflow-y-auto font-body max-w-7xl mx-auto w-full"
    >
      {/* Header */}
      <motion.header variants={itemVariants} className="px-6 py-8 flex items-center justify-between sticky top-0 bg-background-dark/80 backdrop-blur-xl z-40 border-b border-white/5 lg:hidden">
        <div className="flex items-center gap-4">
          <div
            onClick={() => onNavigate(AppScreen.SETTINGS)}
            className="size-14 rounded-2xl bg-cover bg-center border-2 border-primary/20 shadow-2xl cursor-pointer hover:border-primary/50 transition-all active:scale-95 ring-4 ring-primary/5"
            style={{ backgroundImage: `url('${userProfile.avatar}')` }}
          ></div>
          <div className="flex flex-col">
            <span className="text-text-tertiary text-[10px] font-black uppercase tracking-[0.3em]">Verified Secure</span>
            <span className="text-white font-black text-lg tracking-tight font-display">{userProfile.name}</span>
          </div>
        </div>
        <button
          onClick={() => onNavigate(AppScreen.NOTIFICATIONS)}
          className="size-14 rounded-2xl bg-surface-dark/40 border border-white/10 flex items-center justify-center relative hover:bg-surface-elevated transition-all active:scale-90 shadow-xl glass"
        >
          <span className="material-symbols-outlined text-text-secondary text-2xl">notifications</span>
          {unreadCount > 0 && <span className="absolute top-4 right-4 size-3 bg-primary rounded-full border-2 border-background-dark pulse shadow-lg shadow-primary/50"></span>}
        </button>
      </motion.header>

      <main className="flex-1 flex flex-col gap-12 mt-6">
        {/* Balance Card */}
        <motion.section variants={itemVariants} className="px-6">
          <div className="relative overflow-hidden rounded-[3rem] gradient-primary p-10 shadow-2xl group border border-white/20">
            <div className="absolute top-0 right-0 w-72 h-72 bg-white/10 rounded-full blur-3xl -mr-36 -mt-36 group-hover:bg-white/20 transition-all duration-1000"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full blur-3xl -ml-24 -mb-24 group-hover:bg-black/20 transition-all duration-1000"></div>

            <div className="relative z-10 flex flex-col gap-2">
              <div className="flex items-center justify-between opacity-90 mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black text-white uppercase tracking-[0.4em]">Total Portfolio</span>
                  <span className="material-symbols-outlined text-white text-sm">verified</span>
                </div>
                <button onClick={toggleBalanceVisibility} className="text-white/80 hover:text-white transition-colors">
                  <span className="material-symbols-outlined text-2xl">{balanceVisible ? 'visibility' : 'visibility_off'}</span>
                </button>
              </div>
              <div className="flex items-baseline gap-3">
                <span className="text-2xl font-black text-white/50">$</span>
                <span className="text-6xl font-black text-white tracking-tighter font-display">
                  {balanceVisible ? totalFiatValue : '••••••'}
                </span>
              </div>
              <div className="mt-6 flex items-center gap-3 bg-white/10 w-fit px-4 py-2 rounded-full border border-white/10">
                <span className="size-2 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50"></span>
                <span className="text-[10px] font-black text-white uppercase tracking-widest">Live: +2.45% Today</span>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Action Grid */}
        <motion.section variants={itemVariants} className="px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: 'Buy', icon: 'add_shopping_cart', screen: AppScreen.EXCHANGE },
              { label: 'Send', icon: 'north_east', screen: AppScreen.SEND },
              { label: 'Receive', icon: 'south_west', screen: AppScreen.RECEIVE },
              { label: 'Fiat', icon: 'account_balance', screen: AppScreen.FIAT_DASHBOARD }
            ].map((action, i) => (
              <button
                key={i}
                onClick={() => onNavigate(action.screen)}
                className="flex flex-col items-center gap-5 py-8 rounded-[2.5rem] bg-surface-dark/30 border border-white/5 transition-all active:scale-90 group hover:border-primary/40 hover:bg-surface-dark/50 shadow-xl glass"
              >
                <div className="size-14 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:scale-110 group-hover:bg-primary transition-all duration-300">
                  <span className="material-symbols-outlined text-primary text-3xl font-bold group-hover:text-white transition-colors">{action.icon}</span>
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-text-tertiary group-hover:text-white transition-colors">{action.label}</span>
              </button>
            ))}
          </div>
        </motion.section>

        {/* Advanced Matrix */}
        <motion.section variants={itemVariants} className="px-6">
          <div className="flex justify-between items-center mb-8 px-2">
            <h3 className="text-[11px] font-black text-text-tertiary uppercase tracking-[0.4em]">Advanced Matrix</h3>
            <div className="flex items-center gap-2">
              <span className="text-[8px] font-black text-primary uppercase tracking-widest">Live Diagnostics</span>
              <span className="size-2 bg-primary rounded-full animate-ping"></span>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {[
              { label: 'Network Pulse', value: '2.4s', icon: 'speed', color: 'text-blue-400', sub: 'Latent' },
              { label: 'Security Score', value: '98%', icon: 'verified_user', color: 'text-green-400', sub: 'Optimized' },
              { label: 'Yield Rank', value: 'Top 5%', icon: 'trending_up', color: 'text-orange-400', sub: 'Alpha' },
              { label: 'Liquidity', value: '2.4x', icon: 'water_drop', color: 'text-purple-400', sub: 'Stable' }
            ].map((metric, i) => (
              <div key={i} className="p-6 bg-surface-dark/30 rounded-[2.5rem] border border-white/5 hover:border-primary/30 transition-all group glass relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <span className="material-symbols-outlined text-4xl">{metric.icon}</span>
                </div>
                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-text-tertiary mb-3 block">{metric.label}</span>
                <div className="flex items-baseline gap-2">
                  <h4 className={`text-2xl font-black font-display text-white`}>{metric.value}</h4>
                  <span className={`text-[8px] font-black uppercase tracking-widest ${metric.color}`}>{metric.sub}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-6">
            {[
              { label: 'Swap', icon: 'currency_exchange', screen: AppScreen.SWAP, color: 'text-orange-400', bg: 'bg-orange-400/10' },
              { label: 'Escrow', icon: 'lock_clock', screen: AppScreen.ESCROW, color: 'text-purple-400', bg: 'bg-purple-400/10' },
              { label: 'Scan', icon: 'qr_code_scanner', screen: AppScreen.SCAN, color: 'text-green-400', bg: 'bg-green-400/10' },
              { label: 'Vault', icon: 'shield', screen: AppScreen.VAULT, color: 'text-blue-400', bg: 'bg-blue-400/10' }
            ].map((action, i) => (
              <button
                key={i}
                onClick={() => handleActionClick(action.label, action.screen)}
                className="flex flex-col items-center gap-4 group active:scale-90 transition-all"
              >
                <div className={`w-16 h-16 rounded-2xl ${action.bg} flex items-center justify-center border border-white/5 group-hover:border-white/20 group-hover:scale-110 transition-all shadow-xl glass`}>
                  <span className={`material-symbols-outlined text-[30px] ${action.color}`}>{action.icon}</span>
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-text-tertiary group-hover:text-white transition-colors">{action.label}</span>
              </button>
            ))}
          </div>
        </motion.section>

        {/* Recent Activity */}
        <motion.section variants={itemVariants} className="px-6 pb-20 lg:pb-10">
          <div className="flex justify-between items-center mb-8 px-2">
            <h3 className="text-[11px] font-black text-text-tertiary uppercase tracking-[0.4em]">Recent Activity</h3>
            <button className="text-[10px] font-black uppercase text-primary tracking-widest hover:text-primary-light transition-colors">View All</button>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {transactions.slice(0, 4).map((tx, i) => (
              <div key={i} className="flex items-center justify-between p-6 bg-surface-dark/20 rounded-[2rem] border border-white/5 hover:bg-surface-dark/40 hover:border-white/10 transition-all group glass">
                <div className="flex items-center gap-5">
                  <div className={`size-12 rounded-xl flex items-center justify-center shadow-lg ${tx.type === 'sent' ? 'bg-error-bg text-error' : 'bg-success-bg text-success'} border border-white/5`}>
                    <span className="material-symbols-outlined text-xl">{tx.type === 'sent' ? 'north_east' : 'south_west'}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-black text-white uppercase group-hover:text-primary transition-colors font-display tracking-tight">{tx.recipient}</span>
                    <span className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest">{tx.date}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-base font-black font-display ${tx.type === 'sent' ? 'text-error' : 'text-success'}`}>
                    {tx.type === 'sent' ? '-' : '+'}{tx.amount} {tx.currency}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.section>
      </main>
    </motion.div>
  );
};

export default DashboardScreen;
