import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDatabase } from './config/database';
import rabbitmqConnection from './config/rabbitmq';
import queueService from './services/queueService';
import authRoutes from './routes/authRoutes';
import kycRoutes from './routes/kycRoutes';
import adminRoutes from './routes/adminRoutes';
import User from './models/User';
import bcrypt from 'bcryptjs';
import { logger } from './utils/logger';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5000;

// Initialize logger
logger.info('Initializing KYC System', { version: '1.0.0', environment: process.env.NODE_ENV });

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  logger.info(`${req.method} ${req.path}`, {
    method: req.method,
    path: req.path,
    ip: req.ip,
    userAgent: req.get('user-agent'),
  });
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/kyc', kycRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/health', (req: Request, res: Response) => {
  logger.debug('Health check endpoint called');
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Logs endpoint - retrieve recent logs
app.get('/api/logs', (req: Request, res: Response) => {
  try {
    const lines = parseInt(req.query.lines as string) || 100;
    const logs = logger.getRecentLogs(lines);
    res.json({ logs });
  } catch (error) {
    logger.error('Error retrieving logs', { error });
    res.status(500).json({ error: 'Failed to retrieve logs' });
  }
});

// 404 handler
app.use((req: Request, res: Response) => {
  logger.warn(`Route not found: ${req.method} ${req.path}`);
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err: any, req: Request, res: Response, next: any) => {
  logger.error('Unhandled error', {
    error: err.message,
    stack: err.stack,
    method: req.method,
    path: req.path,
  });
  res.status(500).json({ error: 'Internal server error' });
});

// Create default admin user
const createDefaultAdmin = async () => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@kyc.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
    
    const existingAdmin = await User.findOne({ email: adminEmail });
    
    if (!existingAdmin) {
      const admin = new User({
        email: adminEmail,
        password: adminPassword,
        fullName: 'System Administrator',
        phoneNumber: '+1234567890',
        isAdmin: true
      });
      
      await admin.save();
      logger.info('Default admin user created', { email: adminEmail });
      console.log('✅ Default admin user created');
      console.log(`   Email: ${adminEmail}`);
      console.log(`   Password: ${adminPassword}`);
    } else {
      logger.info('Default admin user already exists', { email: adminEmail });
    }
  } catch (error) {
    logger.error('Error creating default admin', { error });
  }
};

// Initialize and start server
const startServer = async () => {
  try {
    // Connect to MongoDB
    logger.info('Connecting to MongoDB...');
    await connectDatabase();
    logger.info('✅ Connected to MongoDB');
    
    // Connect to RabbitMQ
    logger.info('Connecting to RabbitMQ...');
    await rabbitmqConnection.connect();
    logger.info('✅ Connected to RabbitMQ');
    
    // Start queue processing
    logger.info('Starting queue processing...');
    await queueService.startProcessing();
    logger.info('✅ Queue processing started');
    
    // Create default admin
    await createDefaultAdmin();
    
    // Start server
    app.listen(PORT, () => {
      logger.info(`🚀 Server is running on port ${PORT}`, {
        port: PORT,
        api: `http://localhost:${PORT}/api`,
        health: `http://localhost:${PORT}/health`,
      });
      console.log(`\n🚀 Server is running on port ${PORT}`);
      console.log(`   API: http://localhost:${PORT}/api`);
      console.log(`   Health: http://localhost:${PORT}/health\n`);
    });
  } catch (error) {
    logger.error('Failed to start server', { error });
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Handle graceful shutdown
process.on('SIGINT', async () => {
  logger.info('Received SIGINT, shutting down gracefully...');
  console.log('\n⚠️  Shutting down gracefully...');
  await rabbitmqConnection.close();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  logger.info('Received SIGTERM, shutting down gracefully...');
  console.log('\n⚠️  Shutting down gracefully...');
  await rabbitmqConnection.close();
  process.exit(0);
});

startServer();