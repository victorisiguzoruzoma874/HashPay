import express from 'express';
import { Notification } from '../models/Notification';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = express.Router();

// Get all notifications for a user
router.get('/:userId', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const userId = req.params.userId === 'me' ? req.user!.id : parseInt(req.params.userId);

    if (isNaN(userId) || userId !== req.user!.id) {
        return res.status(403).json({ message: 'Forbidden' });
    }

    const notifications = await Notification.findAll({
      where: { user_id: userId },
      order: [['date', 'DESC']]
    });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Mark notification as read
router.patch('/:id/read', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const notification = await Notification.findByPk(req.params.id);
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    if (notification.user_id !== req.user!.id) {
        return res.status(403).json({ message: 'Forbidden' });
    }

    await notification.update({ read: true });
    res.json(notification);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a notification
router.delete('/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const notification = await Notification.findByPk(req.params.id);
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    if (notification.user_id !== req.user!.id) {
        return res.status(403).json({ message: 'Forbidden' });
    }

    await notification.destroy();
    res.json({ message: 'Notification deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
