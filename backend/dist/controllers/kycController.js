"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.KYCController = void 0;
const KYC_1 = __importDefault(require("../models/KYC"));
const queueService_1 = __importDefault(require("../services/queueService"));
class KYCController {
    async submitKYC(req, res) {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                res.status(401).json({ error: 'Unauthorized' });
                return;
            }
            // Check if user already has a pending or approved KYC
            const existingKYC = await KYC_1.default.findOne({
                userId,
                status: { $in: ['pending', 'approved'] }
            });
            if (existingKYC) {
                res.status(400).json({
                    error: 'You already have a pending or approved KYC submission'
                });
                return;
            }
            const kycData = req.body;
            // Validate required fields
            const requiredFields = [
                'fullName', 'dateOfBirth', 'address', 'city',
                'country', 'postalCode', 'idType', 'idNumber'
            ];
            for (const field of requiredFields) {
                if (!kycData[field]) {
                    res.status(400).json({ error: `${field} is required` });
                    return;
                }
            }
            // Add to queue for processing
            const queued = await queueService_1.default.addToQueue(userId, kycData);
            if (!queued) {
                res.status(500).json({ error: 'Failed to queue KYC submission' });
                return;
            }
            res.status(202).json({
                message: 'KYC submission queued for processing',
                status: 'pending'
            });
        }
        catch (error) {
            console.error('KYC submission error:', error);
            res.status(500).json({ error: 'Failed to submit KYC' });
        }
    }
    async getMyKYC(req, res) {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                res.status(401).json({ error: 'Unauthorized' });
                return;
            }
            const kyc = await KYC_1.default.findOne({ userId }).sort({ createdAt: -1 });
            if (!kyc) {
                res.status(404).json({ error: 'No KYC submission found' });
                return;
            }
            res.json({ kyc });
        }
        catch (error) {
            console.error('Get KYC error:', error);
            res.status(500).json({ error: 'Failed to fetch KYC' });
        }
    }
    async getKYCStatus(req, res) {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                res.status(401).json({ error: 'Unauthorized' });
                return;
            }
            const kyc = await KYC_1.default.findOne({ userId }).sort({ createdAt: -1 });
            if (!kyc) {
                res.json({ status: 'not_submitted' });
                return;
            }
            res.json({
                status: kyc.status,
                submittedAt: kyc.createdAt,
                reviewedAt: kyc.reviewedAt,
                rejectionReason: kyc.rejectionReason
            });
        }
        catch (error) {
            console.error('Get KYC status error:', error);
            res.status(500).json({ error: 'Failed to fetch KYC status' });
        }
    }
}
exports.KYCController = KYCController;
exports.default = new KYCController();
