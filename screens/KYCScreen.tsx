import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useWallet } from '../WalletContext';

interface KYCScreenProps {
    onBack: () => void;
}

const KYCScreen: React.FC<KYCScreenProps> = ({ onBack }) => {
    const { submitKYC, userProfile } = useWallet();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        fullName: '',
        idNumber: '',
        idType: 'Passport',
        country: 'Nigeria'
    });

    const handleNext = () => setStep(prev => prev + 1);
    const handleSubmit = async () => {
        await submitKYC(formData);
        onBack();
    };

    return (
        <div className="min-h-screen bg-[#0d121b] text-white p-8 flex flex-col items-center justify-center">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md bg-surface-dark/30 border border-white/5 p-10 rounded-[2.5rem] glass shadow-2xl"
            >
                <button onClick={onBack} className="mb-8 text-text-tertiary hover:text-white flex items-center gap-2">
                    <span className="material-symbols-outlined">arrow_back</span>
                    <span className="text-xs font-black uppercase tracking-widest">Cancel</span>
                </button>

                <h1 className="text-3xl font-black font-display mb-2">KYC Verification</h1>
                <p className="text-sm text-text-tertiary mb-10">Complete verification to unlock On-Ramp/Off-Ramp features.</p>

                {userProfile.kycStatus === 'pending' ? (
                    <div className="text-center py-12">
                        <span className="material-symbols-outlined text-6xl text-primary animate-pulse mb-6">verified_user</span>
                        <h2 className="text-xl font-black mb-2">Verification Pending</h2>
                        <p className="text-sm text-text-tertiary">We are reviewing your documents. This usually takes a few minutes.</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {step === 1 && (
                            <motion.div initial={{ x: 20 }} animate={{ x: 0 }}>
                                <label className="text-[10px] font-black uppercase tracking-widest text-[#6B7280] mb-2 block">Full Legal Name</label>
                                <input
                                    type="text"
                                    value={formData.fullName}
                                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                    className="w-full h-14 bg-white/5 border border-white/10 rounded-xl px-4 focus:outline-none focus:border-primary font-bold"
                                    placeholder="John Doe"
                                />
                                <button onClick={handleNext} className="w-full mt-8 py-5 bg-primary rounded-xl font-black uppercase tracking-widest shadow-lg">Next Step</button>
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div initial={{ x: 20 }} animate={{ x: 0 }}>
                                <label className="text-[10px] font-black uppercase tracking-widest text-[#6B7280] mb-2 block">ID Type</label>
                                <select
                                    value={formData.idType}
                                    onChange={(e) => setFormData({ ...formData, idType: e.target.value })}
                                    className="w-full h-14 bg-white/5 border border-white/10 rounded-xl px-4 focus:outline-none focus:border-primary font-bold appearance-none mb-4"
                                >
                                    <option>Passport</option>
                                    <option>National ID</option>
                                    <option>Driver's License</option>
                                </select>

                                <label className="text-[10px] font-black uppercase tracking-widest text-[#6B7280] mb-2 block">ID Number</label>
                                <input
                                    type="text"
                                    value={formData.idNumber}
                                    onChange={(e) => setFormData({ ...formData, idNumber: e.target.value })}
                                    className="w-full h-14 bg-white/5 border border-white/10 rounded-xl px-4 focus:outline-none focus:border-primary font-bold"
                                    placeholder="AB1234567"
                                />
                                <button onClick={handleSubmit} className="w-full mt-8 py-5 bg-[#22c55e] rounded-xl font-black uppercase tracking-widest shadow-lg">Submit Verification</button>
                            </motion.div>
                        )}
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default KYCScreen;
