import { Request, Response } from 'express';
import { UserService } from '../services/userService';

const userService = new UserService();

export class UserController {
  async getAllUsers(req: Request, res: Response) {
    try {
      const users = await userService.getAllUsers();
      res.json(users.map(user => ({
        id: user.id,
        name: user.fullName,
      })));
    } catch (error) {
      res.status(500).json({ error: 'Kullanıcılar getirilirken bir hata oluştu' });
    }
  }

  async getUserById(req: Request, res: Response) {
    try {
      const userId = parseInt(req.params.id);
      const user = await userService.getUserById(userId);
      res.json(user);
    } catch (error) {
      if (error instanceof Error && error.message === 'Kullanıcı bulunamadı') {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Kullanıcı bilgileri getirilirken bir hata oluştu' });
      }
    }
  }

  async createUser(req: Request, res: Response) {
    try {
      const { name } = req.body;
      const user = await userService.createUser(name);
      res.status(201).send();
    } catch (error) {
      res.status(500).json({ error: 'Kullanıcı oluşturulurken bir hata oluştu' });
    }
  }

  async borrowBook(req: Request, res: Response) {
    try {
      const userId = parseInt(req.params.userId);
      const bookId = parseInt(req.params.bookId);
      await userService.borrowBook(userId, bookId);
      res.status(204).send();
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'Kullanıcı veya kitap bulunamadı') {
          res.status(404).json({ error: error.message });
        } else if (error.message === 'Bu kitap zaten ödünç alınmış') {
          res.status(400).json({ error: error.message });
        } else {
          res.status(500).json({ error: 'Kitap ödünç alınırken bir hata oluştu' });
        }
      }
    }
  }

  async returnBook(req: Request, res: Response) {
    try {
      const userId = parseInt(req.params.userId);
      const bookId = parseInt(req.params.bookId);
      const { score } = req.body;
      await userService.returnBook(userId, bookId, score);
      res.status(204).send();
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'Ödünç alınmış kitap bulunamadı') {
          res.status(404).json({ error: error.message });
        } else {
          res.status(500).json({ error: 'Kitap iade edilirken bir hata oluştu' });
        }
      }
    }
  }
} 