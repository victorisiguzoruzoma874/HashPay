
import React, { useState } from 'react';
import { useToast } from '../components/Toast';

interface OfflineModeScreenProps {
  onBack: () => void;
}

const OfflineModeScreen: React.FC<OfflineModeScreenProps> = ({ onBack }) => {
  const { showToast } = useToast();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [isDialing, setIsDialing] = useState(false);
  const [offlineQueue, setOfflineQueue] = useState<any[]>([]);

  const handleDial = () => {
    if (!phoneNumber || !amount) {
      showToast('Please fill in all details', 'error');
      return;
    }
    setIsDialing(true);
    showToast('Initializing USSD session...', 'info');
    setTimeout(() => {
      setIsDialing(false);
      setOfflineQueue(prev => [...prev, { phoneNumber, amount, status: 'queued' }]);
      showToast('Transaction queued for USSD relay!', 'success');
      setPhoneNumber('');
      setAmount('');
    }, 2500);
  };

  return (
    <div className="bg-background-dark text-white font-display min-h-screen flex flex-col overflow-x-hidden animate-fade-in custom-scrollbar overflow-y-auto pb-10">
      <header className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 glass border-b border-white/5">
        <button onClick={onBack} className="flex items-center justify-center size-11 rounded-2xl bg-white/5 hover:bg-white/10 transition-all active:scale-90 shadow-lg">
          <span className="material-symbols-outlined text-2xl">arrow_back</span>
        </button>
        <h1 className="text-xl font-black leading-tight tracking-tight uppercase tracking-widest text-primary-light">Offline Core</h1>
        <button onClick={() => showToast('Offline protocol help', 'info')} className="flex items-center justify-center size-11 rounded-2xl bg-white/5 hover:bg-white/10 transition-all active:scale-90 text-gray-400 shadow-lg">
          <span className="material-symbols-outlined text-2xl font-bold">cell_tower</span>
        </button>
      </header>

      {isDialing && (
        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-2xl flex flex-col items-center justify-center animate-fade-in">
          <div className="relative mb-8">
            <div className="size-32 rounded-[2.5rem] bg-primary/20 flex items-center justify-center border border-primary/30 relative overflow-hidden">
               <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent animate-pulse"></div>
               <span className="material-symbols-outlined text-primary text-6xl animate-bounce">cell_tower</span>
            </div>
            <div className="absolute -inset-4 border border-primary/20 rounded-[3.5rem] animate-[spin_10s_linear_infinite]"></div>
          </div>
          <p className="text-2xl font-black text-white uppercase tracking-widest animate-pulse px-8 text-center">Dialing Hash Gateway</p>
          <p className="mt-4 text-gray-500 text-xs font-bold uppercase tracking-[0.3em] text-center px-12 leading-relaxed">Encrypted USSD packets are being transmitted via satellite relay</p>
        </div>
      )}

      <main className="flex-1 flex flex-col p-6 gap-8">
        <section className="bg-surface-dark border border-white/5 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group">
          <div className="absolute -top-10 -right-10 size-40 bg-orange-500/10 rounded-full blur-3xl group-hover:bg-orange-500/20 transition-all"></div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-6">
              <div className="size-14 rounded-2xl bg-orange-500/10 text-orange-400 flex items-center justify-center border border-orange-500/20 shadow-xl">
                <span className="material-symbols-outlined text-3xl font-bold">wifi_off</span>
              </div>
              <div>
                <h3 className="text-xl font-black text-white tracking-tight uppercase">Internet-Free</h3>
                <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em] mt-0.5">Hash Proxy Protocol</p>
              </div>
            </div>
            <p className="text-gray-400 text-xs font-bold leading-relaxed tracking-tight">
              Send assets using standard telecommunication networks. Works in areas with zero data coverage.
            </p>
          </div>
        </section>

        <section className="flex flex-col gap-8 flex-1">
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 pl-1">Recipient Phone / Wallet Alias</label>
              <div className="relative group/input">
                <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-gray-600 group-focus-within/input:text-primary transition-colors">call</span>
                </div>
                <input 
                  type="text" 
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className="w-full h-20 pl-16 pr-6 rounded-3xl bg-surface-dark/50 border border-white/10 focus:border-primary focus:ring-4 focus:ring-primary/10 text-xl font-black placeholder:text-gray-700 outline-none transition-all shadow-xl"
                />
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 pl-1">Amount to Transmit</label>
              <div className="bg-surface-dark border border-white/5 rounded-[2.5rem] p-8 flex flex-col items-center gap-2 shadow-2xl">
                 <div className="flex items-baseline gap-2">
                   <span className="text-3xl font-black text-gray-600">$</span>
                   <input 
                    type="number" 
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="bg-transparent text-6xl font-black text-white outline-none w-full text-center border-none focus:ring-0 p-0 placeholder:text-gray-800 tracking-tighter"
                   />
                 </div>
                 <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-full border border-white/5 mt-4">
                    <span className="w-2 h-2 rounded-full bg-primary pulse"></span>
                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">SUI via USSD Relay</span>
                 </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="p-8 pb-16">
        <button 
          onClick={handleDial}
          className="w-full h-20 bg-primary hover:bg-primary-hover text-white font-black text-xs uppercase tracking-[0.3em] rounded-[2rem] flex items-center justify-center gap-4 shadow-2xl shadow-primary/30 transition-all active:scale-95 border border-white/10 relative overflow-hidden"
        >
          <div className="absolute inset-y-0 left-0 w-2 bg-white/20"></div>
          <span className="material-symbols-outlined text-2xl font-bold">perm_phone_msg</span>
          Send Offline Payment
        </button>
        <p className="mt-8 text-[9px] font-bold text-gray-700 uppercase tracking-[0.3em] text-center leading-relaxed">
          Standard carrier rates may apply. <br/>
          Securely hashed via HashBridge Gateway.
        </p>
      </footer>
    </div>
  );
};

export default OfflineModeScreen;
