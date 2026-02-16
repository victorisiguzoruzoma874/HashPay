import express from 'express';
import { Contact } from '../models/Contact';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = express.Router();

// Get all contacts for a user
router.get('/:userId', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const userId = req.params.userId === 'me' ? req.user!.id : parseInt(req.params.userId);

    if (isNaN(userId) || userId !== req.user!.id) {
        return res.status(403).json({ message: 'Forbidden' });
    }

    const contacts = await Contact.findAll({
      where: { user_id: userId },
      order: [['name', 'ASC']]
    });
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add a contact
router.post('/', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { name, address, avatar } = req.body;
    const userId = req.user!.id;

    const contact = await Contact.create({
      user_id: userId,
      name,
      address,
      avatar
    });
    res.json(contact);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a contact
router.delete('/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const contact = await Contact.findByPk(req.params.id);
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    
    if (contact.user_id !== req.user!.id) {
        return res.status(403).json({ message: 'Forbidden' });
    }

    await contact.destroy();
    res.json({ message: 'Contact deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
