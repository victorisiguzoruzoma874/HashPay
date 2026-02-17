
import React, { useState } from 'react';
import { AppScreen } from '../types';
import { useToast } from '../components/Toast';
import { useWallet } from '../WalletContext';
import BottomSheet from '../components/BottomSheet';

interface SettingsScreenProps {
  onBack: () => void;
  onDisconnect: () => void;
  onNavigate: (screen: AppScreen) => void;
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({ onBack, onDisconnect, onNavigate }) => {
  const { showToast } = useToast();
  const { userProfile, updateUserProfile, appSettings, updateAppSettings } = useWallet();
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isSecurityCenterOpen, setIsSecurityCenterOpen] = useState(false);
  
  // Local state for profile form
  const [tempProfile, setTempProfile] = useState(userProfile);

  const handleSaveProfile = () => {
    updateUserProfile(tempProfile);
    setIsEditProfileOpen(false);
    showToast('Profile updated successfully', 'success');
  };

  return (
    <div className="relative flex h-full min-h-screen w-full flex-col bg-background-dark shadow-xl animate-fade-in custom-scrollbar overflow-y-auto pb-24">
      <header className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 glass border-b border-white/5">
        <button onClick={onBack} className="flex size-11 items-center justify-center rounded-2xl bg-white/5 hover:bg-white/10 transition-all active:scale-90 shadow-lg">
          <span className="material-symbols-outlined text-white">arrow_back</span>
        </button>
        <h1 className="text-xl font-black leading-tight tracking-tight uppercase tracking-widest text-primary-light">Profile Settings</h1>
        <button onClick={() => onNavigate(AppScreen.SCAN)} className="flex size-11 items-center justify-center rounded-2xl bg-white/5 hover:bg-white/10 transition-all active:scale-90 shadow-lg">
          <span className="material-symbols-outlined text-white">qr_code_scanner</span>
        </button>
      </header>

      <main className="flex-1 pb-10">
        <div className="flex flex-col items-center px-6 pt-10 pb-4">
          <div className="relative mb-6 group">
            <div className="absolute -inset-2 bg-primary/20 rounded-full blur-xl group-hover:bg-primary/40 transition-all"></div>
            <div 
              className="size-32 rounded-[2.5rem] bg-cover bg-center border-4 border-background-dark ring-4 ring-white/5 shadow-2xl relative z-10" 
              style={{ backgroundImage: `url('${userProfile.avatar}')` }}
            ></div>
            <div 
              onClick={() => setIsEditProfileOpen(true)}
              className="absolute -bottom-2 -right-2 flex size-10 items-center justify-center rounded-2xl bg-primary text-white border-4 border-background-dark shadow-xl z-20 cursor-pointer hover:scale-110 active:scale-90 transition-all"
            >
              <span className="material-symbols-outlined text-[20px] font-bold">edit</span>
            </div>
          </div>
          <h2 className="text-3xl font-black mb-2 font-display">{userProfile.name}</h2>
          <div 
            onClick={() => {
              navigator.clipboard.writeText(userProfile.address);
              showToast('Address copied!', 'success');
            }}
            className="flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-white/5 border border-white/5 mb-6 cursor-pointer hover:bg-white/10 transition-all active:scale-95 group shadow-inner"
          >
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            <p className="text-gray-400 text-xs font-black font-mono tracking-widest uppercase group-hover:text-primary transition-colors">
              {userProfile.address.slice(0, 6)}...{userProfile.address.slice(-4)}
            </p>
            <span className="material-symbols-outlined text-gray-500 text-[18px]">content_copy</span>
          </div>
        </div>

        <div className="px-6 mb-8">
          <div 
            onClick={() => onNavigate(AppScreen.OFFLINE_MODE)}
            className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-surface-dark to-background-dark border border-white/5 p-6 shadow-2xl cursor-pointer hover:border-primary/50 transition-all group active:scale-[0.98]"
          >
            <div className="absolute -top-10 -right-10 size-32 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-all"></div>
            <div className="flex items-start justify-between relative z-10">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined font-bold">wifi_off</span>
                  </div>
                  <p className="text-white text-lg font-black uppercase tracking-widest">Offline Mode</p>
                </div>
                <p className="text-gray-500 text-xs font-bold leading-relaxed">Transact securely without any <br/>internet connection via USSD.</p>
              </div>
              <div className="size-12 flex items-center justify-center rounded-2xl bg-primary text-white shadow-lg shadow-primary/20">
                <span className="material-symbols-outlined font-bold">cell_tower</span>
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 mb-10">
          <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-600 mb-4 ml-1">AI Assistant</h3>
          <div className="rounded-[2rem] overflow-hidden relative group shadow-2xl border border-white/10">
            <div className="absolute inset-0 bg-gradient-to-br from-primary via-blue-600 to-indigo-700 opacity-90 group-hover:opacity-100 transition-opacity"></div>
            <div className="absolute -bottom-10 -left-10 size-40 bg-white/10 rounded-full blur-3xl"></div>
            
            <div className="relative p-6 flex flex-col gap-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-md border border-white/20 shadow-lg">
                    <span className="material-symbols-outlined text-white font-bold">graphic_eq</span>
                  </div>
                  <div>
                    <p className="text-white font-black text-xl tracking-tight">Voice Control</p>
                    <p className="text-blue-100 text-[10px] font-bold uppercase tracking-widest opacity-80">
                      {appSettings.voiceEnabled ? 'Hands-free active' : 'Disabled'}
                    </p>
                  </div>
                </div>
                <div 
                  onClick={() => updateAppSettings({ voiceEnabled: !appSettings.voiceEnabled })}
                  className={`w-14 h-8 rounded-full relative border border-white/10 p-1 cursor-pointer transition-colors ${appSettings.voiceEnabled ? 'bg-primary' : 'bg-white/20'}`}
                >
                  <div className={`absolute top-1 bottom-1 aspect-square bg-white rounded-full shadow-lg transition-all ${appSettings.voiceEnabled ? 'right-1' : 'left-1'}`}></div>
                </div>
              </div>
              <button onClick={() => onNavigate(AppScreen.VOICE_ASSISTANT)} className="flex items-center justify-center gap-3 w-full py-4 bg-white text-primary rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-blue-50 transition-all active:scale-95 shadow-2xl">
                <span className="material-symbols-outlined text-xl">play_circle_filled</span>
                Launch Hash Voice
              </button>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <h3 className="px-8 pb-4 text-[10px] font-black uppercase tracking-[0.3em] text-gray-600">Security Vault</h3>
          <div className="mx-6 overflow-hidden rounded-[2rem] bg-surface-dark border border-white/5 shadow-2xl">
            {[
              { label: 'Security Center', icon: 'shield_locked', color: 'bg-primary/20 text-primary', sub: '2FA, Biometrics, Recovery', action: () => setIsSecurityCenterOpen(true) },
              { label: 'Recovery Phrase', icon: 'key', color: 'bg-orange-500/10 text-orange-400', sub: 'Confidential keys', action: () => onNavigate(AppScreen.RECOVERY_PHRASE) },
              { label: 'Network Preferences', icon: 'settings_ethernet', color: 'bg-blue-500/10 text-blue-400', sub: 'Mainnet, Testnet, RPC', action: () => onNavigate(AppScreen.NETWORK_SETTINGS) }
            ].map((item, i) => (
              <div 
                key={i} 
                onClick={item.action}
                className="flex items-center gap-5 p-5 cursor-pointer hover:bg-white/5 transition-all border-b border-white/5 last:border-0 group active:scale-[0.99]"
              >
                <div className={`flex size-12 shrink-0 items-center justify-center rounded-2xl ${item.color} shadow-lg transition-transform group-hover:scale-110`}>
                  <span className="material-symbols-outlined font-bold">{item.icon}</span>
                </div>
                <div className="flex-1">
                  <p className="text-base font-black text-white uppercase tracking-wider">{item.label}</p>
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-0.5">{item.sub}</p>
                </div>
                <span className="material-symbols-outlined text-gray-700 group-hover:text-primary group-hover:translate-x-1 transition-all">chevron_right</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 px-6 flex flex-col gap-4">
          <button onClick={() => showToast('Support portal coming soon', 'info')} className="flex items-center justify-center w-full py-5 bg-white/5 border border-white/5 text-gray-400 font-black text-xs uppercase tracking-[0.2em] rounded-2xl hover:bg-white/10 hover:text-white transition-all active:scale-95 shadow-xl">
            <span className="material-symbols-outlined mr-3 text-xl">help</span>
            Support Portal
          </button>
          <button onClick={onDisconnect} className="flex items-center justify-center w-full py-5 bg-red-500/10 border border-red-500/20 text-red-500 font-black text-xs uppercase tracking-[0.2em] rounded-2xl hover:bg-red-500/20 transition-all active:scale-95 shadow-xl">
            <span className="material-symbols-outlined mr-3 text-xl">power_settings_new</span>
            Disconnect Wallet
          </button>
          <div className="mt-8 text-center">
            <p className="text-[9px] text-gray-700 font-black uppercase tracking-[0.4em]">Hash Pay v2.4.0 (Enterprise)</p>
          </div>
        </div>
      </main>

      {/* Edit Profile Bottom Sheet */}
      <BottomSheet 
        isOpen={isEditProfileOpen} 
        onClose={() => setIsEditProfileOpen(false)} 
        title="Edit Profile"
      >
        <div className="flex flex-col gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Full Name</label>
            <input 
              type="text" 
              value={tempProfile.name}
              onChange={(e) => setTempProfile({ ...tempProfile, name: e.target.value })}
              className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-5 text-white font-bold outline-none focus:border-primary transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Email Address</label>
            <input 
              type="email" 
              value={tempProfile.email}
              onChange={(e) => setTempProfile({ ...tempProfile, email: e.target.value })}
              className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-5 text-white font-bold outline-none focus:border-primary transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Username / Alias</label>
            <div className="relative">
              <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 font-bold">@</span>
              <input 
                type="text" 
                value={tempProfile.username}
                onChange={(e) => setTempProfile({ ...tempProfile, username: e.target.value })}
                className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl pl-10 pr-5 text-white font-bold outline-none focus:border-primary transition-all"
              />
            </div>
          </div>
          <button 
            onClick={handleSaveProfile}
            className="w-full h-16 bg-primary text-white font-black text-xs uppercase tracking-widest rounded-2xl mt-4 shadow-2xl shadow-primary/30 active:scale-95 transition-all"
          >
            Save Changes
          </button>
        </div>
      </BottomSheet>

      {/* Security Center Bottom Sheet */}
      <BottomSheet 
        isOpen={isSecurityCenterOpen} 
        onClose={() => setIsSecurityCenterOpen(false)} 
        title="Security Center"
      >
        <div className="flex flex-col gap-4">
          {[
            { label: 'Biometric Access', icon: 'fingerprint', enabled: appSettings.biometricsEnabled, key: 'biometricsEnabled' },
            { label: 'Push Notifications', icon: 'notifications_active', enabled: appSettings.notificationsEnabled, key: 'notificationsEnabled' }
          ].map((item, i) => (
            <div 
              key={i}
              className="flex items-center justify-between p-5 bg-white/5 rounded-2xl border border-white/5"
            >
              <div className="flex items-center gap-4">
                <span className="material-symbols-outlined text-gray-400">{item.icon}</span>
                <span className="text-sm font-black text-white uppercase tracking-wider">{item.label}</span>
              </div>
              <div 
                onClick={() => updateAppSettings({ [item.key]: !item.enabled })}
                className={`w-12 h-7 rounded-full relative p-1 cursor-pointer transition-colors ${item.enabled ? 'bg-primary' : 'bg-white/10'}`}
              >
                <div className={`absolute top-1 bottom-1 aspect-square bg-white rounded-full shadow-lg transition-all ${item.enabled ? 'right-1' : 'left-1'}`}></div>
              </div>
            </div>
          ))}
          <div className="mt-4 p-6 bg-red-500/10 border border-red-500/20 rounded-[2rem]">
            <h4 className="text-red-500 font-black text-xs uppercase tracking-widest mb-2">Emergency Shutdown</h4>
            <p className="text-red-400/60 text-[10px] font-bold leading-normal mb-4">Instantly lock all outgoing transactions and revoke active sessions.</p>
            <button className="w-full py-4 bg-red-500 text-white rounded-xl font-black text-[10px] uppercase tracking-widest active:scale-95 transition-all">
              Activate Lockdown
            </button>
          </div>
        </div>
      </BottomSheet>
    </div>
  );
};

export default SettingsScreen;
