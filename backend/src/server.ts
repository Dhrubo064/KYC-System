import express, { Application, Request, Response } from 'express';
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

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/kyc', kycRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err: any, req: Request, res: Response, next: any) => {
  console.error('Error:', err);
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
      console.log('✅ Default admin user created');
      console.log(`   Email: ${adminEmail}`);
      console.log(`   Password: ${adminPassword}`);
    }
  } catch (error) {
    console.error('Error creating default admin:', error);
  }
};

// Initialize and start server
const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDatabase();
    
    // Connect to RabbitMQ
    await rabbitmqConnection.connect();
    
    // Start queue processing
    await queueService.startProcessing();
    
    // Create default admin
    await createDefaultAdmin();
    
    // Start server
    app.listen(PORT, () => {
      console.log(`\n🚀 Server is running on port ${PORT}`);
      console.log(`   API: http://localhost:${PORT}/api`);
      console.log(`   Health: http://localhost:${PORT}/health\n`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n⚠️  Shutting down gracefully...');
  await rabbitmqConnection.close();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n⚠️  Shutting down gracefully...');
  await rabbitmqConnection.close();
  process.exit(0);
});

startServer();