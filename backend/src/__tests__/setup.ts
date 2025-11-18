// Setup file for Jest tests
import 'dotenv/config';

// Mock environment variables for testing
process.env.NODE_ENV = 'test';
process.env.LOG_DIR = 'logs/test';
process.env.MONGODB_URI = 'mongodb://localhost:27017/kyc-test';
process.env.JWT_SECRET = 'test-secret-key';
process.env.ADMIN_EMAIL = 'admin@kyc.com';
process.env.ADMIN_PASSWORD = 'admin123';
