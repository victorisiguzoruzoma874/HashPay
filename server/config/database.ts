import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const DB_NAME = process.env.DB_NAME || 'hashpay_db';
const DB_USER = process.env.DB_USER || 'root';
const DB_PASS = process.env.DB_PASS || '';
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = process.env.DB_PORT || '3306';
const DB_DIALECT = (process.env.DB_DIALECT as 'mysql' | 'sqlite' | 'postgres') || 'sqlite';

export const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
  host: DB_HOST,
  port: parseInt(DB_PORT as string),
  dialect: DB_DIALECT as 'mysql' | 'sqlite' | 'postgres',
  storage: DB_DIALECT === 'sqlite' ? './database.sqlite' : undefined,
  dialectOptions: DB_DIALECT === 'postgres' ? {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  } : undefined,
  logging: false, // Set to console.log to see SQL queries
});

export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ MySQL Database connected successfully via WAMP.');
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error);
    process.exit(1);
  }
};
