import { User, Book, BorrowedBook } from '../models';
import { Op } from 'sequelize';

export class UserService {
  async getAllUsers() {
    return await User.findAll({
      attributes: ['id', 'fullName'],
      order: [['fullName', 'ASC']],
    });
  }

  async getUserById(id: number) {
    const user = await User.findByPk(id, {
      attributes: ['id', 'fullName'],
      include: [
        {
          model: BorrowedBook,
          as: 'borrowedBooks',
          include: [
            {
              model: Book,
              as: 'book',
              attributes: ['title'],
            },
          ],
          where: {
            isReturned: true,
          },
          attributes: ['rating'],
          required: false
        },
        {
          model: BorrowedBook,
          as: 'currentBorrows',
          include: [
            {
              model: Book,
              as: 'book',
              attributes: ['title'],
            },
          ],
          attributes: [],
          required: false
        },
      ],
    });

    if (!user) {
      throw new Error('Kullanıcı bulunamadı');
    }

    const pastBooks = user.borrowedBooks?.map((borrow: BorrowedBook) => ({
      name: borrow.book?.title,
      userScore: borrow.rating,
    })) || [];

    const presentBooks = user.currentBorrows?.map((borrow: BorrowedBook) => ({
      name: borrow.book?.title,
    })) || [];

    return {
      id: user.id,
      name: user.fullName,
      books: {
        past: pastBooks,
        present: presentBooks,
      },
    };
  }

  async createUser(fullName: string, email: string, passwordHash: string) {
    const user = await User.create({
      fullName,
      email,
      passwordHash,
    });

    return user;
  }

  async borrowBook(userId: number, bookId: number) {
    const [user, book] = await Promise.all([
      User.findByPk(userId),
      Book.findByPk(bookId),
    ]);

    if (!user || !book) {
      throw new Error('Kullanıcı veya kitap bulunamadı');
    }

    const existingBorrow = await BorrowedBook.findOne({
      where: {
        userId,
        bookId,
        isReturned: false,
      },
    });

    if (existingBorrow) {
      throw new Error('Bu kitap zaten ödünç alınmış');
    }

    await BorrowedBook.create({
      userId,
      bookId,
      isReturned: false,
    });

    await book.increment('viewCount');
  }

  async returnBook(userId: number, bookId: number, rating: number) {
    const borrowedBook = await BorrowedBook.findOne({
      where: {
        userId,
        bookId,
        isReturned: false,
      },
    });

    if (!borrowedBook) {
      throw new Error('Ödünç alınmış kitap bulunamadı');
    }

    await borrowedBook.update({
      isReturned: true,
      returnDate: new Date(),
      rating,
    });
  }
} 