import { sequelize } from '../config/database';

const testConnection = async () => {
  try {
    console.log('🔍 Testing database connection...');
    await sequelize.authenticate();
    console.log('✅ Connection has been established successfully.');
    
    // Check if we can see the tables
    const [results] = await sequelize.query('SHOW TABLES');
    console.log('📊 Tables in database:', results);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error);
    process.exit(1);
  }
};

testConnection();
