import React, { useState } from 'react';
import { useWallet } from '../WalletContext';
import { useToast } from '../components/Toast';
import BottomSheet from '../components/BottomSheet';

interface ContactsScreenProps {
  onBack: () => void;
}

const ContactsScreen: React.FC<ContactsScreenProps> = ({ onBack }) => {
  const { contacts, addContact } = useWallet();
  const { showToast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddContactOpen, setIsAddContactOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newAddress, setNewAddress] = useState('');

  const filteredContacts = contacts.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddContact = () => {
    if (!newName || !newAddress) {
      showToast('Please enter both name and address', 'error');
      return;
    }
    addContact({ name: newName, address: newAddress, avatar: `https://i.pravatar.cc/150?u=${newName}` });
    setIsAddContactOpen(false);
    setNewName('');
    setNewAddress('');
  };

  return (
    <div className="bg-background-dark text-white font-display min-h-screen flex flex-col animate-fade-in custom-scrollbar overflow-y-auto pb-10">
      <header className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 glass border-b border-white/5">
        <button onClick={onBack} className="flex items-center justify-center size-11 rounded-2xl bg-white/5 hover:bg-white/10 transition-all active:scale-90 shadow-lg">
          <span className="material-symbols-outlined text-2xl">arrow_back</span>
        </button>
        <h1 className="text-xl font-black leading-tight tracking-tight uppercase tracking-widest text-primary-light">Contacts</h1>
        <button 
          onClick={() => setIsAddContactOpen(true)}
          className="flex items-center justify-center size-11 rounded-2xl bg-primary text-white shadow-lg shadow-primary/20 active:scale-90 transition-all border border-white/10"
        >
          <span className="material-symbols-outlined text-2xl">person_add</span>
        </button>
      </header>

      <main className="flex-1 p-6 flex flex-col gap-6 pt-8">
        {/* Search Bar */}
        <div className="relative group">
           <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
              <span className="material-symbols-outlined text-gray-500 group-focus-within:text-primary transition-colors">search</span>
           </div>
           <input 
             type="text" 
             placeholder="Search by name or address..."
             value={searchQuery}
             onChange={(e) => setSearchQuery(e.target.value)}
             className="w-full h-16 pl-14 pr-6 bg-surface-dark border border-white/5 rounded-2xl text-sm font-bold outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all shadow-xl placeholder:text-gray-700"
           />
        </div>

        {/* Contacts List */}
        <section className="flex flex-col gap-3">
          {filteredContacts.length > 0 ? (
            filteredContacts.map(contact => (
              <div key={contact.id} className="flex items-center justify-between p-5 bg-white/2 rounded-[2rem] border border-white/5 hover:bg-white/5 transition-all group active:scale-[0.98] cursor-pointer">
                 <div className="flex items-center gap-4">
                    <div 
                      className="size-14 rounded-2xl bg-cover bg-center border-2 border-white/10 shadow-lg transition-transform group-hover:scale-105"
                      style={{ backgroundImage: `url('${contact.avatar}')` }}
                    ></div>
                    <div className="flex flex-col">
                       <span className="text-sm font-black text-white group-hover:text-primary transition-colors">{contact.name}</span>
                       <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mt-1 mono">{contact.address}</span>
                    </div>
                 </div>
                 <div className="flex items-center gap-2">
                    <button className="size-10 rounded-xl bg-white/5 flex items-center justify-center text-gray-500 hover:text-white transition-all">
                       <span className="material-symbols-outlined text-xl">send</span>
                    </button>
                    <button className="size-10 rounded-xl bg-white/5 flex items-center justify-center text-gray-500 hover:text-white transition-all">
                       <span className="material-symbols-outlined text-xl">more_vert</span>
                    </button>
                 </div>
              </div>
            ))
          ) : (
            <div className="text-center py-20 opacity-30">
               <span className="material-symbols-outlined text-8xl mb-4">person_search</span>
               <p className="text-sm font-black uppercase tracking-[0.2em]">No contacts found</p>
            </div>
          )}
        </section>
      </main>

      {/* Add Contact Sheet */}
      <BottomSheet 
        isOpen={isAddContactOpen} 
        onClose={() => setIsAddContactOpen(false)} 
        title="Add New Contact"
      >
        <div className="flex flex-col gap-6">
           <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Contact Name</label>
              <input 
                type="text" 
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="e.g. Charlie"
                className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-5 text-white font-bold outline-none focus:border-primary transition-all"
              />
           </div>
           <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Wallet Address</label>
              <input 
                type="text" 
                value={newAddress}
                onChange={(e) => setNewAddress(e.target.value)}
                placeholder="0x..."
                className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-5 text-white font-bold outline-none focus:border-primary transition-all"
              />
           </div>
           <button 
             onClick={handleAddContact}
             className="w-full h-16 bg-primary text-white font-black text-xs uppercase tracking-widest rounded-2xl mt-4 shadow-2xl shadow-primary/30 active:scale-95 transition-all"
           >
             Save Contact
           </button>
        </div>
      </BottomSheet>

      <footer className="p-10 text-center opacity-30 mt-auto">
         <p className="text-[10px] font-bold uppercase tracking-[0.5em]">Privacy Secured via zk-Proof</p>
      </footer>
    </div>
  );
};

export default ContactsScreen;
