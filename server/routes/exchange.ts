import express from 'express';
import { Transaction } from '../models/Transaction';
import { User } from '../models/User';
import { Wallet } from '../models/Wallet';
import { binanceService } from '../services/binanceService';

const router = express.Router();

// GET /api/exchange/rates
router.get('/rates', async (req, res) => {
    try {
        const assets = ['BTC', 'ETH', 'SUI'];
        const rates = await binanceService.getRates(assets);
        res.json(rates);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch rates' });
    }
});

// POST /api/exchange/on-ramp
router.post('/on-ramp', async (req, res) => {
    const { user_id, amount, currency, crypto_asset, external_tx_id } = req.body;

    try {
        const user = await User.findByPk(user_id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        if (user.kycStatus !== 'verified') {
            return res.status(403).json({ message: 'KYC verification required for on-ramp' });
        }

        // Create transaction record
        const transaction = await Transaction.create({
            user_id,
            type: 'on-ramp',
            amount: amount.toString(),
            currency,
            recipient: `Deposit ${crypto_asset}`,
            status: 'pending',
            external_tx_id
        });

        // In a real scenario, we'd wait for external payment confirmation
        // For this demo, we'll simulate immediate completion and wallet update
        transaction.status = 'completed';
        await transaction.save();

        const wallet = await Wallet.findOne({ where: { user_id, symbol: crypto_asset } });
        if (wallet) {
            const currentBalance = parseFloat(wallet.balance);
            // Mock calculation for deposit (simplified)
            const cryptoAmount = amount / 1000; // Mock rate NGN to Crypto
            wallet.balance = (currentBalance + cryptoAmount).toString();
            await wallet.save();
        }

        res.json({ message: 'On-ramp transaction successful', transaction });
    } catch (error) {
        res.status(500).json({ message: 'On-ramp processing failed' });
    }
});

// POST /api/exchange/off-ramp
router.post('/off-ramp', async (req, res) => {
    const { user_id, amount, crypto_asset, target_currency, bank_details } = req.body;

    try {
        const user = await User.findByPk(user_id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        if (user.kycStatus !== 'verified') {
            return res.status(403).json({ message: 'KYC verification required for off-ramp' });
        }

        const wallet = await Wallet.findOne({ where: { user_id, symbol: crypto_asset } });
        if (!wallet || parseFloat(wallet.balance) < amount) {
            return res.status(400).json({ message: 'Insufficient balance' });
        }

        // Deduct crypto balance
        wallet.balance = (parseFloat(wallet.balance) - amount).toString();
        await wallet.save();

        // Create transaction record
        const transaction = await Transaction.create({
            user_id,
            type: 'off-ramp',
            amount: amount.toString(),
            currency: crypto_asset,
            recipient: `${target_currency} Bank Transfer`,
            status: 'completed',
        });

        res.json({ message: 'Off-ramp initiated successfully', transaction });
    } catch (error) {
        res.status(500).json({ message: 'Off-ramp processing failed' });
    }
});

// POST /api/exchange/kyc
router.post('/kyc', async (req, res) => {
    const { user_id, kycData } = req.body;
    try {
        const user = await User.findByPk(user_id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        user.kycStatus = 'pending';
        user.kycData = kycData;
        await user.save();

        // Simulating auto-approval for demo purposes
        setTimeout(async () => {
            user.kycStatus = 'verified';
            await user.save();
        }, 5000);

        res.json({ message: 'KYC documents submitted for verification', status: 'pending' });
    } catch (error) {
        res.status(500).json({ message: 'KYC submission failed' });
    }
});

export default router;
