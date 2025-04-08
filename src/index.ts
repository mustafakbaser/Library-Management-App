import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes';
import bookRoutes from './routes/bookRoutes';
import { testConnection } from './config/database';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Routes
app.use('/users', userRoutes);
app.use('/books', bookRoutes);

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Bir şeyler ters gitti!' });
});

// Start server
const startServer = async () => {
  try {
    await testConnection();
    app.listen(port, () => {
      console.log(`Server ${port} portunda çalışıyor`);
    });
  } catch (error) {
    console.error('Server başlatılamadı:', error);
    process.exit(1);
  }
};

startServer(); 