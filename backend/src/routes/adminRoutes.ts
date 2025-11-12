import express from 'express';
import adminController from '../controllers/adminController';
import { authenticate } from '../middleware/auth';
import { requireAdmin } from '../middleware/adminAuth';

const router = express.Router();

// All routes require authentication and admin privileges
router.use(authenticate);
router.use(requireAdmin);

router.get('/kyc/pending', adminController.getAllPendingKYC.bind(adminController));
router.get('/kyc/approved', adminController.getAllApprovedKYC.bind(adminController));
router.get('/kyc/rejected', adminController.getAllRejectedKYC.bind(adminController));
router.get('/kyc/stats', adminController.getKYCStats.bind(adminController));
router.put('/kyc/:kycId/approve', adminController.approveKYC.bind(adminController));
router.put('/kyc/:kycId/reject', adminController.rejectKYC.bind(adminController));
router.get('/kyc/:kycId/download', adminController.downloadKYCPDF.bind(adminController));

export default router;