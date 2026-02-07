import React, { useState, useEffect } from 'react';
import { useWallet } from '../WalletContext';
import { useToast } from '../components/Toast';

interface RecoveryPhraseScreenProps {
  onBack: () => void;
}

const RecoveryPhraseScreen: React.FC<RecoveryPhraseScreenProps> = ({ onBack }) => {
  const { recoveryPhrase, isPhraseVerified, verifyPhrase } = useWallet();
  const { showToast } = useToast();
  const [hidden, setHidden] = useState(true);
  const [step, setStep] = useState<'view' | 'verify'>(isPhraseVerified ? 'view' : 'view');
  const [verifyIndices, setVerifyIndices] = useState<number[]>([]);
  const [selectedWords, setSelectedWords] = useState<string[]>(['', '', '']);
  const [randomOptions, setRandomOptions] = useState<string[][]>([[], [], []]);

  useEffect(() => {
    if (step === 'verify') {
      // Pick 3 random unique indices
      const indices: number[] = [];
      while (indices.length < 3) {
        const rand = Math.floor(Math.random() * recoveryPhrase.length);
        if (!indices.includes(rand)) indices.push(rand);
      }
      indices.sort((a, b) => a - b);
      setVerifyIndices(indices);

      // Create options for each index
      const newOptions = indices.map(idx => {
        const correctWord = recoveryPhrase[idx];
        const others = [...recoveryPhrase].filter(w => w !== correctWord);
        const distractors = others.sort(() => 0.5 - Math.random()).slice(0, 3);
        return [correctWord, ...distractors].sort(() => 0.5 - Math.random());
      });
      setRandomOptions(newOptions);
    }
  }, [step, recoveryPhrase]);

  const handleCopy = () => {
    navigator.clipboard.writeText(recoveryPhrase.join(' '));
    showToast('Recovery phrase copied to clipboard', 'success');
  };

  const handleVerify = () => {
    const isCorrect = verifyIndices.every((idx, i) => selectedWords[i] === recoveryPhrase[idx]);
    if (isCorrect) {
      verifyPhrase();
      onBack();
    } else {
      showToast('Incorrect words. Please check your backup.', 'error');
    }
  };

  if (step === 'view') {
    return (
      <div className="bg-background-dark text-white font-display min-h-screen flex flex-col animate-fade-in custom-scrollbar overflow-y-auto pb-10">
        <header className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 glass border-b border-white/5">
          <button onClick={onBack} className="flex items-center justify-center size-11 rounded-2xl bg-white/5 hover:bg-white/10 transition-all active:scale-90 shadow-lg">
            <span className="material-symbols-outlined text-2xl">arrow_back</span>
          </button>
          <h1 className="text-xl font-black leading-tight tracking-tight uppercase tracking-widest text-primary-light">Recovery Phrase</h1>
          <div className="size-11"></div>
        </header>

        <main className="flex-1 p-6 flex flex-col gap-8 pt-10">
          <section className="bg-orange-500/10 border border-orange-500/20 rounded-[2rem] p-6 flex gap-4 items-start shadow-xl">
             <div className="size-12 rounded-2xl bg-orange-500/20 flex items-center justify-center text-orange-400 shrink-0">
                <span className="material-symbols-outlined text-3xl">warning</span>
             </div>
             <div>
                <h4 className="text-sm font-black text-white uppercase tracking-widest mb-1 text-orange-400">Security Warning</h4>
                <p className="text-[10px] font-bold text-gray-400 leading-relaxed uppercase tracking-wider">
                  This is the MASTER KEY to your account. Never share it with anyone. Hash-pay support will NEVER ask for this phrase.
                </p>
             </div>
          </section>

          <section className="bg-surface-dark border border-white/5 rounded-[2.5rem] p-8 shadow-2xl relative">
             <div className="grid grid-cols-3 gap-3">
                {recoveryPhrase.map((word, i) => (
                  <div key={i} className="relative aspect-video rounded-xl bg-white/5 border border-white/5 flex flex-col items-center justify-center gap-1 overflow-hidden group">
                     <span className="text-[8px] font-black text-gray-600 uppercase tracking-widest">{i + 1}</span>
                     <span className={`text-xs font-black transition-all duration-500 ${hidden ? 'blur-md select-none' : 'blur-none'}`}>{word}</span>
                  </div>
                ))}
             </div>

             {hidden && (
               <div className="absolute inset-0 z-20 flex items-center justify-center bg-background-dark/40 backdrop-blur-sm rounded-[2.5rem]">
                  <button 
                    onClick={() => setHidden(false)}
                    className="px-6 py-3 bg-primary text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-xl shadow-2xl shadow-primary/40 active:scale-95 transition-all flex items-center gap-3"
                  >
                     <span className="material-symbols-outlined">visibility</span>
                     Reveal Secrets
                  </button>
               </div>
             )}
          </section>

          {!hidden && (
            <div className="flex flex-col gap-4 animate-slide-up">
               <button 
                 onClick={handleCopy}
                 className="w-full py-5 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center gap-3 font-black text-[10px] uppercase tracking-widest hover:bg-white/10 active:scale-95 transition-all text-primary"
               >
                  <span className="material-symbols-outlined">content_copy</span>
                  Copy to Clipboard
               </button>
               
               <div className="flex items-center gap-3 p-4 bg-white/2 rounded-2xl border border-white/5">
                  <span className="material-symbols-outlined text-gray-600">info</span>
                  <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest leading-relaxed">
                     We recommend writing this down on physical paper and storing it in a safe location.
                  </p>
               </div>
            </div>
          )}
        </main>

        <footer className="p-8 pb-16 mt-auto">
          <button 
            onClick={() => {
              if (hidden) {
                 showToast('Please reveal and store your phrase first', 'warning');
              } else {
                 setStep('verify');
              }
            }}
            className="w-full h-18 bg-primary hover:bg-primary-hover text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-primary/30 flex items-center justify-center gap-3 transition-all active:scale-95"
          >
            <span className="material-symbols-outlined">verified</span>
            I've secured my key
          </button>
        </footer>
      </div>
    );
  }

  return (
    <div className="bg-background-dark text-white font-display min-h-screen flex flex-col animate-fade-in custom-scrollbar overflow-y-auto pb-10">
      <header className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 glass border-b border-white/5">
        <button onClick={() => setStep('view')} className="flex items-center justify-center size-11 rounded-2xl bg-white/5 hover:bg-white/10 transition-all active:scale-90 shadow-lg">
          <span className="material-symbols-outlined text-2xl">arrow_back</span>
        </button>
        <h1 className="text-xl font-black leading-tight tracking-tight uppercase tracking-widest text-primary-light">Verify Phrase</h1>
        <div className="size-11"></div>
      </header>

      <main className="flex-1 p-6 flex flex-col gap-10 pt-10">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 text-center px-4">
          Select the correct words to confirm your backup
        </p>

        <div className="flex flex-col gap-8">
          {verifyIndices.map((idx, i) => (
            <div key={idx} className="flex flex-col gap-4">
              <label className="text-xs font-black uppercase tracking-widest text-primary">Word #{idx + 1}</label>
              <div className="grid grid-cols-2 gap-3">
                {randomOptions[i].map(option => (
                  <button
                    key={option}
                    onClick={() => {
                      const newSelected = [...selectedWords];
                      newSelected[i] = option;
                      setSelectedWords(newSelected);
                    }}
                    className={`h-14 rounded-2xl border transition-all font-bold text-xs uppercase tracking-widest ${selectedWords[i] === option ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20' : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'}`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>

      <footer className="p-8 pb-16 mt-auto">
        <button 
          onClick={handleVerify}
          disabled={selectedWords.includes('')}
          className={`w-full h-18 rounded-2xl font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all active:scale-95 ${selectedWords.includes('') ? 'bg-white/5 text-gray-600 opacity-50 cursor-not-allowed' : 'bg-primary hover:bg-primary-hover text-white shadow-2xl shadow-primary/30'}`}
        >
          <span className="material-symbols-outlined">check_circle</span>
          Complete Verification
        </button>
      </footer>
    </div>
  );
};

export default RecoveryPhraseScreen;
