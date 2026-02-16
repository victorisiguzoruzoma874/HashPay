import express from 'express';
import { Escrow } from '../models/Escrow';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = express.Router();

// Get all escrow transactions for a user
router.get('/:userId', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const userId = req.params.userId === 'me' ? req.user!.id : parseInt(req.params.userId);

    if (isNaN(userId) || userId !== req.user!.id) {
        return res.status(403).json({ message: 'Forbidden' });
    }

    const escrows = await Escrow.findAll({
      where: { user_id: userId },
      order: [['createdAt', 'DESC']]
    });
    res.json(escrows);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create an escrow transaction
router.post('/', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { amount, recipient, expiryDate } = req.body;
    const userId = req.user!.id;

    const escrow = await Escrow.create({
      user_id: userId,
      amount,
      recipient,
      status: 'pending',
      expiryDate: new Date(expiryDate)
    });
    res.json(escrow);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update escrow status
router.patch('/:id/status', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { status } = req.body;
    const escrow = await Escrow.findByPk(req.params.id);
    if (!escrow) {
      return res.status(404).json({ message: 'Escrow not found' });
    }

    if (escrow.user_id !== req.user!.id) {
        return res.status(403).json({ message: 'Forbidden' });
    }

    await escrow.update({ status });
    res.json(escrow);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
