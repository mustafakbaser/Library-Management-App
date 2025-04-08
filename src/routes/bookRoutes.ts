import { Router } from 'express';
import { BookController } from '../controllers/bookController';
import { createBookValidator } from '../validators/bookValidators';

const router = Router();
const bookController = new BookController();

// Get all books
router.get('/', bookController.getAllBooks);

// Get book by id
router.get('/:id', bookController.getBookById);

// Create book
router.post('/', createBookValidator, bookController.createBook);

export default router; 