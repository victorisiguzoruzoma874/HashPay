
import React, { useState } from 'react';
import { useToast } from '../components/Toast';
import { useWallet } from '../WalletContext';

interface EscrowScreenProps {
  onBack: () => void;
}

const EscrowScreen: React.FC<EscrowScreenProps> = ({ onBack }) => {
  const { showToast } = useToast();
  const { escrows, createEscrow, releaseEscrow, createEscrowOnChain, contacts } = useWallet();
  const [activeTab, setActiveTab] = useState<'create' | 'active'>('create');
  const [amount, setAmount] = useState('500.00');
  const [recipient, setRecipient] = useState('Jane Cooper');

  const handleCreateEscrow = async () => {
    // Local simulation/record keeping
    createEscrow({
      amount,
      recipient,
      expiryDate: '7 Days'
    });

    // On-chain transaction
    try {
      // For demo, we assume the recipient name is mapped to an address
      // In a real app, we'd look up the contact's address
      const contact = contacts.find(c => c.name === recipient);
      const recipientAddress = contact?.address || recipient; // Fallback to name if not found (might fail if not valid address)

      await createEscrowOnChain(recipientAddress, amount);
    } catch (e) {
      console.error('On-chain escrow failed', e);
    }

    setActiveTab('active');
  };

  return (
    <div className="bg-background-dark text-white font-display min-h-screen flex flex-col overflow-x-hidden animate-fade-in custom-scrollbar overflow-y-auto pb-10">
      <header className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 glass border-b border-white/5">
        <button onClick={onBack} className="flex items-center justify-center size-11 rounded-2xl bg-white/5 hover:bg-white/10 transition-all active:scale-90 shadow-lg">
          <span className="material-symbols-outlined text-2xl">arrow_back</span>
        </button>
        <h1 className="text-xl font-black leading-tight tracking-tight uppercase tracking-widest text-primary-light">Secure Escrow</h1>
        <button onClick={() => showToast('Help with escrows', 'info')} className="flex items-center justify-center size-11 rounded-2xl bg-white/5 hover:bg-white/10 transition-all active:scale-90 text-gray-400 shadow-lg">
          <span className="material-symbols-outlined text-2xl font-bold">help</span>
        </button>
      </header>

      <main className="flex-1 flex flex-col p-6 gap-8">
        {/* Tabs */}
        <div className="flex p-1.5 bg-white/5 rounded-2xl border border-white/5 mx-auto w-full max-w-xs">
          <button
            onClick={() => setActiveTab('create')}
            className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'create' ? 'bg-primary text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}
          >
            Create
          </button>
          <button
            onClick={() => setActiveTab('active')}
            className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'active' ? 'bg-primary text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}
          >
            Active ({escrows.filter(e => e.status === 'pending').length})
          </button>
        </div>

        {activeTab === 'create' ? (
          <div className="flex flex-col gap-8 animate-slide-up">
            <section className="bg-gradient-to-br from-indigo-700 via-primary to-blue-600 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group">
              <div className="absolute -top-10 -right-10 size-48 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all"></div>
              <div className="relative z-10">
                <div className="size-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/20 mb-6 shadow-xl">
                  <span className="material-symbols-outlined text-white text-4xl font-bold">verified_user</span>
                </div>
                <h3 className="text-2xl font-black text-white tracking-tight mb-2 uppercase">Programmable Trust</h3>
                <p className="text-blue-100 text-xs font-bold leading-relaxed opacity-80 uppercase tracking-widest">
                  Smart contracts hold assets until conditions are met. <br /> Zero-trust, fully automated.
                </p>
              </div>
            </section>

            <section className="flex flex-col gap-6">
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 pl-1">Contract Parameters</label>
                <div className="bg-surface-dark border border-white/5 rounded-[2.5rem] p-8 flex flex-col gap-6 shadow-2xl">
                  <div className="space-y-2">
                    <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Release Amount</span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-black text-white tracking-tighter">$</span>
                      <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="bg-transparent text-5xl font-black text-white outline-none w-full tracking-tighter border-none focus:ring-0 p-0"
                      />
                    </div>
                  </div>
                  <div className="h-px w-full bg-white/5"></div>
                  <div className="flex flex-col gap-4">
                    <div className="space-y-1">
                      <span className="text-[9px] font-bold text-gray-600 uppercase tracking-widest pl-1">Recipient Name</span>
                      <input
                        type="text"
                        value={recipient}
                        onChange={(e) => setRecipient(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm font-black outline-none focus:border-primary transition-all"
                      />
                    </div>
                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
                      <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-gray-500">schedule</span>
                        <span className="text-[10px] font-black uppercase tracking-widest">Expiry: 7 Days</span>
                      </div>
                      <span className="text-[9px] font-bold text-primary-light uppercase">Auto-Refund</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <button
              onClick={handleCreateEscrow}
              className="w-full h-18 bg-primary hover:bg-primary-hover text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl flex items-center justify-center gap-3 shadow-2xl shadow-primary/30 transition-all active:scale-95 border border-white/10 mt-4"
            >
              Initialize Escrow
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-4 animate-slide-up">
            {escrows.length > 0 ? (
              escrows.map(escrow => (
                <div key={escrow.id} className="bg-surface-dark/40 border border-white/5 rounded-[2rem] p-6 flex flex-col gap-4 shadow-xl">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
                        <span className="material-symbols-outlined">lock</span>
                      </div>
                      <div>
                        <h4 className="text-sm font-black text-white">{escrow.recipient}</h4>
                        <span className="text-[9px] font-bold text-gray-600 uppercase tracking-widest">ID: {escrow.id}</span>
                      </div>
                    </div>
                    <div className={`px-2 py-1 rounded-md text-[8px] font-black uppercase tracking-widest ${escrow.status === 'pending' ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20' : 'bg-green-500/10 text-green-500 border border-green-500/20'}`}>
                      {escrow.status}
                    </div>
                  </div>
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-[9px] font-bold text-gray-600 uppercase tracking-widest mb-1">Stored Value</p>
                      <p className="text-2xl font-black text-white">${escrow.amount}</p>
                    </div>
                    {escrow.status === 'pending' && (
                      <button
                        onClick={() => releaseEscrow(escrow.id)}
                        className="px-4 py-2 bg-primary text-white text-[9px] font-black uppercase tracking-widest rounded-lg active:scale-95 transition-all shadow-lg shadow-primary/20"
                      >
                        Release Funds
                      </button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-20 opacity-30">
                <span className="material-symbols-outlined text-8xl mb-4">lock_reset</span>
                <p className="text-sm font-black uppercase tracking-[0.2em]">No active escrows</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default EscrowScreen;
