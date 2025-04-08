# Library Management System

A robust RESTful API for managing library operations, built with Node.js, Express, and PostgreSQL.

## Features

- User management (create, retrieve)
- Book management (create, retrieve)
- Book borrowing and returning system
- Rating system for books
- Comprehensive error handling
- Input validation
- TypeScript support
- PostgreSQL database with Sequelize ORM

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone https://github.com/mustafakbaser/Library-Management-App.git
cd library-management-app
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following content:
```env
# Application
PORT=3000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=library_management
DB_USER=your_username
DB_PASSWORD=your_password
```

4. Create the database and initialize the schema:
```bash
# Create database
createdb library_management

# Initialize database schema
psql -d library_management -f init.sql
```

5. Start the development server:
```bash
npm run dev
```

The API will be available at `http://localhost:3000`

## API Documentation

The API documentation is available in the `api-document.md` file. It includes detailed information about:
- Available endpoints
- Request/response formats
- Authentication
- Error handling
- Data models
- Validation rules

## Project Structure

```
src/
├── config/         # Configuration files
├── controllers/    # Route controllers
├── models/        # Database models
├── routes/        # API routes
├── services/      # Business logic
├── validators/    # Input validation
└── index.ts       # Application entry point
```

## Development

### Available Scripts

- `npm run dev`: Start development server with hot-reload
- `npm run build`: Build the TypeScript project
- `npm start`: Start the production server
- `npm test`: Run tests
- `npm run lint`: Run linter
- `npm run format`: Format code with Prettier

## Security

- Input validation using express-validator
- Password hashing with bcrypt
- Security headers with Helmet
- CORS configuration
- JWT implementation (future/planned)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.