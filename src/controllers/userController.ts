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
      console.log('Request Body:', req.body);
      const { fullName, email, passwordHash } = req.body;
      console.log('Parsed fields:', { fullName, email, passwordHash });
      const user = await userService.createUser(fullName, email, passwordHash);
      console.log('User created:', user);
      res.status(201).send();
    } catch (error) {
      console.error('Create user error:', error);
      res.status(500).json({ error: 'Kullanıcı oluşturulurken bir hata oluştu' });
    }
  }

  async borrowBook(req: Request, res: Response) {
    try {
      const userId = parseInt(req.params.userId);
      const bookId = parseInt(req.params.bookId);
      
      if (isNaN(userId) || isNaN(bookId)) {
        return res.status(400).json({ 
          error: 'Geçersiz ID formatı',
          details: 'Kullanıcı ID ve Kitap ID sayısal değer olmalıdır'
        });
      }

      await userService.borrowBook(userId, bookId);
      res.status(200).json({ 
        message: 'Kitap başarıyla ödünç alındı',
        data: {
          userId,
          bookId,
          status: 'borrowed'
        }
      });
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'Kullanıcı veya kitap bulunamadı') {
          res.status(404).json({ 
            error: 'Kaynak bulunamadı',
            details: error.message 
          });
        } else if (error.message === 'Bu kitap zaten ödünç alınmış') {
          res.status(400).json({ 
            error: 'İşlem başarısız',
            details: error.message 
          });
        } else {
          console.error('Borrow book error:', error);
          res.status(500).json({ 
            error: 'Sunucu hatası',
            details: 'Kitap ödünç alınırken bir hata oluştu'
          });
        }
      }
    }
  }

  async returnBook(req: Request, res: Response) {
    try {
      const userId = parseInt(req.params.userId);
      const bookId = parseInt(req.params.bookId);
      const { score } = req.body;
      
      if (isNaN(userId) || isNaN(bookId)) {
        return res.status(400).json({ 
          error: 'Geçersiz ID formatı',
          details: 'Kullanıcı ID ve Kitap ID sayısal değer olmalıdır'
        });
      }

      if (!score || isNaN(score)) {
        return res.status(400).json({ 
          error: 'Geçersiz puan',
          details: 'Puan sayısal bir değer olmalıdır'
        });
      }

      if (score < 1 || score > 5) {
        return res.status(400).json({ 
          error: 'Geçersiz puan aralığı',
          details: 'Puan 1 ile 5 arasında olmalıdır'
        });
      }

      await userService.returnBook(userId, bookId, score);
      res.status(200).json({ 
        message: 'Kitap başarıyla iade edildi',
        data: {
          userId,
          bookId,
          rating: score,
          status: 'returned'
        }
      });
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'Ödünç alınmış kitap bulunamadı') {
          res.status(404).json({ 
            error: 'Kaynak bulunamadı',
            details: error.message 
          });
        } else {
          console.error('Return book error:', error);
          res.status(500).json({ 
            error: 'Sunucu hatası',
            details: 'Kitap iade edilirken bir hata oluştu'
          });
        }
      }
    }
  }
} 