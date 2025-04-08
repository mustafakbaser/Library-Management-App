import { body } from 'express-validator';

export const createBookValidator = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Kitap adı boş olamaz')
    .isLength({ min: 2, max: 255 })
    .withMessage('Kitap adı 2-255 karakter arasında olmalıdır'),
  body('author')
    .optional()
    .trim()
    .isLength({ min: 2, max: 255 })
    .withMessage('Yazar adı 2-255 karakter arasında olmalıdır'),
  body('isbn')
    .optional()
    .trim(),
  body('publishedYear')
    .optional()
    .isInt({ min: 1000, max: new Date().getFullYear() })
    .withMessage('Geçerli bir yayın yılı giriniz'),
  body('genre')
    .optional()
    .trim(),
]; 