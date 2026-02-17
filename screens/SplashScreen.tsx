
import React, { useEffect, useState } from 'react';

const SplashScreen: React.FC = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-background-dark overflow-hidden relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] aspect-square bg-primary/10 rounded-full blur-[140px] animate-pulse"></div>

      <div className={`relative z-10 flex flex-col items-center transition-all duration-1000 ${mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
        <div className="relative group">
          <div className="absolute -inset-10 bg-primary/20 rounded-[3rem] blur-3xl group-hover:bg-primary/10 transition-all duration-1000"></div>
          <div className="size-32 rounded-[2.5rem] gradient-primary flex items-center justify-center shadow-2xl relative z-10 border border-white/20 animate-scale-in">
            <span className="material-symbols-outlined text-white text-7xl font-bold">currency_exchange</span>
          </div>
        </div>

        <div className="mt-14 text-center flex flex-col items-center">
          <h1 className="text-5xl font-black tracking-tighter text-white font-display mb-3">
            Hash<span className="text-primary-light">Pay</span>
          </h1>
          <div className="flex items-center gap-4">
            <span className="h-0.5 w-6 bg-primary/40 rounded-full"></span>
            <p className="text-xs font-black uppercase tracking-[0.4em] text-text-secondary animate-pulse">SUI Ecosystem</p>
            <span className="h-0.5 w-6 bg-primary/40 rounded-full"></span>
          </div>
        </div>
      </div>

      <div className="absolute bottom-20 left-0 w-full flex flex-col items-center gap-6 transition-all duration-1000 delay-500">
        <div className="flex gap-2">
          <div className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]"></div>
          <div className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]"></div>
          <div className="w-2 h-2 rounded-full bg-primary animate-bounce"></div>
        </div>
        <p className="text-[10px] font-black text-text-tertiary uppercase tracking-widest">Protocol Secured by zk-SNARKs</p>
      </div>
    </div>
  );
};

export default SplashScreen;
