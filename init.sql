-- Create database
CREATE DATABASE library_management;

-- Connect to the database
\c library_management;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Books table
CREATE TABLE IF NOT EXISTS books (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255),
    isbn VARCHAR(13),
    published_year INTEGER,
    genre VARCHAR(100),
    view_count INTEGER DEFAULT 0 CHECK (view_count >= 0),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Borrowed books table
CREATE TABLE IF NOT EXISTS borrowed_books (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    book_id INTEGER NOT NULL REFERENCES books(id) ON DELETE CASCADE,
    borrow_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    return_date TIMESTAMP,
    is_returned BOOLEAN DEFAULT FALSE,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5)
);

-- Indexes for performance optimization
CREATE INDEX IF NOT EXISTS idx_borrowed_books_user_id ON borrowed_books(user_id);
CREATE INDEX IF NOT EXISTS idx_borrowed_books_book_id ON borrowed_books(book_id);

-- Unique constraint to prevent multiple active borrows of the same book by the same user
CREATE UNIQUE INDEX unique_active_borrow ON borrowed_books (user_id, book_id) WHERE is_returned = false;