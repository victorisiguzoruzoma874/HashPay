import React, { useState, useEffect } from 'react';
import { AppScreen } from '../types';
import { useToast } from '../components/Toast';

interface ScanScreenProps {
  onBack: () => void;
  onNavigate: (screen: AppScreen, params?: any) => void;
}

const ScanScreen: React.FC<ScanScreenProps> = ({ onBack, onNavigate }) => {
  const { showToast } = useToast();
  const [flashlight, setFlashlight] = useState(false);
  const [isScanning, setIsScanning] = useState(true);

  useEffect(() => {
    // Simulate a successful scan after 4 seconds
    const timer = setTimeout(() => {
      setIsScanning(false);
      showToast('QR Code Detected: 0x71C7...9A2', 'success');
      setTimeout(() => {
        onNavigate(AppScreen.SEND, { address: '0x71C7...9A2' });
      }, 1000);
    }, 4000);
    return () => clearTimeout(timer);
  }, [showToast, onNavigate]);

  return (
    <div className="bg-black text-white font-display min-h-screen flex flex-col overflow-hidden animate-fade-in">
      {/* Viewfinder Header */}
      <header className="absolute top-0 inset-x-0 z-50 flex items-center justify-between px-6 py-8 bg-gradient-to-b from-black/80 to-transparent">
        <button onClick={onBack} className="flex items-center justify-center size-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 active:scale-95 transition-all">
          <span className="material-symbols-outlined text-2xl">close</span>
        </button>
        <div className="flex flex-col items-center">
          <h2 className="text-sm font-black uppercase tracking-widest text-white/90">Scan QR Code</h2>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="size-1.5 bg-green-500 rounded-full animate-pulse"></span>
            <span className="text-[10px] font-bold text-green-500 uppercase tracking-widest">Camera Ready</span>
          </div>
        </div>
        <button 
          onClick={() => setFlashlight(!flashlight)} 
          className={`flex items-center justify-center size-12 rounded-2xl backdrop-blur-md border active:scale-95 transition-all ${flashlight ? 'bg-primary border-primary text-white shadow-[0_0_20px_rgba(56,152,236,0.5)]' : 'bg-white/10 border-white/10 text-white'}`}
        >
          <span className="material-symbols-outlined text-2xl">{flashlight ? 'flashlight_on' : 'flashlight_off'}</span>
        </button>
      </header>

      {/* Viewfinder Main */}
      <main className="relative flex-1 flex items-center justify-center p-8">
        <div className="relative w-full aspect-square max-w-xs">
          {/* Scanner Frame */}
          <div className="absolute inset-0 border-2 border-white/20 rounded-[3rem]"></div>
          
          {/* Animated Corners */}
          <div className="absolute top-0 left-0 size-16 border-t-4 border-l-4 border-primary rounded-tl-[3rem]"></div>
          <div className="absolute top-0 right-0 size-16 border-t-4 border-r-4 border-primary rounded-tr-[3rem]"></div>
          <div className="absolute bottom-0 left-0 size-16 border-b-4 border-l-4 border-primary rounded-bl-[3rem]"></div>
          <div className="absolute bottom-0 right-0 size-16 border-b-4 border-r-4 border-primary rounded-br-[3rem]"></div>

          {/* Scanning Line */}
          {isScanning && (
            <div className="absolute inset-x-8 h-1 bg-gradient-to-r from-transparent via-primary to-transparent shadow-[0_0_15px_rgba(56,152,236,0.8)] animate-scan-move rounded-full"></div>
          )}

          {/* Success Overlay */}
          {!isScanning && (
            <div className="absolute inset-0 flex items-center justify-center animate-scale-in">
              <div className="size-20 bg-primary/20 backdrop-blur-xl border border-primary/50 rounded-full flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-5xl font-black">check_circle</span>
              </div>
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="absolute bottom-32 inset-x-0 text-center px-10 flex flex-col gap-3">
          <p className="text-xs font-bold text-white/60 leading-relaxed">
            Position the QR code inside the frame to scan it automatically
          </p>
          <div className="flex items-center justify-center gap-4 mt-4">
             <button onClick={() => showToast('Gallery import coming soon!', 'info')} className="px-6 py-3 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-2 hover:bg-white/10 transition-all active:scale-95">
               <span className="material-symbols-outlined text-xl">image</span>
               <span className="text-[10px] font-black uppercase tracking-widest">Import</span>
             </button>
             <button onClick={() => onNavigate(AppScreen.RECEIVE)} className="px-6 py-3 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-2 hover:bg-white/10 transition-all active:scale-95">
               <span className="material-symbols-outlined text-xl">qr_code</span>
               <span className="text-[10px] font-black uppercase tracking-widest">My Code</span>
             </button>
          </div>
        </div>
      </main>

      {/* Footer Branding */}
      <footer className="p-10 flex justify-center opacity-30">
        <h1 className="text-xl font-black uppercase tracking-[0.5em] text-white">Hash Pay</h1>
      </footer>
    </div>
  );
};

export default ScanScreen;
