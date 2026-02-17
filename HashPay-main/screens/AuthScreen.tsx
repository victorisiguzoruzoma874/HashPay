import React, { useState } from 'react';
import { useToast } from '../components/Toast';
import { useWallet } from '../WalletContext';

interface AuthScreenProps {
  onLogin: () => void;
}

const AuthScreen: React.FC<AuthScreenProps> = ({ onLogin }) => {
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [identity, setIdentity] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { showToast } = useToast();
  const { login, register, registerSuiProfile, loginWithWallet } = useWallet();
  const [isConnectingWallet, setIsConnectingWallet] = useState(false);

  const handleSlushConnect = async () => {
    setIsConnectingWallet(true);
    try {
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      await new Promise(resolve => setTimeout(resolve, 1500));
      const mockAddress = "0x" + Math.random().toString(16).slice(2, 42);
      await loginWithWallet(mockAddress);
      onLogin();
    } catch (error: any) {
      console.error("Connection Error:", error);
    } finally {
      setIsConnectingWallet(false);
    }
  };

  const handleSocialLogin = (platform: string) => {
    showToast(`Connecting to ${platform}...`, 'info');
    setTimeout(() => {
      showToast(`${platform} connected!`, 'success');
      onLogin();
    }, 1500);
  };

  const handleBiometrics = () => {
    setIsAuthenticating(true);
    // Simulate FaceID/Biometrics scan
    setTimeout(() => {
      setIsAuthenticating(false);
      showToast('Authentication successful', 'success');
      onLogin(); // In real app, verify against stored token
    }, 2000);
  };

  const handleManualAuth = async () => {
    if (!identity || !password || (authMode === 'signup' && !name)) {
      showToast('Please fill in all fields', 'error');
      return;
    }

    setIsAuthenticating(true);
    try {
      if (authMode === 'login') {
        await login(identity, password);
      } else {
        await register(name, identity, password);
        // Also register on-chain profile
        try {
          await registerSuiProfile(name, 'HashPay User');
        } catch (e) {
          console.error('On-chain registration failed', e);
        }
      }
      onLogin();
    } catch (error) {
      // Error handled in WalletContext
    } finally {
      setIsAuthenticating(false);
    }
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-background-dark text-white animate-fade-in font-body">
      {isAuthenticating && (
        <div className="fixed inset-0 z-[100] bg-background-dark/95 backdrop-blur-2xl flex flex-col items-center justify-center animate-fade-in">
          <div className="relative">
            <div className="w-40 h-40 rounded-[2.5rem] border-2 border-primary/20 flex items-center justify-center overflow-hidden bg-surface-dark/50 shadow-2xl">
              <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-primary/10 to-transparent animate-pulse"></div>
              <span className="material-symbols-outlined text-primary text-7xl">
                {authMode === 'login' ? 'login' : 'person_add'}
              </span>
            </div>
            <div className="absolute -inset-4 border border-primary/10 rounded-[3rem] animate-[spin_12s_linear_infinite]"></div>
          </div>
          <p className="mt-12 text-xl font-black text-white uppercase tracking-widest animate-pulse">
            {authMode === 'login' ? 'Authenticating' : 'Creating Account'}
          </p>
        </div>
      )}

      <div className="absolute top-0 left-0 w-full h-[60vh] bg-gradient-to-b from-primary/10 via-primary/5 to-transparent z-0 pointer-events-none"></div>

      <div className="relative z-10 flex flex-col items-center justify-center pt-24 pb-12 px-8">
        <div className="relative group">
          <div className="absolute -inset-6 bg-primary/10 rounded-[2rem] blur-2xl group-hover:bg-primary/20 transition-all duration-500"></div>
          <div className="w-24 h-24 rounded-[1.75rem] gradient-primary flex items-center justify-center shadow-2xl shadow-primary/30 mb-10 relative z-10 border border-white/10 transform hover:scale-110 active:scale-95 transition-all">
            <span className="material-symbols-outlined text-white text-5xl font-bold">currency_exchange</span>
          </div>
        </div>
        <h1 className="text-5xl font-black tracking-tighter text-center mb-4 font-display">HashPay</h1>
        <p className="text-text-secondary text-center text-xs font-black uppercase tracking-[0.4em] leading-relaxed">
          The next generation of <br />
          <span className="text-primary-light">Web3 Financial freedom</span>
        </p>
      </div>

      <div className="w-full max-w-md mx-auto px-8 mb-12">
        <div className="flex h-16 w-full items-center justify-center rounded-2xl bg-surface-dark/40 p-1.5 border border-white/5 ring-1 ring-white/5">
          <button
            onClick={() => setAuthMode('login')}
            className={`flex-1 h-full rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${authMode === 'login' ? 'bg-primary text-white shadow-xl' : 'text-text-tertiary hover:text-white'}`}
          >
            Log In
          </button>
          <button
            onClick={() => setAuthMode('signup')}
            className={`flex-1 h-full rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${authMode === 'signup' ? 'bg-primary text-white shadow-xl' : 'text-text-tertiary hover:text-white'}`}
          >
            Sign Up
          </button>
        </div>
      </div>

      <div className="w-full max-w-md mx-auto px-8 flex-1">
        <div className="flex flex-col gap-6">
          {authMode === 'signup' && (
            <div className="space-y-2 animate-slide-up">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-tertiary ml-1">Full Name</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-text-tertiary group-focus-within:text-primary transition-colors text-xl">person</span>
                </div>
                <input
                  className="w-full h-16 pl-14 pr-6 rounded-2xl bg-surface-dark/20 border border-white/5 text-white placeholder:text-gray-700 focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/5 transition-all text-base font-bold"
                  placeholder="Your Name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-tertiary ml-1">Universal Identity</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                <span className="material-symbols-outlined text-text-tertiary group-focus-within:text-primary transition-colors text-xl">alternate_email</span>
              </div>
              <input
                className="w-full h-16 pl-14 pr-6 rounded-2xl bg-surface-dark/20 border border-white/5 text-white placeholder:text-gray-700 focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/5 transition-all text-base font-bold"
                placeholder="Email Address"
                type="text"
                value={identity}
                onChange={(e) => setIdentity(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-tertiary ml-1">Secure Pin</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                <span className="material-symbols-outlined text-text-tertiary group-focus-within:text-primary transition-colors text-xl">lock</span>
              </div>
              <input
                className="w-full h-16 pl-14 pr-6 rounded-2xl bg-surface-dark/20 border border-white/5 text-white placeholder:text-gray-700 focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/5 transition-all text-base font-bold"
                placeholder="••••••••"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-6 flex items-center text-text-tertiary hover:text-primary transition-all"
              >
                <span className="material-symbols-outlined text-xl">{showPassword ? 'visibility_off' : 'visibility'}</span>
              </button>
            </div>
          </div>

          <div className="flex gap-4 pt-6">
            <button
              onClick={handleManualAuth}
              className="flex-1 h-16 gradient-primary text-white font-black uppercase tracking-widest rounded-2xl shadow-2xl shadow-primary/20 transition-all active:scale-95 flex items-center justify-center gap-3 border border-white/10"
            >
              <span>{authMode === 'login' ? 'Authorize' : 'Initialize'}</span>
              <span className="material-symbols-outlined text-[20px] font-bold">arrow_forward</span>
            </button>
            <button
              onClick={handleBiometrics}
              className="h-16 w-16 flex items-center justify-center rounded-2xl border border-white/10 bg-surface-dark/40 text-primary hover:bg-primary hover:text-white transition-all active:scale-90 shadow-xl"
            >
              <span className="material-symbols-outlined text-3xl font-bold">face</span>
            </button>
          </div>
        </div>

        <div className="relative py-14">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/5"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="bg-background-dark px-6 text-[10px] font-black uppercase tracking-[0.4em] text-text-tertiary">Cross-Chain Auth</span>
          </div>
        </div>

        <div className="flex flex-col gap-4 pb-14">
          <button
            onClick={handleSlushConnect}
            disabled={isConnectingWallet}
            className="flex h-16 w-full items-center justify-center gap-4 rounded-2xl bg-white text-black hover:bg-white/95 transition-all active:scale-95 shadow-2xl disabled:opacity-50"
          >
            {isConnectingWallet ? (
              <span className="animate-spin material-symbols-outlined text-primary">refresh</span>
            ) : (
              <>
                <div className="h-7 w-7 rounded-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 shadow-md flex items-center justify-center">
                  <span className="material-symbols-outlined text-white text-sm">bolt</span>
                </div>
                <span className="text-xs font-black uppercase tracking-widest text-black">Connect SUI ID (Slush)</span>
              </>
            )}
          </button>
          <button
            onClick={() => handleSocialLogin('Apple')}
            className="flex h-16 w-full items-center justify-center gap-4 rounded-2xl bg-surface-dark border border-white/10 hover:bg-surface-elevated transition-all active:scale-95 shadow-xl glass"
          >
            <span className="material-symbols-outlined text-white text-2xl">ios</span>
            <span className="text-xs font-black uppercase tracking-widest text-white">Continue with Apple</span>
          </button>
        </div>

        <div className="flex items-center justify-center gap-3 pb-12 opacity-30">
          <span className="material-symbols-outlined text-primary text-sm">verified_user</span>
          <span className="text-[10px] font-black uppercase tracking-widest text-text-tertiary">Secured by zk-SNARKs Protocol</span>
        </div>
      </div>
    </div>
  );
};

export default AuthScreen;
