import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';
import { User } from './User';

interface EscrowAttributes {
  id: number;
  user_id: number;
  amount: string;
  recipient: string;
  status?: 'pending' | 'completed' | 'disputed';
  expiryDate: Date;
}

interface EscrowCreationAttributes extends Optional<EscrowAttributes, 'id'> {}

export class Escrow extends Model<EscrowAttributes, EscrowCreationAttributes> implements EscrowAttributes {
  public id!: number;
  public user_id!: number;
  public amount!: string;
  public recipient!: string;
  public status!: 'pending' | 'completed' | 'disputed';
  public expiryDate!: Date;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Escrow.init(
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
    amount: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    recipient: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('pending', 'completed', 'disputed'),
      defaultValue: 'pending',
    },
    expiryDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'escrows',
  }
);

User.hasMany(Escrow, { foreignKey: 'user_id' });
Escrow.belongsTo(User, { foreignKey: 'user_id' });
