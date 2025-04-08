import User from './User';
import Book from './Book';
import BorrowedBook from './BorrowedBook';

// User - BorrowedBook associations
User.hasMany(BorrowedBook, {
  foreignKey: 'userId',
  as: 'borrowedBooks',
});

User.hasMany(BorrowedBook, {
  foreignKey: 'userId',
  as: 'currentBorrows',
  scope: {
    isReturned: false
  }
});

// Book - BorrowedBook associations
Book.hasMany(BorrowedBook, {
  foreignKey: 'bookId',
  as: 'borrowedBooks',
});

// BorrowedBook - User associations
BorrowedBook.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user',
});

// BorrowedBook - Book associations
BorrowedBook.belongsTo(Book, {
  foreignKey: 'bookId',
  as: 'book',
});

export { User, Book, BorrowedBook }; 