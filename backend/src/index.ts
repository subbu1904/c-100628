
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { userRoutes } from './routes/userRoutes';
import { assetRoutes } from './routes/assetRoutes';
import { categoryRoutes } from './routes/categoryRoutes';
import { superCategoryRoutes } from './routes/superCategoryRoutes';
import { messageRoutes } from './routes/messageRoutes';
import { predictionRoutes } from './routes/predictionRoutes';
import { announcementRoutes } from './routes/announcementRoutes';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/assets', assetRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/super-categories', superCategoryRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/predictions', predictionRoutes);
app.use('/api/announcements', announcementRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  process.exit(0);
});
