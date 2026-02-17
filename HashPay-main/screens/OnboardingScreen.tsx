
import React, { useState } from 'react';

interface OnboardingScreenProps {
  onFinish: () => void;
}

const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onFinish }) => {
  const [currentPage, setCurrentPage] = useState(0);

  const pages = [
    {
      title: "Universal Identity",
      description: "Connect your existing identity from any network. Email, SNS, or traditional Wallet. One ID for everything Web3.",
      icon: "fingerprint",
      color: "from-blue-600 to-indigo-700"
    },
    {
      title: "Smart Escrows",
      description: "Secure, trustless payments enabled by programmable smart contracts. Only settle when both parties are 100% satisfied.",
      icon: "lock_clock",
      color: "from-indigo-600 to-primary"
    },
    {
      title: "Offline Freedom",
      description: "Broken internet? No problem. Use our specialized USSD protocol to send assets securely with zero connectivity.",
      icon: "cell_tower",
      color: "from-primary to-cyan-500"
    }
  ];

  const handleNext = () => {
    if (currentPage < pages.length - 1) {
      setCurrentPage(prev => prev + 1);
    } else {
      onFinish();
    }
  };

  const page = pages[currentPage];

  return (
    <div className="flex h-screen flex-col bg-background-dark animate-fade-in relative overflow-hidden font-body">
      <div className={`absolute top-0 left-0 w-full h-[70vh] bg-gradient-to-b opacity-20 transition-all duration-1000 ${page.color} blur-[120px]`}></div>

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-10">
        <div key={currentPage} className="flex flex-col items-center animate-scale-in">
          <div className={`size-48 rounded-[3rem] bg-gradient-to-br ${page.color} flex items-center justify-center shadow-2xl mb-14 relative group border border-white/20`}>
            <div className="absolute inset-0 bg-white/10 rounded-[3rem] scale-110 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
            <span className="material-symbols-outlined text-white text-8xl font-bold">{page.icon}</span>
          </div>
          <h2 className="text-5xl font-black text-white text-center mb-8 font-display tracking-tighter leading-[1.1] px-2">{page.title}</h2>
          <p className="text-text-secondary text-center text-lg leading-relaxed max-w-sm px-4 font-medium tracking-tight">
            {page.description}
          </p>
        </div>
      </div>

      <div className="relative z-10 p-12 flex flex-col gap-10 pb-20">
        <div className="flex justify-center gap-4">
          {pages.map((_, i) => (
            <div
              key={i}
              className={`h-2 transition-all duration-500 rounded-full ${i === currentPage ? 'w-12 bg-primary shadow-lg shadow-primary/50' : 'w-2 bg-white/10'}`}
            ></div>
          ))}
        </div>

        <div className="flex items-center justify-between gap-8">
          <button
            onClick={onFinish}
            className="text-[10px] font-black uppercase tracking-[0.3em] text-text-tertiary hover:text-white transition-colors"
          >
            Skip Intro
          </button>
          <button
            onClick={handleNext}
            className="flex-1 h-20 gradient-primary text-white font-black text-[10px] uppercase tracking-[0.3em] rounded-2xl flex items-center justify-center gap-4 shadow-2xl shadow-primary/20 transition-all active:scale-95 group border border-white/10"
          >
            {currentPage === pages.length - 1 ? 'Get Started' : 'Next Step'}
            <span className="material-symbols-outlined text-xl group-hover:translate-x-1 transition-transform">arrow_forward</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingScreen;
