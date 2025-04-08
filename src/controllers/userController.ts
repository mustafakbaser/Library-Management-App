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
      console.error('Kullanıcılar getirilirken hata:', error);
      res.status(500).json({ 
        error: 'Kullanıcılar getirilirken bir hata oluştu',
        details: error instanceof Error ? error.message : 'Bilinmeyen hata',
        timestamp: new Date().toISOString()
      });
    }
  }

  async getUserById(req: Request, res: Response) {
    try {
      const userId = parseInt(req.params.id);
      if (isNaN(userId)) {
        return res.status(400).json({ 
          error: 'Geçersiz kullanıcı ID',
          details: 'Kullanıcı ID sayısal bir değer olmalıdır',
          timestamp: new Date().toISOString()
        });
      }

      const user = await userService.getUserById(userId);
      res.json(user);
    } catch (error) {
      console.error('Kullanıcı bilgileri getirilirken hata:', error);
      if (error instanceof Error) {
        if (error.message === 'Kullanıcı bulunamadı') {
          res.status(404).json({ 
            error: 'Kullanıcı bulunamadı',
            details: `ID: ${req.params.id} olan kullanıcı bulunamadı`,
            timestamp: new Date().toISOString()
          });
        } else {
          res.status(500).json({ 
            error: 'Kullanıcı bilgileri getirilirken bir hata oluştu',
            details: error.message,
            timestamp: new Date().toISOString()
          });
        }
      } else {
        res.status(500).json({ 
          error: 'Beklenmeyen bir hata oluştu',
          details: 'Bilinmeyen hata türü',
          timestamp: new Date().toISOString()
        });
      }
    }
  }

  async createUser(req: Request, res: Response) {
    try {
      const { fullName, email, passwordHash } = req.body;
      
      if (!fullName || !email || !passwordHash) {
        return res.status(400).json({
          error: 'Eksik bilgi',
          details: 'Tüm alanlar (fullName, email, passwordHash) zorunludur',
          timestamp: new Date().toISOString()
        });
      }

      const user = await userService.createUser(fullName, email, passwordHash);
      res.status(201).json({
        message: 'Kullanıcı başarıyla oluşturuldu',
        data: user,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Kullanıcı oluşturulurken hata:', error);
      if (error instanceof Error) {
        if (error.message.includes('unique constraint')) {
          res.status(400).json({ 
            error: 'E-posta adresi zaten kullanımda',
            details: 'Bu e-posta adresi ile kayıtlı bir kullanıcı bulunmaktadır',
            timestamp: new Date().toISOString()
          });
        } else {
          res.status(500).json({ 
            error: 'Kullanıcı oluşturulurken bir hata oluştu',
            details: error.message,
            timestamp: new Date().toISOString()
          });
        }
      } else {
        res.status(500).json({ 
          error: 'Beklenmeyen bir hata oluştu',
          details: 'Bilinmeyen hata türü',
          timestamp: new Date().toISOString()
        });
      }
    }
  }

  async borrowBook(req: Request, res: Response) {
    try {
      const userId = parseInt(req.params.userId);
      const bookId = parseInt(req.params.bookId);
      
      if (isNaN(userId) || isNaN(bookId)) {
        return res.status(400).json({ 
          error: 'Geçersiz ID formatı',
          details: 'Kullanıcı ID ve Kitap ID sayısal değer olmalıdır',
          timestamp: new Date().toISOString()
        });
      }

      await userService.borrowBook(userId, bookId);
      res.status(200).json({ 
        message: 'Kitap başarıyla ödünç alındı',
        data: {
          userId,
          bookId,
          status: 'borrowed',
          timestamp: new Date().toISOString()
        }
      });
    } catch (error) {
      console.error('Kitap ödünç alınırken hata:', error);
      if (error instanceof Error) {
        if (error.message === 'Kullanıcı veya kitap bulunamadı') {
          res.status(404).json({ 
            error: 'Kaynak bulunamadı',
            details: error.message,
            timestamp: new Date().toISOString()
          });
        } else if (error.message === 'Bu kitap zaten ödünç alınmış') {
          res.status(400).json({ 
            error: 'İşlem başarısız',
            details: error.message,
            timestamp: new Date().toISOString()
          });
        } else {
          res.status(500).json({ 
            error: 'Sunucu hatası',
            details: error.message,
            timestamp: new Date().toISOString()
          });
        }
      } else {
        res.status(500).json({ 
          error: 'Beklenmeyen bir hata oluştu',
          details: 'Bilinmeyen hata türü',
          timestamp: new Date().toISOString()
        });
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
          details: 'Kullanıcı ID ve Kitap ID sayısal değer olmalıdır',
          timestamp: new Date().toISOString()
        });
      }

      if (!score || isNaN(score)) {
        return res.status(400).json({ 
          error: 'Geçersiz puan',
          details: 'Puan sayısal bir değer olmalıdır',
          timestamp: new Date().toISOString()
        });
      }

      if (score < 1 || score > 5) {
        return res.status(400).json({ 
          error: 'Geçersiz puan aralığı',
          details: 'Puan 1 ile 5 arasında olmalıdır',
          timestamp: new Date().toISOString()
        });
      }

      await userService.returnBook(userId, bookId, score);
      res.status(200).json({ 
        message: 'Kitap başarıyla iade edildi',
        data: {
          userId,
          bookId,
          rating: score,
          status: 'returned',
          timestamp: new Date().toISOString()
        }
      });
    } catch (error) {
      console.error('Kitap iade edilirken hata:', error);
      if (error instanceof Error) {
        if (error.message === 'Ödünç alınmış kitap bulunamadı') {
          res.status(404).json({ 
            error: 'Kaynak bulunamadı',
            details: error.message,
            timestamp: new Date().toISOString()
          });
        } else {
          res.status(500).json({ 
            error: 'Sunucu hatası',
            details: error.message,
            timestamp: new Date().toISOString()
          });
        }
      } else {
        res.status(500).json({ 
          error: 'Beklenmeyen bir hata oluştu',
          details: 'Bilinmeyen hata türü',
          timestamp: new Date().toISOString()
        });
      }
    }
  }
} 