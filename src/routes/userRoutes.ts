import { Router } from 'express';
import { UserController } from '../controllers/userController';
import { createUserValidator, borrowBookValidator, returnBookValidator } from '../validators/userValidators';

const router = Router();
const userController = new UserController();

// Get all users
router.get('/', userController.getAllUsers);

// Get user by id
router.get('/:id', userController.getUserById);

// Create user
router.post('/', createUserValidator, userController.createUser);

// Borrow book
router.post('/:userId/borrow/:bookId', borrowBookValidator, userController.borrowBook);

// Return book
router.post('/:userId/return/:bookId', returnBookValidator, userController.returnBook);

export default router; 