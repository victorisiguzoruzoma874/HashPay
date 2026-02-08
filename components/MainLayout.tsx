import { type FC, type ReactNode } from 'react';
import * as React from 'react';
import { motion } from 'framer-motion';
import { AppScreen } from '../types';

interface MainLayoutProps {
  children: ReactNode;
  currentScreen: AppScreen;
  onNavigate: (screen: AppScreen) => void;
  hideNav?: boolean;
}

const MainLayout: FC<MainLayoutProps> = ({ children, currentScreen, onNavigate, hideNav = false }) => {
  const isPublicScreen = [AppScreen.SPLASH, AppScreen.ONBOARDING, AppScreen.AUTH].includes(currentScreen);

  if (isPublicScreen || hideNav) {
    return <>{children}</>;
  }

  const navItems = [
    { label: 'Home', icon: 'home', screen: AppScreen.DASHBOARD },
    { label: 'Assets', icon: 'account_balance_wallet', screen: AppScreen.ASSETS },
    { label: 'Swap', icon: 'swap_horiz', screen: AppScreen.SWAP },
    { label: 'Fiat', icon: 'account_balance', screen: AppScreen.FIAT_DASHBOARD },
    { label: 'Settings', icon: 'settings', screen: AppScreen.SETTINGS },
  ];

  return (
    <div className="flex h-screen bg-background-dark overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-[var(--sidebar-width)] flex-col border-r border-white/5 bg-background-dark p-6 overflow-y-auto">
        <div className="flex items-center gap-3 mb-10 px-2 outline-none" onClick={() => onNavigate(AppScreen.DASHBOARD)}>
          <div className="size-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
            <span className="material-symbols-outlined text-white text-2xl font-bold">bolt</span>
          </div>
          <h1 className="text-xl font-black tracking-tight font-display text-white">HashPay</h1>
        </div>

        <nav className="flex-1 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.screen}
              onClick={() => onNavigate(item.screen)}
              className={`w - full flex items - center gap - 4 px - 4 py - 4 rounded - 2xl transition - all ${currentScreen === item.screen
                  ? 'bg-primary/10 text-white shadow-xl'
                  : 'text-text-tertiary hover:text-white hover:bg-white/5'
                } `}
            >
              <span className={`material - symbols - outlined text - 2xl ${currentScreen === item.screen ? 'text-primary font-fill' : ''} `}>
                {item.icon}
              </span>
              <span className="text-[10px] font-black uppercase tracking-widest">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="mt-auto p-4 bg-surface-dark/30 rounded-2xl border border-white/5">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined">verified_user</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] font-black text-white uppercase">Secure Session</span>
              <span className="text-[8px] font-bold text-green-400 uppercase">Active</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative overflow-hidden h-full">
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {children}
        </div>

        {/* Mobile Bottom Nav */}
        <nav className="lg:hidden fixed bottom-0 left-0 w-full glass border-t border-white/10 pb-safe z-50">
          <div className="flex items-center justify-around px-4 h-20">
            {navItems.map((item) => {
              const isActive = currentScreen === item.screen;
              return (
                <button
                  key={item.screen}
                  onClick={() => onNavigate(item.screen)}
                  className={`flex flex - col items - center gap - 1.5 min - w - [64px] transition - all active: scale - 95 ${isActive ? 'text-primary' : 'text-text-tertiary'
                    } `}
                >
                  <div className={`relative ${isActive ? 'scale-110' : ''} `}>
                    <span className={`material - symbols - outlined text - [26px] ${isActive ? 'font-fill' : 'opacity-60'} `}>
                      {item.icon}
                    </span>
                  </div>
                  <span className="text-[8px] font-black uppercase tracking-[0.1em]">{item.label}</span>
                </button>
              );
            })}
          </div>
        </nav>
      </main>
    </div>
  );
};

export default MainLayout;
