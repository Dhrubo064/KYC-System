"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminController = void 0;
const KYC_1 = __importDefault(require("../models/KYC"));
const pdfService_1 = __importDefault(require("../services/pdfService"));
const rejectionReasonService_1 = require("../services/rejectionReasonService");
const multiLanguageService_1 = require("../services/multiLanguageService");
class AdminController {
    async getAllPendingKYC(req, res) {
        try {
            const kycs = await KYC_1.default.find({ status: 'pending' })
                .populate('userId', 'email fullName phoneNumber')
                .sort({ createdAt: -1 });
            res.json({ kycs });
        }
        catch (error) {
            console.error('Get pending KYC error:', error);
            res.status(500).json({ error: 'Failed to fetch pending KYCs' });
        }
    }
    async getAllApprovedKYC(req, res) {
        try {
            const kycs = await KYC_1.default.find({ status: 'approved' })
                .populate('userId', 'email fullName phoneNumber')
                .sort({ reviewedAt: -1 });
            res.json({ kycs });
        }
        catch (error) {
            console.error('Get approved KYC error:', error);
            res.status(500).json({ error: 'Failed to fetch approved KYCs' });
        }
    }
    async getAllRejectedKYC(req, res) {
        try {
            const kycs = await KYC_1.default.find({ status: 'rejected' })
                .populate('userId', 'email fullName phoneNumber')
                .sort({ reviewedAt: -1 });
            res.json({ kycs });
        }
        catch (error) {
            console.error('Get rejected KYC error:', error);
            res.status(500).json({ error: 'Failed to fetch rejected KYCs' });
        }
    }
    async approveKYC(req, res) {
        try {
            const { kycId } = req.params;
            const adminId = req.user?.userId;
            const kyc = await KYC_1.default.findById(kycId);
            if (!kyc) {
                res.status(404).json({ error: 'KYC not found' });
                return;
            }
            if (kyc.status !== 'pending') {
                res.status(400).json({ error: 'KYC is not pending' });
                return;
            }
            kyc.status = 'approved';
            kyc.reviewedBy = adminId;
            kyc.reviewedAt = new Date();
            await kyc.save();
            res.json({
                message: 'KYC approved successfully',
                kyc
            });
        }
        catch (error) {
            console.error('Approve KYC error:', error);
            res.status(500).json({ error: 'Failed to approve KYC' });
        }
    }
    async rejectKYC(req, res) {
        try {
            const { kycId } = req.params;
            const { reason, reasonType } = req.body;
            const adminId = req.user?.userId;
            if (!reason && !reasonType) {
                res.status(400).json({ error: 'Rejection reason is required' });
                return;
            }
            const kyc = await KYC_1.default.findById(kycId);
            if (!kyc) {
                res.status(404).json({ error: 'KYC not found' });
                return;
            }
            if (kyc.status !== 'pending') {
                res.status(400).json({ error: 'KYC is not pending' });
                return;
            }
            // Generate professional rejection reason using LLM
            let rejectionReason = reason;
            try {
                rejectionReason = await rejectionReasonService_1.rejectionReasonService.generateRejectionReason({
                    fullName: kyc.fullName,
                    idType: kyc.idType,
                    idNumber: kyc.idNumber,
                    reason: reasonType || 'other',
                    customReason: reason,
                });
            }
            catch (llmError) {
                console.error('LLM rejection reason generation failed, using provided reason:', llmError);
                rejectionReason = reason;
            }
            // Generate multi-language rejection reasons if enabled
            let rejectionReasonMultiLang = {};
            if (process.env.USE_LLM_TRANSLATION === 'true' && kyc.preferredLanguage && kyc.preferredLanguage !== 'English') {
                try {
                    const translatedReason = await multiLanguageService_1.multiLanguageService.translateText(rejectionReason, kyc.preferredLanguage);
                    rejectionReasonMultiLang[kyc.preferredLanguage.toLowerCase()] = translatedReason;
                }
                catch (translateError) {
                    console.error('Translation of rejection reason failed:', translateError);
                }
            }
            kyc.status = 'rejected';
            kyc.reviewedBy = adminId;
            kyc.reviewedAt = new Date();
            kyc.rejectionReason = rejectionReason;
            if (Object.keys(rejectionReasonMultiLang).length > 0) {
                kyc.rejectionReasonMultiLang = rejectionReasonMultiLang;
            }
            await kyc.save();
            res.json({
                message: 'KYC rejected successfully',
                kyc
            });
        }
        catch (error) {
            console.error('Reject KYC error:', error);
            res.status(500).json({ error: 'Failed to reject KYC' });
        }
    }
    async downloadKYCPDF(req, res) {
        try {
            const { kycId } = req.params;
            const kyc = await KYC_1.default.findById(kycId);
            if (!kyc) {
                res.status(404).json({ error: 'KYC not found' });
                return;
            }
            if (kyc.status !== 'approved') {
                res.status(400).json({ error: 'Only approved KYCs can be downloaded' });
                return;
            }
            const doc = pdfService_1.default.generateKYCPDF(kyc);
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename=KYC_${kyc.fullName.replace(/\s+/g, '_')}_${kycId}.pdf`);
            doc.pipe(res);
            doc.end();
        }
        catch (error) {
            console.error('Download PDF error:', error);
            res.status(500).json({ error: 'Failed to generate PDF' });
        }
    }
    async getKYCStats(req, res) {
        try {
            const [pending, approved, rejected] = await Promise.all([
                KYC_1.default.countDocuments({ status: 'pending' }),
                KYC_1.default.countDocuments({ status: 'approved' }),
                KYC_1.default.countDocuments({ status: 'rejected' })
            ]);
            res.json({
                stats: {
                    pending,
                    approved,
                    rejected,
                    total: pending + approved + rejected
                }
            });
        }
        catch (error) {
            console.error('Get stats error:', error);
            res.status(500).json({ error: 'Failed to fetch stats' });
        }
    }
}
exports.AdminController = AdminController;
exports.default = new AdminController();
