import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';
import { User } from './User';

interface WalletAttributes {
  id: number;
  user_id: number;
  name: string;
  balance: string; // storing as string to avoid precision issues, or use DECIMAL
  currency: string;
  symbol: string;
  color?: string;
  icon?: string;
  fiatValue: string;
}

interface WalletCreationAttributes extends Optional<WalletAttributes, 'id'> {}

export class Wallet extends Model<WalletAttributes, WalletCreationAttributes> implements WalletAttributes {
  public id!: number;
  public user_id!: number;
  public name!: string;
  public balance!: string;
  public currency!: string;
  public symbol!: string;
  public color!: string;
  public icon!: string;
  public fiatValue!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Wallet.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    balance: {
      type: DataTypes.STRING, // or DECIMAL(20, 8)
      defaultValue: '0',
    },
    currency: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    symbol: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    color: {
      type: DataTypes.STRING,
      defaultValue: '#00f2fe',
    },
    icon: {
      type: DataTypes.STRING,
      defaultValue: 'wallet',
    },
    fiatValue: {
      type: DataTypes.STRING,
      defaultValue: '0.00'
    }
  },
  {
    sequelize,
    tableName: 'wallets',
  }
);

// Relationships
User.hasMany(Wallet, { foreignKey: 'user_id' });
Wallet.belongsTo(User, { foreignKey: 'user_id' });
