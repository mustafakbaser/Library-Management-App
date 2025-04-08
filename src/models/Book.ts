import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';
import BorrowedBook from './BorrowedBook';

interface BookAttributes {
  id: number;
  title: string;
  author: string;
  isbn: string;
  publishedYear: number;
  genre: string;
  viewCount: number;
  createdAt: Date;
}

interface BookCreationAttributes extends Omit<BookAttributes, 'id' | 'createdAt'> {}

class Book extends Model<BookAttributes, BookCreationAttributes> implements BookAttributes {
  public id!: number;
  public title!: string;
  public author!: string;
  public isbn!: string;
  public publishedYear!: number;
  public genre!: string;
  public viewCount!: number;
  public createdAt!: Date;

  // Timestamps
  public readonly updatedAt!: Date;

  // Associations
  public readonly borrowedBooks?: BorrowedBook[];
}

Book.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    author: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    isbn: {
      type: DataTypes.STRING(13),
      allowNull: true,
    },
    publishedYear: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'published_year',
    },
    genre: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    viewCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: 'view_count',
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
    tableName: 'books',
    timestamps: false,
    underscored: true,
  }
);

export default Book; 