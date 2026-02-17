import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB, sequelize } from './config/database';
import { User } from './models/User';
import { Wallet } from './models/Wallet';
import { Transaction } from './models/Transaction';
import { Contact } from './models/Contact';
import { Notification } from './models/Notification';
import { Escrow } from './models/Escrow';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
import authRoutes from './routes/auth';
import userRoutes from './routes/user';
import txRoutes from './routes/transactions';
import contactRoutes from './routes/contacts';
import notificationRoutes from './routes/notifications';
import escrowRoutes from './routes/escrow';
import exchangeRoutes from './routes/exchange';

app.get('/', (req, res) => {
  res.send('HashPay API is running');
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/transactions', txRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/escrow', escrowRoutes);
app.use('/api/exchange', exchangeRoutes);

// Database Connection and Server Start
const startServer = async () => {
  try {
    await connectDB();

    // Sync models with database
    // alter: true updates the table schema to match the model if it exists
    await sequelize.sync({ alter: true });
    console.log('✅ Database synchronized');

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
