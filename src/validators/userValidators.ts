import { body } from 'express-validator';

export const createUserValidator = [
  body('fullName')
    .trim()
    .notEmpty()
    .withMessage('İsim alanı boş olamaz')
    .isLength({ min: 2, max: 255 })
    .withMessage('İsim 2-255 karakter arasında olmalıdır'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('E-posta alanı boş olamaz')
    .isEmail()
    .withMessage('Geçerli bir e-posta adresi giriniz'),
  body('passwordHash')
    .trim()
    .notEmpty()
    .withMessage('Şifre alanı boş olamaz')
    .isLength({ min: 6 })
    .withMessage('Şifre en az 6 karakter olmalıdır'),
];

export const borrowBookValidator = [
  body('userId')
    .isInt()
    .withMessage('Geçerli bir kullanıcı ID\'si giriniz'),
  body('bookId')
    .isInt()
    .withMessage('Geçerli bir kitap ID\'si giriniz'),
];

export const returnBookValidator = [
  body('score')
    .isInt({ min: 1, max: 5 })
    .withMessage('Puan 1-5 arasında olmalıdır'),
]; 