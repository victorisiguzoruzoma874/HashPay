import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWallet } from '../WalletContext';
import { useToast } from '../components/Toast';

interface ExchangeScreenProps {
    onBack: () => void;
}

const ExchangeScreen: React.FC<ExchangeScreenProps> = ({ onBack }) => {
    const { onRamp, offRamp, userProfile, wallets } = useWallet();
    const { showToast } = useToast();
    const [type, setType] = useState<'buy' | 'sell'>('buy');
    const [amount, setAmount] = useState('10000');
    const [asset, setAsset] = useState('SUI');
    const [fiat, setFiat] = useState('NGN');
    const [rates, setRates] = useState<any>({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Mock fetching rates from our new backend
        const fetchRates = async () => {
            try {
                const resp = await fetch('http://localhost:3000/api/exchange/rates');
                const data = await resp.json();
                setRates(data);
            } catch (e) {
                setRates({ 'SUIUSDT': '1.25', 'BTCUSDT': '65000', 'ETHUSDT': '2300' });
            }
        };
        fetchRates();
    }, []);

    const handleExchange = async () => {
        if (userProfile.kycStatus !== 'verified') {
            showToast('KYC verification required!', 'error');
            return;
        }

        setLoading(true);
        try {
            if (type === 'buy') {
                await onRamp({
                    amount: parseFloat(amount),
                    currency: fiat,
                    crypto_asset: asset,
                    external_tx_id: `MOCK-${Date.now()}`
                });
            } else {
                await offRamp({
                    amount: parseFloat(amount),
                    crypto_asset: asset,
                    target_currency: fiat
                });
            }
            onBack();
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const currentRate = rates[`${asset}USDT`] || '---';

    return (
        <div className="min-h-screen bg-[#0d121b] text-white p-8 flex flex-col items-center">
            <header className="w-full max-w-4xl flex justify-between items-center mb-16">
                <button onClick={onBack} className="size-12 rounded-2xl bg-white/5 flex items-center justify-center hover:bg-white/10 transition-all">
                    <span className="material-symbols-outlined">arrow_back</span>
                </button>
                <h1 className="text-2xl font-black font-display uppercase tracking-widest">Crypto Exchange</h1>
                <div className="size-12 rounded-2xl bg-white/5 flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary">currency_exchange</span>
                </div>
            </header>

            <main className="w-full max-w-2xl bg-surface-dark/20 border border-white/5 rounded-[3rem] p-12 glass shadow-2xl">
                <div className="flex p-2 bg-surface-dark/50 rounded-2xl border border-white/5 mb-10">
                    <button
                        onClick={() => setType('buy')}
                        className={`flex-1 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${type === 'buy' ? 'bg-[#22c55e] text-white' : 'text-text-tertiary'}`}
                    >
                        Buy Crypto
                    </button>
                    <button
                        onClick={() => setType('sell')}
                        className={`flex-1 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${type === 'sell' ? 'bg-error text-white' : 'text-text-tertiary'}`}
                    >
                        Sell Crypto
                    </button>
                </div>

                <div className="space-y-8">
                    <div>
                        <div className="flex justify-between items-end mb-4 px-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-text-tertiary">Select Asset</label>
                            <span className="text-[10px] font-black text-primary">Live Rate: ${currentRate}</span>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            {['SUI', 'BTC', 'ETH'].map(a => (
                                <button
                                    key={a}
                                    onClick={() => setAsset(a)}
                                    className={`py-4 rounded-2xl border transition-all ${asset === a ? 'bg-primary/10 border-primary text-white' : 'bg-white/5 border-white/5 text-text-tertiary'}`}
                                >
                                    <span className="font-black text-xs">{a}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="text-[10px] font-black uppercase tracking-widest text-text-tertiary mb-4 block px-2">Amount ({type === 'buy' ? fiat : asset})</label>
                        <div className="relative">
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="w-full h-24 bg-surface-dark/50 border border-white/10 rounded-[2rem] px-8 text-4xl font-black focus:outline-none focus:border-primary placeholder:text-gray-800"
                            />
                            <span className="absolute right-8 top-1/2 -translate-y-1/2 text-2xl font-black text-text-tertiary opacity-50">{type === 'buy' ? fiat : asset}</span>
                        </div>
                    </div>

                    {userProfile.kycStatus !== 'verified' ? (
                        <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 flex items-center gap-6">
                            <span className="material-symbols-outlined text-primary text-3xl">info</span>
                            <div className="flex-1">
                                <p className="text-sm font-bold text-white">Verification Required</p>
                                <p className="text-[10px] text-text-tertiary">You need to complete KYC to start trading.</p>
                            </div>
                            <button className="px-4 py-2 bg-primary rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg">Verify Now</button>
                        </div>
                    ) : (
                        <div className="bg-surface-dark/30 rounded-2xl p-6 border border-white/5 space-y-4">
                            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                                <span className="text-text-tertiary">Fee</span>
                                <span className="text-white">0.5%</span>
                            </div>
                            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                                <span className="text-text-tertiary">Estimated Receive</span>
                                <span className="text-[#22c55e]">
                                    {type === 'buy' ?
                                        (parseFloat(amount) / (parseFloat(currentRate) || 1) / 1500).toFixed(4) + ' ' + asset :
                                        (parseFloat(amount) * (parseFloat(currentRate) || 1) * 1450).toLocaleString() + ' ' + fiat
                                    }
                                </span>
                            </div>
                        </div>
                    )}

                    <button
                        disabled={loading || userProfile.kycStatus !== 'verified'}
                        onClick={handleExchange}
                        className={`w-full py-6 rounded-[2rem] font-black uppercase tracking-[0.4em] shadow-2xl transition-all active:scale-95 ${loading ? 'bg-gray-800' : (type === 'buy' ? 'bg-[#22c55e]' : 'bg-error')}`}
                    >
                        {loading ? 'Processing...' : (type === 'buy' ? 'Confirm Purchase' : 'Confirm Sale')}
                    </button>
                </div>
            </main>
        </div>
    );
};

export default ExchangeScreen;
