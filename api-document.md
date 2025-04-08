# Library Management System API Documentation

## Overview
The Library Management System API provides a comprehensive set of endpoints for managing books, users, and book borrowing operations. This RESTful API is built using Node.js, Express, and Sequelize ORM with PostgreSQL.

## Base URL
```
http://localhost:3000
```

## Authentication
Currently, the API uses basic authentication. Future versions will implement JWT-based authentication.

## Response Format
All responses follow a consistent format:

### Success Response
```json
{
  "message": "Operation successful message",
  "data": {
    // Response data
  },
  "timestamp": "2024-02-20T12:00:00.000Z"
}
```

### Error Response
```json
{
  "error": "Error title",
  "details": "Detailed error message",
  "timestamp": "2024-02-20T12:00:00.000Z"
}
```

## HTTP Status Codes
- `200`: Success
- `201`: Created
- `204`: No Content
- `400`: Bad Request
- `404`: Not Found
- `500`: Internal Server Error

## Endpoints

### Users

#### Get All Users
```http
GET /users
```

**Response**
```json
[
  {
    "id": 1,
    "name": "John Doe"
  },
  {
    "id": 2,
    "name": "Jane Smith"
  }
]
```

#### Get User by ID
```http
GET /users/:id
```

**Response**
```json
{
  "id": 1,
  "name": "John Doe",
  "books": {
    "past": [
      {
        "name": "The Great Gatsby",
        "userScore": 5
      }
    ],
    "present": [
      {
        "name": "1984"
      }
    ]
  }
}
```

**Error Response (404)**
```json
{
  "error": "User not found",
  "details": "User with ID: 1 not found",
  "timestamp": "2024-02-20T12:00:00.000Z"
}
```

#### Create User
```http
POST /users
```

**Request Body**
```json
{
  "fullName": "John Doe",
  "email": "john.doe@example.com",
  "passwordHash": "hashedPassword123"
}
```

**Success Response (201)**
```json
{
  "message": "User successfully created",
  "data": {
    "id": 1,
    "fullName": "John Doe",
    "email": "john.doe@example.com",
    "createdAt": "2024-02-20T12:00:00.000Z"
  },
  "timestamp": "2024-02-20T12:00:00.000Z"
}
```

**Error Response (400)**
```json
{
  "error": "Invalid input",
  "details": "All fields (fullName, email, passwordHash) are required",
  "timestamp": "2024-02-20T12:00:00.000Z"
}
```

#### Borrow Book
```http
POST /users/:userId/borrow/:bookId
```

**Success Response (200)**
```json
{
  "message": "Book successfully borrowed",
  "data": {
    "userId": 1,
    "bookId": 1,
    "status": "borrowed",
    "timestamp": "2024-02-20T12:00:00.000Z"
  }
}
```

**Error Response (404)**
```json
{
  "error": "Resource not found",
  "details": "User or book not found",
  "timestamp": "2024-02-20T12:00:00.000Z"
}
```

#### Return Book
```http
POST /users/:userId/return/:bookId
```

**Request Body**
```json
{
  "score": 5
}
```

**Success Response (200)**
```json
{
  "message": "Book successfully returned",
  "data": {
    "userId": 1,
    "bookId": 1,
    "rating": 5,
    "status": "returned",
    "timestamp": "2024-02-20T12:00:00.000Z"
  }
}
```

**Error Response (400)**
```json
{
  "error": "Invalid score",
  "details": "Score must be between 1 and 5",
  "timestamp": "2024-02-20T12:00:00.000Z"
}
```

### Books

#### Get All Books
```http
GET /books
```

**Response**
```json
[
  {
    "id": 1,
    "name": "The Great Gatsby"
  },
  {
    "id": 2,
    "name": "1984"
  }
]
```

#### Get Book by ID
```http
GET /books/:id
```

**Response**
```json
{
  "id": 1,
  "name": "The Great Gatsby",
  "score": "4.50"
}
```

**Error Response (404)**
```json
{
  "error": "Book not found",
  "details": "Book with ID: 1 not found",
  "timestamp": "2024-02-20T12:00:00.000Z"
}
```

#### Create Book
```http
POST /books
```

**Request Body**
```json
{
  "title": "The Great Gatsby",
  "author": "F. Scott Fitzgerald",
  "isbn": "9780743273565",
  "publishedYear": 1925,
  "genre": "Classic",
  "viewCount": 0
}
```

**Success Response (201)**
```json
{
  "message": "Book successfully created",
  "data": {
    "id": 1,
    "title": "The Great Gatsby",
    "author": "F. Scott Fitzgerald",
    "isbn": "9780743273565",
    "publishedYear": 1925,
    "genre": "Classic",
    "viewCount": 0,
    "createdAt": "2024-02-20T12:00:00.000Z"
  },
  "timestamp": "2024-02-20T12:00:00.000Z"
}
```

**Error Response (400)**
```json
{
  "error": "Invalid input",
  "details": "Title is required and must be between 2-255 characters",
  "timestamp": "2024-02-20T12:00:00.000Z"
}
```

## Data Models

### User
```typescript
{
  id: number;
  fullName: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
}
```

### Book
```typescript
{
  id: number;
  title: string;
  author: string;
  isbn: string;
  publishedYear: number;
  genre: string;
  viewCount: number;
  createdAt: Date;
}
```

### BorrowedBook
```typescript
{
  id: number;
  userId: number;
  bookId: number;
  borrowDate: Date;
  returnDate: Date | null;
  isReturned: boolean;
  rating: number | null;
}
```

## Validation Rules

### User Creation
- `fullName`: Required, 2-255 characters
- `email`: Required, valid email format, unique
- `passwordHash`: Required, minimum 6 characters

### Book Creation
- `title`: Required, 2-255 characters
- `author`: Optional, 2-255 characters
- `isbn`: Optional, string
- `publishedYear`: Optional, integer between 1000 and current year
- `genre`: Optional, string

### Book Return
- `score`: Required, integer between 1 and 5