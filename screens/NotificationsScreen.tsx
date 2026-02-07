import React from 'react';
import { motion } from 'framer-motion';
import { useWallet } from '../WalletContext';
import { NotificationsSkeleton } from '../components/Skeleton';

interface NotificationsScreenProps {
  onBack: () => void;
}

const NotificationsScreen: React.FC<NotificationsScreenProps> = ({ onBack }) => {
  const { notifications, markNotificationRead, isLoading, setNotifications } = useWallet();

  const getTypeStyles = (type: string) => {
    switch(type) {
      case 'transaction': return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'security': return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'promo': return 'bg-primary/10 text-primary border-primary/20';
      default: return 'bg-white/5 text-gray-400 border-white/10';
    }
  };

  const getTypeIcon = (type: string) => {
    switch(type) {
      case 'transaction': return 'payments';
      case 'security': return 'gpp_maybe';
      case 'promo': return 'campaign';
      default: return 'notifications';
    }
  };

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
    hidden: { x: -20, opacity: 0 },
    show: { x: 0, opacity: 1 }
  };

  const clearAll = () => {
    setNotifications([]);
  };

  return (
    <div className="bg-background-dark text-white font-display min-h-screen flex flex-col animate-fade-in custom-scrollbar overflow-y-auto pb-10">
      <header className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 glass border-b border-white/5">
        <button onClick={onBack} className="flex items-center justify-center size-11 rounded-2xl bg-white/5 hover:bg-white/10 transition-all active:scale-90 shadow-lg">
          <span className="material-symbols-outlined text-2xl">arrow_back</span>
        </button>
        <h1 className="text-xl font-black leading-tight tracking-tight uppercase tracking-widest text-primary-light">Notifications</h1>
        <button 
          onClick={clearAll}
          className="text-[10px] font-black uppercase text-primary tracking-widest px-3 py-1 bg-primary/10 rounded-lg border border-primary/20 hover:bg-primary/20 transition-all"
        >
          Clear All
        </button>
      </header>

      {isLoading ? (
        <NotificationsSkeleton />
      ) : (
        <motion.main 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="flex-1 p-6 flex flex-col gap-4 pt-10"
        >
          {notifications.length > 0 ? (
            notifications.map(n => (
              <motion.div 
                key={n.id}
                variants={itemVariants}
                onClick={() => markNotificationRead(n.id)}
                className={`relative overflow-hidden p-6 rounded-[2rem] bg-surface-dark/40 border transition-all hover:bg-surface-dark group cursor-pointer ${n.read ? 'border-white/5 opacity-60' : 'border-primary/20 shadow-xl shadow-primary/5'}`}
              >
                 {!n.read && <div className="absolute top-4 right-4 size-2 bg-primary rounded-full pulse"></div>}
                 <div className="flex gap-5">
                    <div className={`size-12 rounded-2xl flex items-center justify-center shrink-0 border shadow-lg ${getTypeStyles(n.type)}`}>
                       <span className="material-symbols-outlined text-2xl">{getTypeIcon(n.type)}</span>
                    </div>
                    <div className="flex-1">
                       <div className="flex justify-between items-start mb-1">
                          <h3 className={`text-sm font-black transition-colors ${n.read ? 'text-gray-400' : 'text-white group-hover:text-primary'}`}>{n.title}</h3>
                          <span className="text-[9px] font-bold text-gray-600 uppercase tracking-widest">{n.date}</span>
                       </div>
                       <p className="text-xs font-bold text-gray-500 leading-relaxed">{n.message}</p>
                    </div>
                 </div>
              </motion.div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-20 opacity-30">
               <span className="material-symbols-outlined text-8xl mb-4">notifications_off</span>
               <p className="text-sm font-black uppercase tracking-[0.3em]">No Notifications</p>
            </div>
          )}
        </motion.main>
      )}

      <footer className="p-10 text-center opacity-30 mt-auto">
         <p className="text-[10px] font-bold uppercase tracking-[0.5em]">H-Pay Relay Protocol</p>
      </footer>
    </div>
  );
};

export default NotificationsScreen;
