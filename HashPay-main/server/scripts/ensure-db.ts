import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const createDB = async () => {
  const ports = [3306, 3307];
  let connected = false;

  for (const port of ports) {
    try {
      console.log(`🔗 Attempting to connect to MySQL/MariaDB on 127.0.0.1:${port}...`);
      const connection = await mysql.createConnection({
        host: '127.0.0.1',
        user: 'root',
        password: '',
        port: port,
        connectTimeout: 5000
      });

      await connection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME || 'hashpay_db'}\`;`);
      console.log(`✅ Database ensured on port ${port}.`);
      await connection.end();
      connected = true;
      
      // Update .env with working port if it's not 3306
      if (port !== 3306) {
        console.log(`⚠️ Database found on non-standard port ${port}. Please update .env if needed.`);
      }
      break;
    } catch (error: any) {
      console.log(`❌ Failed to connect on port ${port}: ${error.message}`);
    }
  }

  if (!connected) {
    console.error('❌ Could not connect to any database port.');
    process.exit(1);
  }
  process.exit(0);
};

createDB();
