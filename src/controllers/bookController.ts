import { Request, Response } from 'express';
import { BookService } from '../services/bookService';

const bookService = new BookService();

export class BookController {
  async getAllBooks(req: Request, res: Response) {
    try {
      const books = await bookService.getAllBooks();
      res.json(books.map(book => ({
        id: book.id,
        name: book.title,
      })));
    } catch (error) {
      res.status(500).json({ error: 'Kitaplar getirilirken bir hata oluştu' });
    }
  }

  async getBookById(req: Request, res: Response) {
    try {
      const bookId = parseInt(req.params.id);
      const book = await bookService.getBookById(bookId);
      res.json(book);
    } catch (error) {
      if (error instanceof Error && error.message === 'Kitap bulunamadı') {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Kitap bilgileri getirilirken bir hata oluştu' });
      }
    }
  }

  async createBook(req: Request, res: Response) {
    try {
      const { name } = req.body;
      await bookService.createBook(name);
      res.status(201).send();
    } catch (error) {
      res.status(500).json({ error: 'Kitap oluşturulurken bir hata oluştu' });
    }
  }
} 