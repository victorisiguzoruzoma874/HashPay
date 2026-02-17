
import { useState, useEffect, type FC } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { afriexClient } from '../api/afriex';
import { useToast } from '../components/Toast';

interface FiatDashboardScreenProps {
    onBack: () => void;
}

type FiatTab = 'dashboard' | 'accounts' | 'savings' | 'transfers' | 'cards' | 'security';

const FiatDashboardScreen: FC<FiatDashboardScreenProps> = ({ onBack }) => {
    const { showToast } = useToast();
    const [activeTab, setActiveTab] = useState<FiatTab>('dashboard');
    const [fiatData, setFiatData] = useState<any>(null);
    const [metrics, setMetrics] = useState<any>(null);
    const [transactions, setTransactions] = useState<any[]>([]);
    const [goals, setGoals] = useState<any[]>([]);
    const [cards, setCards] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [data, m, txs, g, c] = await Promise.all([
                    afriexClient.getFiatBalance('NGN'),
                    afriexClient.getAccountMetrics(),
                    afriexClient.getTransactions('primary'),
                    afriexClient.getSavingsGoals(),
                    afriexClient.getVirtualCards()
                ]);
                setFiatData(data);
                setMetrics(m);
                setTransactions(txs);
                setGoals(g);
                setCards(c);
            } catch (e) {
                showToast('Failed to fetch fiat data', 'error');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: 'grid_view' },
        { id: 'accounts', label: 'Accounts', icon: 'account_balance_wallet' },
        { id: 'savings', label: 'Savings Goals', icon: 'savings' },
        { id: 'transfers', label: 'Transfers', icon: 'swap_horiz' },
        { id: 'cards', label: 'Cards', icon: 'credit_card' },
        { id: 'security', label: 'Security', icon: 'verified_user' },
    ];

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-[#0d121b]">
                <div className="size-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
            </div>
        );
    }

    const renderDashboard = () => (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            {/* Dashboard Stats */}
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 mb-16">
                <div className="flex-1">
                    <span className="text-[11px] font-black text-text-tertiary uppercase tracking-[0.4em] mb-4 block">Total Balance</span>
                    <div className="flex items-baseline gap-3 mb-2 flex-wrap">
                        <span className="text-4xl sm:text-6xl font-black text-white tracking-tighter font-display">₦{fiatData?.total_balance.toLocaleString()}</span>
                        <span className="text-sm font-black text-green-400 mt-2">{metrics?.percentage_change}</span>
                    </div>
                    <p className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest italic">Last updated {fiatData?.last_updated}</p>
                </div>

                <div className="w-full lg:w-[450px] bg-surface-dark/30 rounded-[2.5rem] p-6 sm:p-8 border border-white/5 glass relative overflow-hidden flex flex-col justify-center">
                    <div className="flex justify-between items-center mb-6">
                        <span className="text-[10px] font-black text-white uppercase tracking-[0.3em]">Weekly Trend</span>
                        <button className="text-[9px] font-black text-text-tertiary uppercase tracking-widest hover:text-white transition-colors">View Report</button>
                    </div>
                    <div className="flex gap-4 mb-4">
                        <button
                            onClick={() => onBack()} // Should probably go to EXCHANGE
                            className="flex-1 py-3 bg-[#22c55e]/20 border border-[#22c55e]/40 rounded-xl text-[10px] font-black uppercase tracking-widest text-[#22c55e]"
                        >
                            Deposit Crypto
                        </button>
                        <button
                            onClick={() => onBack()} // Should probably go to EXCHANGE
                            className="flex-1 py-3 bg-error/10 border border-error/20 rounded-xl text-[10px] font-black uppercase tracking-widest text-error"
                        >
                            Withdraw Fiat
                        </button>
                    </div>
                    <div className="flex items-end gap-3 h-24">
                        {metrics?.trend.map((val: number, i: number) => (
                            <div key={i} className="flex-1 bg-primary/20 rounded-lg relative group transition-all" style={{ height: `${val}%` }}>
                                <div className="absolute inset-0 bg-primary opacity-20 blur-lg group-hover:opacity-100 transition-opacity"></div>
                                <div className="absolute inset-0 bg-primary rounded-lg"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Account Cards */}
            <div className="mb-16 px-4">
                <div className="flex justify-between items-center mb-8 px-2">
                    <h3 className="text-[13px] font-black text-white uppercase tracking-[0.3em]">Your Accounts</h3>
                    <button onClick={() => setActiveTab('accounts')} className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline">View All</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-[#2176ff] rounded-[2.5rem] p-6 sm:p-10 shadow-2xl relative overflow-hidden group border border-white/20">
                        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-100 transition-opacity">
                            <span className="material-symbols-outlined text-white text-4xl">contactless</span>
                        </div>
                        <div className="mb-12">
                            <span className="text-[10px] font-black text-white/50 uppercase tracking-[0.3em] mb-2 block">Checking Account</span>
                            <span className="text-lg font-black text-white">.... 4421</span>
                        </div>
                        <div>
                            <h4 className="text-3xl font-black text-white mb-2 font-display">₦{fiatData?.checking.toLocaleString()}</h4>
                            <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">HashPay Platinum Card</span>
                        </div>
                    </div>

                    <div className="bg-surface-dark/30 rounded-[2.5rem] p-6 sm:p-10 shadow-2xl border border-white/5 relative overflow-hidden group glass">
                        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-100 transition-opacity">
                            <span className="material-symbols-outlined text-text-tertiary text-4xl">savings</span>
                        </div>
                        <div className="mb-12">
                            <span className="text-[10px] font-black text-text-tertiary uppercase tracking-[0.3em] mb-2 block">Savings Account</span>
                            <span className="text-lg font-black text-white">.... 9012</span>
                        </div>
                        <div>
                            <h4 className="text-3xl font-black text-white mb-2 font-display">₦{fiatData?.savings.toLocaleString()}</h4>
                            <span className="text-[10px] font-black text-[#22c55e] uppercase tracking-widest">High Yield 4.2% APY</span>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );

    const renderAccounts = () => (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <div className="flex justify-between items-center mb-12">
                <h2 className="text-3xl font-black font-display tracking-tight text-white">Detailed Accounts</h2>
                <div className="flex gap-4">
                    <button className="px-6 py-3 bg-primary rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-primary/20">Add Account</button>
                    <button className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-xs font-black uppercase tracking-widest">Reports</button>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-8 mb-12">
                {['Checking', 'Savings'].map((type, i) => (
                    <div key={i} className="bg-surface-dark/20 rounded-[2.5rem] border border-white/5 p-8 glass">
                        <div className="flex justify-between items-center mb-8">
                            <div className="flex items-center gap-4">
                                <div className="size-12 rounded-xl bg-primary/20 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-primary text-2xl">{type === 'Checking' ? 'account_balance_wallet' : 'savings'}</span>
                                </div>
                                <div>
                                    <h3 className="text-lg font-black text-white">{type} Account</h3>
                                    <p className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest">**** 4421 • active</p>
                                </div>
                            </div>
                            <h4 className="text-2xl font-black text-white font-display">₦{type === 'Checking' ? fiatData?.checking.toLocaleString() : fiatData?.savings.toLocaleString()}</h4>
                        </div>

                        <div className="border-t border-white/5 pt-6">
                            <p className="text-[11px] font-black text-text-tertiary uppercase tracking-[0.3em] mb-6">Recent Transactions</p>
                            <div className="flex flex-col gap-4">
                                {transactions.map((tx, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-all cursor-pointer">
                                        <div className="flex items-center gap-4">
                                            <div className="size-10 rounded-lg bg-surface-dark/50 flex items-center justify-center">
                                                <span className="material-symbols-outlined text-text-secondary text-xl">{tx.icon}</span>
                                            </div>
                                            <div>
                                                <p className="text-xs font-black text-white">{tx.recipient}</p>
                                                <p className="text-[8px] font-bold text-text-tertiary uppercase tracking-widest">{tx.date}</p>
                                            </div>
                                        </div>
                                        <p className={`text-sm font-black ${tx.type === 'debit' ? 'text-error' : 'text-success'}`}>
                                            {tx.type === 'debit' ? '-' : '+'}₦{tx.amount.toLocaleString()}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </motion.div>
    );

    const renderSavings = () => (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <div className="flex justify-between items-center mb-12">
                <h2 className="text-3xl font-black font-display tracking-tight text-white">Savings Goals</h2>
                <button className="px-6 py-3 bg-primary rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-primary/20">New Goal</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {goals.map((goal, i) => {
                    const progress = (goal.current / goal.target) * 100;
                    return (
                        <div key={i} className="bg-surface-dark/20 rounded-[2.5rem] border border-white/5 p-8 glass flex flex-col gap-6">
                            <div className="flex justify-between items-start">
                                <h3 className="text-xl font-black text-white">{goal.name}</h3>
                                <div className="size-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${goal.color}20`, color: goal.color }}>
                                    <span className="material-symbols-outlined text-2xl">flag</span>
                                </div>
                            </div>

                            <div className="mt-4">
                                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-3">
                                    <span className="text-text-tertiary">Progress</span>
                                    <span className="text-white">{progress.toFixed(1)}%</span>
                                </div>
                                <div className="h-4 bg-white/5 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${progress}%` }}
                                        className="h-full rounded-full shadow-[0_0_20px_rgba(0,0,0,0.5)]"
                                        style={{ backgroundColor: goal.color }}
                                    ></motion.div>
                                </div>
                            </div>

                            <div className="flex justify-between items-end mt-4">
                                <div>
                                    <p className="text-[9px] font-bold text-text-tertiary uppercase tracking-[0.2em] mb-1">Current</p>
                                    <h4 className="text-xl font-black text-white">₦{goal.current.toLocaleString()}</h4>
                                </div>
                                <div className="text-right">
                                    <p className="text-[9px] font-bold text-text-tertiary uppercase tracking-[0.2em] mb-1">Target</p>
                                    <h4 className="text-xl font-black text-white/40">₦{goal.target.toLocaleString()}</h4>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </motion.div>
    );

    const renderTransfers = () => (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
            <h2 className="text-3xl font-black font-display tracking-tight text-white mb-12">Transfer Money</h2>

            <div className="flex flex-col lg:flex-row gap-12">
                <div className="flex-1 lg:flex-[2] flex flex-col gap-8">
                    <div className="bg-surface-dark/30 rounded-[2.5rem] p-10 border border-white/5 glass">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                            <div>
                                <label className="text-[10px] font-black text-text-tertiary uppercase tracking-widest mb-3 block">From Account</label>
                                <div className="relative">
                                    <select className="w-full h-14 bg-white/5 border border-white/10 rounded-xl px-4 focus:outline-none focus:border-primary text-sm font-bold appearance-none pr-10">
                                        <option className="bg-[#0d121b]">Checking (**** 4421)</option>
                                        <option className="bg-[#0d121b]">Savings (**** 9012)</option>
                                    </select>
                                    <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-text-tertiary">expand_more</span>
                                </div>
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-text-tertiary uppercase tracking-widest mb-3 block">Recipient Account / Bank</label>
                                <input type="text" placeholder="Account Number" className="w-full h-14 bg-white/5 border border-white/10 rounded-xl px-4 focus:outline-none focus:border-primary text-sm font-bold" />
                            </div>
                        </div>

                        <div className="mb-8">
                            <label className="text-[10px] font-black text-text-tertiary uppercase tracking-widest mb-3 block">Amount (NGN)</label>
                            <div className="relative">
                                <span className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl font-black text-text-tertiary">₦</span>
                                <input type="number" defaultValue="5000" className="w-full h-20 bg-white/5 border border-white/10 rounded-2xl pl-14 pr-6 text-3xl font-black focus:outline-none focus:border-primary" />
                            </div>
                        </div>

                        <button
                            onClick={() => showToast('Transfer Processed', 'success')}
                            className="w-full py-6 bg-primary rounded-2xl text-sm font-black uppercase tracking-widest shadow-2xl shadow-primary/30 hover:scale-[1.02] transition-all"
                        >
                            Initiate Transfer
                        </button>
                    </div>
                </div>

                <div className="flex-1 flex flex-col gap-8">
                    <h3 className="text-[11px] font-black text-text-tertiary uppercase tracking-[0.3em]">Recent Recipients</h3>
                    <div className="flex flex-col gap-4">
                        {['John Boyega', 'Aisha Bello', 'Oluwaseun T.'].map((name, i) => (
                            <div key={i} className="flex items-center gap-4 p-5 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-all cursor-pointer group">
                                <div className="size-12 rounded-xl bg-surface-dark/50 flex items-center justify-center text-primary font-black text-lg group-hover:bg-primary group-hover:text-white transition-all">{name[0]}</div>
                                <div>
                                    <p className="text-xs font-black text-white">{name}</p>
                                    <p className="text-[8px] font-bold text-text-tertiary uppercase tracking-widest">Bank Transfer • UBA</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </motion.div>
    );

    const renderCards = () => (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div className="flex justify-between items-center mb-12">
                <h2 className="text-3xl font-black font-display tracking-tight text-white">Card Management</h2>
                <button className="px-6 py-3 bg-primary rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-primary/20">New Virtual Card</button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 px-4">
                {cards.map((card, i) => (
                    <div key={i} className="flex flex-col gap-8">
                        <div className="aspect-[1.6/1] bg-gradient-to-br from-[#1a1c1e] to-[#0d121b] rounded-[2.5rem] p-10 border border-white/10 relative overflow-hidden shadow-2xl group flex flex-col justify-between">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[100px] -mr-32 -mt-32"></div>
                            <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/10 rounded-full blur-[100px] -ml-24 -mb-24"></div>

                            <div className="relative z-10 flex justify-between items-center">
                                <div className="size-12 bg-white/5 rounded-xl border border-white/10 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-white/50">contactless</span>
                                </div>
                                <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">HashPay Platinum</span>
                            </div>

                            <div className="relative z-10">
                                <p className="text-2xl font-black tracking-[0.2em] text-white mb-6 font-display">{card.number}</p>
                                <div className="flex gap-12">
                                    <div>
                                        <p className="text-[8px] font-black text-white/30 uppercase tracking-widest mb-1">Expiry Date</p>
                                        <p className="text-sm font-bold text-white uppercase">{card.expiry}</p>
                                    </div>
                                    <div>
                                        <p className="text-[8px] font-black text-white/30 uppercase tracking-widest mb-1">CVV</p>
                                        <p className="text-sm font-bold text-white uppercase">{card.cvv}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-surface-dark/20 p-8 rounded-[2.5rem] border border-white/5 glass">
                            <div className="flex justify-between items-center mb-6 px-2">
                                <span className="text-[10px] font-black text-text-tertiary uppercase tracking-[0.3em]">Card Controls</span>
                                <span className="px-3 py-1 bg-green-400/10 text-green-400 rounded-full text-[8px] font-black uppercase tracking-widest border border-green-400/20">{card.status}</span>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <button onClick={() => showToast('Card Frozen', 'info')} className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-all">
                                    <span className="material-symbols-outlined text-text-tertiary text-xl">ac_unit</span>
                                    <span className="text-[9px] font-black uppercase tracking-widest">Freeze Card</span>
                                </button>
                                <button className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-all">
                                    <span className="material-symbols-outlined text-text-tertiary text-xl">settings</span>
                                    <span className="text-[9px] font-black uppercase tracking-widest">Limits</span>
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </motion.div>
    );

    const renderSecurity = () => (
        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
            <h2 className="text-3xl font-black font-display tracking-tight text-white mb-12">Security Settings</h2>

            <div className="max-w-2xl bg-surface-dark/20 rounded-[3rem] border border-white/5 p-10 glass">
                <div className="space-y-10">
                    {[
                        { id: 'biometrics', label: 'Biometric Login', sub: 'Use fingerprint or face ID to authenticate', icon: 'fingerprint' },
                        { id: '2fa', label: 'Two-Factor Authentication', sub: 'Extra layer of security for transfers', icon: 'security' },
                        { id: 'notifications', label: 'Security Alerts', sub: 'Instant push for any account access', icon: 'notification_important' },
                        { id: 'limit', label: 'Smart Spending Limits', sub: 'Enable per-transaction thresholds', icon: 'speed' },
                    ].map((st, i) => (
                        <div key={i} className="flex items-center justify-between pb-10 border-b border-white/5 last:border-0 last:pb-0">
                            <div className="flex items-center gap-6">
                                <div className="size-14 rounded-2xl bg-white/5 flex items-center justify-center border border-white/5 shadow-xl">
                                    <span className="material-symbols-outlined text-primary text-2xl">{st.icon}</span>
                                </div>
                                <div>
                                    <h3 className="text-lg font-black text-white">{st.label}</h3>
                                    <p className="text-xs font-bold text-text-tertiary">{st.sub}</p>
                                </div>
                            </div>
                            <button className="size-14 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20">
                                <div className="size-6 bg-white rounded-full"></div>
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </motion.div>
    );

    const renderContent = () => {
        switch (activeTab) {
            case 'dashboard': return renderDashboard();
            case 'accounts': return renderAccounts();
            case 'savings': return renderSavings();
            case 'transfers': return renderTransfers();
            case 'cards': return renderCards();
            case 'security': return renderSecurity();
            default: return renderDashboard();
        }
    };

    return (
        <div className="flex flex-col md:flex-row h-screen bg-[#0d121b] text-white font-body overflow-hidden">
            {/* Mobile Header */}
            <header className="md:hidden flex items-center justify-between p-4 border-b border-white/5 bg-[#0d121b] z-20">
                <div className="flex items-center gap-3">
                    <div className="size-8 rounded-lg bg-primary flex items-center justify-center">
                        <span className="material-symbols-outlined text-white text-xl">account_balance</span>
                    </div>
                    <span className="text-sm font-black tracking-tight font-display">Hashpay Fiat</span>
                </div>
                <button onClick={onBack} className="p-2 bg-white/5 rounded-lg">
                    <span className="material-symbols-outlined text-white">close</span>
                </button>
            </header>
            {/* Sidebar */}
            <aside className="hidden md:flex w-64 border-r border-white/5 bg-[#0d121b] flex-col p-6 h-full">
                <div className="flex items-center gap-3 mb-12 px-2">
                    <div className="size-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
                        <span className="material-symbols-outlined text-white text-2xl font-bold">account_balance</span>
                    </div>
                    <h1 className="text-xl font-black tracking-tight font-display">Hashpay Fiat</h1>
                </div>

                <nav className="flex flex-row lg:flex-col overflow-x-auto lg:overflow-x-visible gap-2 lg:space-y-2 pb-4 lg:pb-0 scrollbar-hide">
                    {menuItems.map((item, i) => (
                        <button
                            key={i}
                            onClick={() => setActiveTab(item.id as FiatTab)}
                            className={`flex-shrink-0 lg:w-full flex items-center gap-4 px-4 py-3 lg:py-4 rounded-2xl transition-all ${activeTab === item.id ? 'bg-white/10 text-white shadow-xl px-5' : 'text-text-tertiary hover:text-white hover:bg-white/5'}`}
                        >
                            <span className={`material-symbols-outlined text-2xl ${activeTab === item.id ? 'text-primary' : ''}`}>{item.icon}</span>
                            <span className="text-[10px] font-black uppercase tracking-widest">{item.label}</span>
                        </button>
                    ))}
                </nav>

                <button
                    onClick={onBack}
                    className="hidden lg:flex mt-auto items-center gap-4 px-4 py-5 bg-white/5 rounded-2xl text-text-tertiary hover:text-white hover:bg-white/10 transition-all border border-white/5 group"
                >
                    <span className="material-symbols-outlined text-2xl group-hover:-translate-x-1 transition-transform">arrow_back</span>
                    <span className="text-[10px] font-black uppercase tracking-widest">Back to Main</span>
                </button>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-6 sm:p-12 custom-scrollbar relative">
                {/* Top Header */}
                <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-12 sm:mb-16">
                    <div className="relative group w-full sm:w-96">
                        <span className="absolute left-6 top-1/2 -translate-y-1/2 material-symbols-outlined text-text-tertiary group-focus-within:text-primary transition-colors">search</span>
                        <input
                            type="text"
                            placeholder="Search diagnostics..."
                            className="w-full h-14 pl-16 pr-6 bg-surface-dark/30 border border-white/5 rounded-2xl focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all font-bold placeholder:text-gray-700"
                        />
                    </div>
                    <div className="flex flex-wrap items-center gap-4 lg:gap-6 w-full lg:w-auto">
                        <div className="flex items-center gap-2 px-6 py-3 bg-green-400/10 border border-green-400/20 rounded-full">
                            <span className="material-symbols-outlined text-green-400 text-sm animate-pulse">verified_user</span>
                            <span className="text-[9px] font-black text-green-400 uppercase tracking-widest">Session Active</span>
                        </div>
                        <button className="size-14 bg-surface-dark/40 border border-white/10 rounded-2xl flex items-center justify-center hover:bg-surface-elevated transition-all shadow-xl group ml-auto lg:ml-0">
                            <span className="material-symbols-outlined text-white group-hover:scale-110 transition-transform">notifications</span>
                        </button>
                    </div>
                </header>

                <AnimatePresence mode="wait">
                    {renderContent()}
                </AnimatePresence>

                {/* Floating Action Hint */}
                {activeTab === 'dashboard' && (
                    <div className="fixed bottom-12 right-12 flex items-center gap-3 bg-primary p-4 rounded-full shadow-2xl shadow-primary/40 cursor-pointer hover:scale-110 active:scale-95 transition-all border-4 border-white/10">
                        <span className="material-symbols-outlined text-white text-3xl font-bold">bolt</span>
                    </div>
                )}
            </main>
        </div>
    );
};

export default FiatDashboardScreen;
