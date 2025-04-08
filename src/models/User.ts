import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';
import bcrypt from 'bcryptjs';
import BorrowedBook from './BorrowedBook';

interface UserAttributes {
  id: number;
  fullName: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
}

interface UserCreationAttributes extends Omit<UserAttributes, 'id' | 'createdAt'> {}

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: number;
  public fullName!: string;
  public email!: string;
  public passwordHash!: string;
  public createdAt!: Date;

  // Timestamps
  public readonly updatedAt!: Date;

  // Associations
  public readonly borrowedBooks?: BorrowedBook[];
  public readonly currentBorrows?: BorrowedBook[];
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    fullName: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'full_name',
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    passwordHash: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'password_hash',
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: 'created_at',
    },
  },
  {
    sequelize,
    tableName: 'users',
    timestamps: true,
    underscored: true,
  }
);

// Password hashing hook
User.beforeCreate(async (user: User) => {
  if (user.changed('passwordHash')) {
    const salt = await bcrypt.genSalt(10);
    user.passwordHash = await bcrypt.hash(user.passwordHash, salt);
  }
});

export default User; 