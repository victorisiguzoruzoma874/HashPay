import express from 'express';
import { User } from '../models/User';
import { Wallet } from '../models/Wallet';
import { Transaction } from '../models/Transaction';
import { Notification } from '../models/Notification';
import { Contact } from '../models/Contact';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = express.Router();

// Get User Profile & Dashboard Data
// We allow /me or /:id, but both must match the token's user id
router.get('/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const idParam = req.params.id;
    const userId = idParam === 'me' ? req.user!.id : parseInt(idParam);

    if (isNaN(userId) || userId !== req.user!.id) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const wallets = await Wallet.findAll({ where: { user_id: userId } });
    const transactions = await Transaction.findAll({
      where: { user_id: userId },
      order: [['date', 'DESC']],
      limit: 5
    });
    const notifications = await Notification.findAll({
      where: { user_id: userId, read: false }
    });

    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        address: user.address
      },
      wallets,
      recentTransactions: transactions,
      unreadNotifications: notifications.length
    });
  } catch (error) {
    console.error('Fetch user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get User Contacts
router.get('/:id/contacts', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const idParam = req.params.id;
    const userId = idParam === 'me' ? req.user!.id : parseInt(idParam);

    if (isNaN(userId) || userId !== req.user!.id) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const contacts = await Contact.findAll({ where: { user_id: userId } });
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
