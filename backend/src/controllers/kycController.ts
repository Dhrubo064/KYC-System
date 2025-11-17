import { Response } from 'express';
import KYC from '../models/KYC';
import queueService from '../services/queueService';
import { multiLanguageService } from '../services/multiLanguageService';
import { AuthRequest } from '../types';

export class KYCController {
  async submitKYC(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId;
      
      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }
      
      // Check if user already has a pending or approved KYC
      const existingKYC = await KYC.findOne({
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
      const preferredLanguage = req.body.preferredLanguage || 'English';
      
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
      
      // Store preferred language
      kycData.preferredLanguage = preferredLanguage;
      
      // Add to queue for processing
      const queued = await queueService.addToQueue(userId, kycData);
      
      if (!queued) {
        res.status(500).json({ error: 'Failed to queue KYC submission' });
        return;
      }
      
      res.status(202).json({ 
        message: 'KYC submission queued for processing',
        status: 'pending'
      });
    } catch (error: any) {
      console.error('KYC submission error:', error);
      res.status(500).json({ error: 'Failed to submit KYC' });
    }
  }
  
  async getMyKYC(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId;
      const preferredLanguage = req.query.language as string || 'English';
      
      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }
      
      const kyc = await KYC.findOne({ userId }).sort({ createdAt: -1 });
      
      if (!kyc) {
        res.status(404).json({ error: 'No KYC submission found' });
        return;
      }

      // Translate summary and rejection reason if requested
      if (preferredLanguage && preferredLanguage !== 'English') {
        try {
          const translated = await multiLanguageService.translateKYCResponse(
            kyc.summary,
            kyc.rejectionReason || null,
            preferredLanguage
          );
          
          // Return KYC with translated content
          const kycResponse = kyc.toObject();
          kycResponse.summary = translated.summary;
          if (translated.rejectionReason) {
            kycResponse.rejectionReason = translated.rejectionReason;
          }
          
          res.json({ kyc: kycResponse });
        } catch (translateError) {
          console.error('Translation failed, returning original:', translateError);
          res.json({ kyc });
        }
      } else {
        res.json({ kyc });
      }
    } catch (error: any) {
      console.error('Get KYC error:', error);
      res.status(500).json({ error: 'Failed to fetch KYC' });
    }
  }
  
  async getKYCStatus(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId;
      const preferredLanguage = req.query.language as string || 'English';
      
      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }
      
      const kyc = await KYC.findOne({ userId }).sort({ createdAt: -1 });
      
      if (!kyc) {
        res.json({ status: 'not_submitted' });
        return;
      }

      // Translate rejection reason if requested
      let rejectionReason = kyc.rejectionReason;
      if (preferredLanguage && preferredLanguage !== 'English' && kyc.rejectionReason) {
        try {
          rejectionReason = await multiLanguageService.translateText(
            kyc.rejectionReason,
            preferredLanguage
          );
        } catch (translateError) {
          console.error('Translation failed, returning original:', translateError);
        }
      }
      
      res.json({ 
        status: kyc.status,
        submittedAt: kyc.createdAt,
        reviewedAt: kyc.reviewedAt,
        rejectionReason: rejectionReason
      });
    } catch (error: any) {
      console.error('Get KYC status error:', error);
      res.status(500).json({ error: 'Failed to fetch KYC status' });
    }
  }
}

export default new KYCController();