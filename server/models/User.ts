import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

interface UserAttributes {
  id: number;
  email: string; // Using email as the primary identifier for login
  password_hash: string;
  name: string;
  address: string;
  kycStatus: 'unverified' | 'pending' | 'verified';
  kycData?: any;
}

interface UserCreationAttributes extends Optional<UserAttributes, 'id' | 'address' | 'kycStatus' | 'kycData'> { }

export class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: number;
  public email!: string;
  public password_hash!: string;
  public name!: string;
  public address!: string;
  public kycStatus!: 'unverified' | 'pending' | 'verified';
  public kycData?: any;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      }
    },
    password_hash: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '0x71c7656ec7ab88b098defb751b7401b5f6d8976f9a2b8e390c58e6d89b8e390c'
    },
    kycStatus: {
      type: DataTypes.ENUM('unverified', 'pending', 'verified'),
      defaultValue: 'unverified',
    },
    kycData: {
      type: DataTypes.JSON,
      allowNull: true,
    }
  },
  {
    sequelize,
    tableName: 'users',
  }
);
