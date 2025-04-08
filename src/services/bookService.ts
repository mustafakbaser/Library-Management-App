import { Book, BorrowedBook } from '../models';
import { Op } from 'sequelize';

export class BookService {
  async getAllBooks() {
    return await Book.findAll({
      attributes: ['id', 'title'],
      order: [['title', 'ASC']],
    });
  }

  async getBookById(id: number) {
    const book = await Book.findByPk(id, {
      attributes: ['id', 'title'],
      include: [
        {
          model: BorrowedBook,
          as: 'borrowedBooks',
          where: {
            isReturned: true,
            rating: {
              [Op.not]: null,
            },
          },
          attributes: ['rating'],
        },
      ],
    });

    if (!book) {
      throw new Error('Kitap bulunamadı');
    }

    const ratings = book.borrowedBooks?.map((borrow: BorrowedBook) => borrow.rating).filter((rating): rating is number => rating !== null) || [];
    const averageScore = ratings.length > 0
      ? (ratings.reduce((a: number, b: number) => a + b, 0) / ratings.length).toFixed(2)
      : -1;

    return {
      id: book.id,
      name: book.title,
      score: averageScore,
    };
  }

  async createBook(title: string, author?: string, isbn?: string, publishedYear?: number, genre?: string) {
    const book = await Book.create({
      title,
      viewCount: 0,
      author: author || '',
      isbn: isbn || '',
      publishedYear: publishedYear || new Date().getFullYear(),
      genre: genre || '',
    });

    return book;
  }
} 