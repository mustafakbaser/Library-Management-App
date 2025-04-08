import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';
import User from './User';
import Book from './Book';

interface BorrowedBookAttributes {
  id: number;
  userId: number;
  bookId: number;
  borrowDate: Date;
  returnDate: Date | null;
  isReturned: boolean;
  rating: number | null;
}

interface BorrowedBookCreationAttributes extends Omit<BorrowedBookAttributes, 'id' | 'borrowDate'> {}

class BorrowedBook extends Model<BorrowedBookAttributes, BorrowedBookCreationAttributes> implements BorrowedBookAttributes {
  public id!: number;
  public userId!: number;
  public bookId!: number;
  public borrowDate!: Date;
  public returnDate!: Date | null;
  public isReturned!: boolean;
  public rating!: number | null;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Associations
  public readonly user?: User;
  public readonly book?: Book;
}

BorrowedBook.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'user_id',
      references: {
        model: User,
        key: 'id',
      },
    },
    bookId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'book_id',
      references: {
        model: Book,
        key: 'id',
      },
    },
    borrowDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: 'borrow_date',
    },
    returnDate: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'return_date',
    },
    isReturned: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: 'is_returned',
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: 1,
        max: 5,
      },
    },
  },
  {
    sequelize,
    tableName: 'borrowed_books',
    timestamps: false,
    underscored: true,
  }
);

export default BorrowedBook; 