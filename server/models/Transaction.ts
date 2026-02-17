import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';
import { User } from './User';

interface TransactionAttributes {
  id: number;
  user_id: number;
  type: 'sent' | 'received' | 'on-ramp' | 'off-ramp';
  amount: string;
  currency: string;
  recipient: string;
  status: 'pending' | 'completed' | 'failed';
  date: Date;
  avatar?: string;
  external_tx_id?: string;
}

interface TransactionCreationAttributes extends Optional<TransactionAttributes, 'id' | 'external_tx_id' | 'date'> { }

export class Transaction extends Model<TransactionAttributes, TransactionCreationAttributes> implements TransactionAttributes {
  public id!: number;
  public user_id!: number;
  public type!: 'sent' | 'received' | 'on-ramp' | 'off-ramp';
  public amount!: string;
  public currency!: string;
  public recipient!: string;
  public status!: 'pending' | 'completed' | 'failed';
  public date!: Date;
  public avatar?: string;
  public external_tx_id?: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Transaction.init(
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
    type: {
      type: DataTypes.ENUM('sent', 'received', 'on-ramp', 'off-ramp'),
      allowNull: false,
    },
    amount: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    currency: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    recipient: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('pending', 'completed', 'failed'),
      defaultValue: 'completed',
    },
    date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    avatar: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    external_tx_id: {
      type: DataTypes.STRING,
      allowNull: true,
    }
  },
  {
    sequelize,
    tableName: 'transactions',
  }
);

User.hasMany(Transaction, { foreignKey: 'user_id' });
Transaction.belongsTo(User, { foreignKey: 'user_id' });
