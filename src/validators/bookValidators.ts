import { body } from 'express-validator';

export const createBookValidator = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Kitap adı boş olamaz')
    .isLength({ min: 2, max: 255 })
    .withMessage('Kitap adı 2-255 karakter arasında olmalıdır'),
]; 