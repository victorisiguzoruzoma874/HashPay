import express from 'express';
import { sequelize } from '../config/database';
import { Transaction } from '../models/Transaction';
import { Wallet } from '../models/Wallet';
import { User } from '../models/User';
import { Notification } from '../models/Notification';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = express.Router();

// Get all transactions for a user
router.get('/:userId', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const userId = parseInt(req.params.userId === 'me' ? req.user!.id.toString() : req.params.userId);
    
    if (userId !== req.user!.id) {
       return res.status(403).json({ message: 'Forbidden' });
    }

    const transactions = await Transaction.findAll({
      where: { user_id: userId },
      order: [['date', 'DESC']]
    });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Send Money (Internal Transfer simulation)
router.post('/send', authenticateToken, async (req: AuthRequest, res) => {
  const t = await sequelize.transaction();
  
  try {
    const { recipientEmail, amount, currency } = req.body;
    const userId = req.user!.id;
    const amountFloat = parseFloat(amount);

    // 1. Check Sender
    const senderWallet = await Wallet.findOne({ 
        where: { user_id: userId, currency } 
    });

    if (!senderWallet || parseFloat(senderWallet.balance) < amountFloat) {
        await t.rollback();
        return res.status(400).json({ message: 'Insufficient funds' });
    }

    // 2. Check Recipient
    const recipientUser = await User.findOne({ where: { email: recipientEmail } });
    
    // 3. Deduct from Sender
    const newSenderBalance = (parseFloat(senderWallet.balance) - amountFloat).toString();
    await senderWallet.update({ balance: newSenderBalance }, { transaction: t });

    // 4. Create Transaction Record for Sender
    const senderTx = await Transaction.create({
        user_id: userId,
        type: 'sent',
        amount: amount,
        currency,
        recipient: recipientEmail,
        status: 'completed',
        date: new Date()
    }, { transaction: t });

    // 5. Credit Recipient (if exists internal user)
    if (recipientUser) {
        let recipientWallet = await Wallet.findOne({ 
            where: { user_id: recipientUser.id, currency } 
        });

        if (recipientWallet) {
             const newRecipientBalance = (parseFloat(recipientWallet.balance) + amountFloat).toString();
             await recipientWallet.update({ balance: newRecipientBalance }, { transaction: t });
        } else {
             await Wallet.create({
                user_id: recipientUser.id,
                name: 'Main Wallet',
                balance: amount,
                currency,
                symbol: currency.substring(0,2), 
                color: '#000',
                icon: 'wallet',
                fiatValue: amount // mockup conversion
             }, { transaction: t });
        }

        // Create Transaction Record for Recipient
        await Transaction.create({
            user_id: recipientUser.id,
            type: 'received',
            amount: amount,
            currency,
            recipient: `User ${userId}`, 
            status: 'completed',
            date: new Date()
        }, { transaction: t });

        // Notify Recipient
        await Notification.create({
            user_id: recipientUser.id,
            title: 'Payment Received',
            message: `You received ${amount} ${currency} from User ${userId}`,
            type: 'transaction',
            read: false,
            date: new Date()
        }, { transaction: t });
    }

    await t.commit();
    res.json({ message: 'Transaction successful', transaction: senderTx });

  } catch (error) {
    await t.rollback();
    console.error('Transaction error:', error);
    res.status(500).json({ message: 'Transaction failed' });
  }
});

export default router;
