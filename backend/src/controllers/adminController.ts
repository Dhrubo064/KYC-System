import { Response } from 'express';
import KYC from '../models/KYC';
import pdfService from '../services/pdfService';
import { AuthRequest } from '../types';

export class AdminController {
  async getAllPendingKYC(req: AuthRequest, res: Response): Promise<void> {
    try {
      const kycs = await KYC.find({ status: 'pending' })
        .populate('userId', 'email fullName phoneNumber')
        .sort({ createdAt: -1 });
      
      res.json({ kycs });
    } catch (error: any) {
      console.error('Get pending KYC error:', error);
      res.status(500).json({ error: 'Failed to fetch pending KYCs' });
    }
  }
  
  async getAllApprovedKYC(req: AuthRequest, res: Response): Promise<void> {
    try {
      const kycs = await KYC.find({ status: 'approved' })
        .populate('userId', 'email fullName phoneNumber')
        .sort({ reviewedAt: -1 });
      
      res.json({ kycs });
    } catch (error: any) {
      console.error('Get approved KYC error:', error);
      res.status(500).json({ error: 'Failed to fetch approved KYCs' });
    }
  }
  
  async getAllRejectedKYC(req: AuthRequest, res: Response): Promise<void> {
    try {
      const kycs = await KYC.find({ status: 'rejected' })
        .populate('userId', 'email fullName phoneNumber')
        .sort({ reviewedAt: -1 });
      
      res.json({ kycs });
    } catch (error: any) {
      console.error('Get rejected KYC error:', error);
      res.status(500).json({ error: 'Failed to fetch rejected KYCs' });
    }
  }
  
  async approveKYC(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { kycId } = req.params;
      const adminId = req.user?.userId;
      
      const kyc = await KYC.findById(kycId);
      
      if (!kyc) {
        res.status(404).json({ error: 'KYC not found' });
        return;
      }
      
      if (kyc.status !== 'pending') {
        res.status(400).json({ error: 'KYC is not pending' });
        return;
      }
      
      kyc.status = 'approved';
      kyc.reviewedBy = adminId as any;
      kyc.reviewedAt = new Date();
      
      await kyc.save();
      
      res.json({ 
        message: 'KYC approved successfully',
        kyc 
      });
    } catch (error: any) {
      console.error('Approve KYC error:', error);
      res.status(500).json({ error: 'Failed to approve KYC' });
    }
  }
  
  async rejectKYC(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { kycId } = req.params;
      const { reason } = req.body;
      const adminId = req.user?.userId;
      
      if (!reason) {
        res.status(400).json({ error: 'Rejection reason is required' });
        return;
      }
      
      const kyc = await KYC.findById(kycId);
      
      if (!kyc) {
        res.status(404).json({ error: 'KYC not found' });
        return;
      }
      
      if (kyc.status !== 'pending') {
        res.status(400).json({ error: 'KYC is not pending' });
        return;
      }
      
      kyc.status = 'rejected';
      kyc.reviewedBy = adminId as any;
      kyc.reviewedAt = new Date();
      kyc.rejectionReason = reason;
      
      await kyc.save();
      
      res.json({ 
        message: 'KYC rejected successfully',
        kyc 
      });
    } catch (error: any) {
      console.error('Reject KYC error:', error);
      res.status(500).json({ error: 'Failed to reject KYC' });
    }
  }
  
  async downloadKYCPDF(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { kycId } = req.params;
      
      const kyc = await KYC.findById(kycId);
      
      if (!kyc) {
        res.status(404).json({ error: 'KYC not found' });
        return;
      }
      
      if (kyc.status !== 'approved') {
        res.status(400).json({ error: 'Only approved KYCs can be downloaded' });
        return;
      }
      
      const doc = pdfService.generateKYCPDF(kyc);
      
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader(
        'Content-Disposition', 
        `attachment; filename=KYC_${kyc.fullName.replace(/\s+/g, '_')}_${kycId}.pdf`
      );
      
      doc.pipe(res);
      doc.end();
    } catch (error: any) {
      console.error('Download PDF error:', error);
      res.status(500).json({ error: 'Failed to generate PDF' });
    }
  }
  
  async getKYCStats(req: AuthRequest, res: Response): Promise<void> {
    try {
      const [pending, approved, rejected] = await Promise.all([
        KYC.countDocuments({ status: 'pending' }),
        KYC.countDocuments({ status: 'approved' }),
        KYC.countDocuments({ status: 'rejected' })
      ]);
      
      res.json({
        stats: {
          pending,
          approved,
          rejected,
          total: pending + approved + rejected
        }
      });
    } catch (error: any) {
      console.error('Get stats error:', error);
      res.status(500).json({ error: 'Failed to fetch stats' });
    }
  }
}

export default new AdminController();