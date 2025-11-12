import express from 'express';
import kycController from '../controllers/kycController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

router.post('/submit', kycController.submitKYC.bind(kycController));
router.get('/my-kyc', kycController.getMyKYC.bind(kycController));
router.get('/status', kycController.getKYCStatus.bind(kycController));

export default router;