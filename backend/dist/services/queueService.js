"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueueService = void 0;
const rabbitmq_1 = __importDefault(require("../config/rabbitmq"));
const KYC_1 = __importDefault(require("../models/KYC"));
const summaryService_1 = __importDefault(require("./summaryService"));
class QueueService {
    async startProcessing() {
        await rabbitmq_1.default.consumeQueue(async (message) => {
            try {
                console.log('Processing KYC submission for user:', message.userId);
                // Generate summary
                const summary = await summaryService_1.default.generateSummary(message.kycData);
                // Save to database
                const kyc = new KYC_1.default({
                    userId: message.userId,
                    ...message.kycData,
                    dateOfBirth: new Date(message.kycData.dateOfBirth),
                    summary,
                    status: 'pending'
                });
                await kyc.save();
                console.log('KYC submission processed successfully:', kyc._id);
            }
            catch (error) {
                console.error('Error processing KYC submission:', error);
                throw error;
            }
        });
    }
    async addToQueue(userId, kycData) {
        const message = {
            userId,
            kycData
        };
        return await rabbitmq_1.default.sendToQueue(message);
    }
}
exports.QueueService = QueueService;
exports.default = new QueueService();
