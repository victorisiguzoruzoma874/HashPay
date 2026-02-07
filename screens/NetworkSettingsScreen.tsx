import React, { useState } from 'react';
import { useWallet } from '../WalletContext';
import { useToast } from '../components/Toast';
import BottomSheet from '../components/BottomSheet';

interface NetworkSettingsScreenProps {
  onBack: () => void;
}

const NetworkSettingsScreen: React.FC<NetworkSettingsScreenProps> = ({ onBack }) => {
  const { networks, currentNetwork, setCurrentNetwork, addCustomNetwork } = useWallet();
  const { showToast } = useToast();
  const [isCustomRpcOpen, setIsCustomRpcOpen] = useState(false);
  const [customRpcUrl, setCustomRpcUrl] = useState('');

  const handleNetworkSelect = (name: string) => {
    setCurrentNetwork(name);
    showToast(`Switched to ${name}`, 'success');
  };

  const handleAddCustomRpc = () => {
    if (!customRpcUrl.startsWith('http')) {
      showToast('Invalid RPC URL format', 'error');
      return;
    }
    addCustomNetwork('Custom Node', customRpcUrl, 'mainnet');
    showToast('Custom RPC added and selected', 'success');
    setIsCustomRpcOpen(false);
    setCustomRpcUrl('');
  };

  return (
    <div className="bg-background-dark text-white font-display min-h-screen flex flex-col animate-fade-in custom-scrollbar overflow-y-auto pb-10">
      <header className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 glass border-b border-white/5">
        <button onClick={onBack} className="flex items-center justify-center size-11 rounded-2xl bg-white/5 hover:bg-white/10 transition-all active:scale-90 shadow-lg">
          <span className="material-symbols-outlined text-2xl">arrow_back</span>
        </button>
        <h1 className="text-xl font-black leading-tight tracking-tight uppercase tracking-widest text-primary-light">Network Edge</h1>
        <div className="size-11"></div>
      </header>

      <main className="flex-1 p-6 flex flex-col gap-10 pt-10">
        <section className="flex flex-col gap-4">
           <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 pl-2">Available Nodes</h3>
           <div className="flex flex-col gap-3">
              {networks.map(net => (
                <button 
                  key={net.id}
                  onClick={() => handleNetworkSelect(net.name)}
                  className={`flex items-center justify-between p-6 rounded-[2rem] border transition-all active:scale-[0.98] ${currentNetwork === net.name ? 'bg-primary/10 border-primary/40 shadow-xl shadow-primary/5' : 'bg-surface-dark/40 border-white/5 hover:bg-surface-dark'}`}
                >
                   <div className="flex items-center gap-5">
                      <div className={`size-12 rounded-xl flex items-center justify-center shadow-lg ${net.type === 'mainnet' ? 'bg-blue-500/20 text-blue-400' : net.type === 'testnet' ? 'bg-orange-500/20 text-orange-400' : 'bg-green-500/20 text-green-400'}`}>
                         <span className="material-symbols-outlined text-2xl">{net.type === 'mainnet' ? 'lan' : 'science'}</span>
                      </div>
                      <div className="text-left">
                         <p className="text-sm font-black text-white">{net.name}</p>
                         <p className="text-[9px] font-bold text-gray-600 uppercase tracking-widest mt-0.5 truncate max-w-[150px]">{net.rpc}</p>
                      </div>
                   </div>
                   <div className={`size-6 rounded-full border-2 flex items-center justify-center ${currentNetwork === net.name ? 'border-primary bg-primary shadow-lg shadow-primary/40' : 'border-gray-700'}`}>
                      {currentNetwork === net.name && <span className="material-symbols-outlined text-white text-[14px] font-bold">check</span>}
                   </div>
                </button>
              ))}
           </div>
        </section>

        <section className="flex flex-col gap-4">
           <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 pl-2">Developer Tools</h3>
           <button 
             onClick={() => setIsCustomRpcOpen(true)}
             className="w-full p-6 rounded-[2rem] bg-white/2 border border-dashed border-white/10 flex items-center justify-center gap-3 hover:bg-white/5 active:scale-95 transition-all text-gray-400 group"
           >
              <span className="material-symbols-outlined text-2xl group-hover:text-primary transition-colors">add_link</span>
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Add Custom RPC</span>
           </button>
        </section>

        <section className="bg-primary/5 border border-primary/10 rounded-[2.5rem] p-8 flex flex-col gap-4">
           <div className="flex items-center gap-4 mb-2">
              <div className="size-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary shadow-lg">
                 <span className="material-symbols-outlined">speed</span>
              </div>
              <div>
                 <h4 className="text-sm font-black text-white uppercase tracking-widest">Network Latency</h4>
                 <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mt-0.5">Global Consensus Relay</p>
              </div>
           </div>
           <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
              <span className="text-gray-600">Avg. Settlement</span>
              <span className="text-green-400 font-mono">~350ms</span>
           </div>
           <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
              <span className="text-gray-600">Peers Discovery</span>
              <span className="text-white">Active (1,240 Nodes)</span>
           </div>
        </section>
      </main>

      <BottomSheet 
        isOpen={isCustomRpcOpen} 
        onClose={() => setIsCustomRpcOpen(false)} 
        title="Custom RPC Configuration"
      >
        <div className="flex flex-col gap-6">
           <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Node URL</label>
              <input 
                type="text" 
                value={customRpcUrl}
                onChange={(e) => setCustomRpcUrl(e.target.value)}
                placeholder="https://your-custom-node.io:443"
                className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-5 text-white font-bold outline-none focus:border-primary transition-all"
              />
           </div>
           <div className="flex items-center gap-3 p-4 bg-orange-500/5 rounded-2xl border border-orange-500/10">
              <span className="material-symbols-outlined text-orange-400">warning</span>
              <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest leading-relaxed">
                 Using untrusted RPC endpoints may compromise your IP privacy and transaction intent.
              </p>
           </div>
           <button 
             onClick={handleAddCustomRpc}
             className="w-full h-16 bg-primary text-white font-black text-xs uppercase tracking-widest rounded-2xl mt-4 shadow-2xl shadow-primary/30 active:scale-95 transition-all text-center"
           >
             Initialize Endpoint
           </button>
        </div>
      </BottomSheet>

      <footer className="p-10 text-center opacity-30 mt-auto">
         <p className="text-[10px] font-bold uppercase tracking-[0.5em]">H-Pay Global Consensus Mesh</p>
      </footer>
    </div>
  );
};

export default NetworkSettingsScreen;
