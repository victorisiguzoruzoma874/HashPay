
import React, { useState, useEffect } from 'react';
import { AppScreen } from '../types';
import { useToast } from '../components/Toast';

interface VoiceAssistantScreenProps {
  onBack: () => void;
  onNavigate: (screen: AppScreen) => void;
}

const VoiceAssistantScreen: React.FC<VoiceAssistantScreenProps> = ({ onBack, onNavigate }) => {
  const { showToast } = useToast();
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("I'm listening. Try saying 'Send 10 SUI to Bob'");
  const [vibeScale, setVibeScale] = useState([1, 1, 1, 1, 1]);

  useEffect(() => {
    let interval: any;
    if (isListening) {
      interval = setInterval(() => {
        setVibeScale(vibeScale.map(() => 0.5 + Math.random() * 1.5));
      }, 100);
    } else {
      setVibeScale([1, 1, 1, 1, 1]);
    }
    return () => clearInterval(interval);
  }, [isListening]);

  const toggleListening = () => {
    const nextState = !isListening;
    setIsListening(nextState);
    if (nextState) {
      setTranscript("Listening for command...");
    } else {
      setTranscript("Requesting authorization for 'Send 10 SUI to Bob'...");
      setTimeout(() => {
        showToast('Voice command recognized!', 'success');
        onNavigate(AppScreen.SEND);
      }, 2000);
    }
  };

  return (
    <div className="bg-background-dark text-white font-display min-h-screen flex flex-col overflow-x-hidden animate-fade-in">
      <header className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 glass border-b border-white/5">
        <button onClick={onBack} className="flex items-center justify-center size-11 rounded-2xl bg-white/5 hover:bg-white/10 transition-all active:scale-90 shadow-lg">
          <span className="material-symbols-outlined text-2xl">close</span>
        </button>
        <h1 className="text-xl font-black leading-tight tracking-tight uppercase tracking-widest text-primary-light">Voice Core</h1>
        <button onClick={() => showToast('Voice settings', 'info')} className="flex items-center justify-center size-11 rounded-2xl bg-white/5 hover:bg-white/10 transition-all active:scale-90 text-gray-400 shadow-lg">
          <span className="material-symbols-outlined text-2xl font-bold">settings</span>
        </button>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-8 gap-12">
        <section className="text-center max-w-sm">
          <h2 className={`text-2xl font-black text-white tracking-tight mb-4 transition-all duration-500 ${isListening ? 'scale-110' : ''}`}>AI Financial Assistant</h2>
          <p className="text-gray-500 text-sm font-bold uppercase tracking-widest leading-relaxed">
            {transcript}
          </p>
        </section>

        <section className="relative flex items-center justify-center h-64 w-full">
          <div className={`absolute inset-0 bg-primary/10 rounded-full blur-3xl transition-opacity duration-1000 ${isListening ? 'opacity-100' : 'opacity-0'}`}></div>
          
          <div className="flex items-center gap-3 relative z-10">
            {vibeScale.map((scale, i) => (
              <div 
                key={i}
                className="w-2 rounded-full bg-gradient-to-t from-blue-600 via-primary to-cyan-400 transition-all duration-100 ease-out"
                style={{ height: `${scale * 60}px` }}
              ></div>
            ))}
          </div>
          
          <div className={`absolute size-[280px] border border-primary/20 rounded-full transition-all duration-1000 ${isListening ? 'animate-ping opacity-20' : 'opacity-0'}`}></div>
        </section>

        <section className="flex flex-col items-center gap-6 mt-10">
          <button 
            onClick={toggleListening}
            className={`size-24 rounded-full flex items-center justify-center shadow-2xl transition-all active:scale-90 relative group ${isListening ? 'bg-red-500 shadow-red-500/30' : 'bg-primary shadow-primary/30'}`}
          >
            <div className={`absolute inset-0 rounded-full bg-white/20 animate-ping ${isListening ? 'block' : 'hidden'}`}></div>
            <span className="material-symbols-outlined text-white text-5xl font-bold relative z-10 transition-transform group-hover:scale-110">
              {isListening ? 'stop' : 'mic'}
            </span>
          </button>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-600 animate-pulse">
            {isListening ? 'Tap to process' : 'Tap to speak'}
          </p>
        </section>
      </main>

      <footer className="p-10 pb-16">
        <div className="bg-surface-dark/40 border border-white/5 rounded-[2rem] p-6 shadow-xl">
          <h4 className="text-[10px] font-black uppercase tracking-widest text-primary mb-3">Try Commands</h4>
          <div className="flex flex-wrap gap-2">
            {["Pay Bob 50 SUI", "What's my balance?", "Stake 20 SUI"].map((cmd, i) => (
              <div 
                key={i}
                onClick={() => setTranscript(`Try saying "${cmd}"`)}
                className="bg-white/5 hover:bg-white/10 border border-white/5 px-4 py-2 rounded-xl text-[10px] font-bold text-gray-300 cursor-pointer transition-all active:scale-95"
              >
                {cmd}
              </div>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default VoiceAssistantScreen;
