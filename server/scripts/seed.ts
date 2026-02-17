import { sequelize } from '../config/database';
import { User } from '../models/User';
import { Wallet } from '../models/Wallet';
import { Transaction } from '../models/Transaction';
import { Contact } from '../models/Contact';
import { Notification } from '../models/Notification';
import { Escrow } from '../models/Escrow';
import dotenv from 'dotenv';

dotenv.config();

const seed = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ force: true }); // WARNING: This drops tables!

    console.log('🌱 Database synced. Seeding...');

    // Create Demo User
    const user = await User.create({
      id: 1, // Force ID 1
      name: 'Alex Mercer',
      email: 'alex.mercer@hashpay.io',
      password_hash: 'password123',
      address: '0x71c7656ec7ab88b098defb751b7401b5f6d8976f9a2b8e390c58e6d89b8e390c'
    });

    // Create Wallets
    await Wallet.bulkCreate([
      {
        user_id: user.id,
        name: 'Main SUI',
        balance: '10240.50',
        currency: 'SUI',
        symbol: 'SUI',
        fiatValue: '12450.00',
        color: 'from-[#3898EC] to-[#1e589e]',
        icon: 'water_drop'
      },
      {
        user_id: user.id,
        name: 'Stable USDC',
        balance: '200.00',
        currency: 'USDC',
        symbol: 'USDC',
        fiatValue: '200.00',
        color: 'bg-surface-dark border border-gray-700',
        icon: 'attach_money'
      }
    ]);

    // 4. Create Transactions
    await Transaction.bulkCreate([
      {
        user_id: user.id,
        type: 'received',
        amount: '50.00',
        currency: 'SUI',
        recipient: 'Alice Freeman',
        status: 'completed',
        date: new Date(Date.now() - 3600000)
      },
      {
        user_id: user.id,
        type: 'sent',
        amount: '10.00',
        currency: 'SUI',
        recipient: 'Bob Smith',
        status: 'completed',
        date: new Date(Date.now() - 86400000)
      }
    ]);

    // 5. Create Contacts
    await Contact.bulkCreate([
      {
        user_id: user.id,
        name: 'Alice Freeman',
        address: '0xAlice12345678901234567890123456789012345678901234567890123456789',
        avatar: 'https://i.pravatar.cc/150?u=alice'
      },
      {
        user_id: user.id,
        name: 'Bob Smith',
        address: '0xBob456789012345678901234567890123456789012345678901234567890123',
        avatar: 'https://i.pravatar.cc/150?u=bob'
      }
    ]);

    // 6. Create Notifications
    await Notification.bulkCreate([
      {
        user_id: user.id,
        title: 'Welcome to HashPay',
        message: 'Your account has been successfully created.',
        type: 'promo',
        read: false,
        date: new Date()
      },
      {
        user_id: user.id,
        title: 'Security Alert',
        message: 'New login detected from a new device.',
        type: 'security',
        read: false,
        date: new Date()
      }
    ]);

    // 7. Create Escrow
    await Escrow.create({
      user_id: user.id,
      amount: '25.50',
      recipient: 'Service Provider',
      status: 'pending',
      expiryDate: new Date(Date.now() + 604800000) // 1 week from now
    });

    console.log('✅ Seeding complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seed();
