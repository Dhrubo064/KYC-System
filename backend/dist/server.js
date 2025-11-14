"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const database_1 = require("./config/database");
const rabbitmq_1 = __importDefault(require("./config/rabbitmq"));
const queueService_1 = __importDefault(require("./services/queueService"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const kycRoutes_1 = __importDefault(require("./routes/kycRoutes"));
const adminRoutes_1 = __importDefault(require("./routes/adminRoutes"));
const User_1 = __importDefault(require("./models/User"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Routes
app.use('/api/auth', authRoutes_1.default);
app.use('/api/kyc', kycRoutes_1.default);
app.use('/api/admin', adminRoutes_1.default);
// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});
// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});
// Error handler
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ error: 'Internal server error' });
});
// Create default admin user
const createDefaultAdmin = async () => {
    try {
        const adminEmail = process.env.ADMIN_EMAIL || 'admin@kyc.com';
        const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
        const existingAdmin = await User_1.default.findOne({ email: adminEmail });
        if (!existingAdmin) {
            const admin = new User_1.default({
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
    }
    catch (error) {
        console.error('Error creating default admin:', error);
    }
};
// Initialize and start server
const startServer = async () => {
    try {
        // Connect to MongoDB
        await (0, database_1.connectDatabase)();
        // Connect to RabbitMQ
        await rabbitmq_1.default.connect();
        // Start queue processing
        await queueService_1.default.startProcessing();
        // Create default admin
        await createDefaultAdmin();
        // Start server
        app.listen(PORT, () => {
            console.log(`\n🚀 Server is running on port ${PORT}`);
            console.log(`   API: http://localhost:${PORT}/api`);
            console.log(`   Health: http://localhost:${PORT}/health\n`);
        });
    }
    catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};
// Handle graceful shutdown
process.on('SIGINT', async () => {
    console.log('\n⚠️  Shutting down gracefully...');
    await rabbitmq_1.default.close();
    process.exit(0);
});
process.on('SIGTERM', async () => {
    console.log('\n⚠️  Shutting down gracefully...');
    await rabbitmq_1.default.close();
    process.exit(0);
});
startServer();
