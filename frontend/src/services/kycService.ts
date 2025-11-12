import api from './api';
import { KYC, KYCFormData } from '../types';

export const kycService = {
  async submitKYC(data: KYCFormData): Promise<{ message: string; status: string }> {
    const response = await api.post('/kyc/submit', data);
    return response.data;
  },

  async getMyKYC(): Promise<{ kyc: KYC }> {
    const response = await api.get('/kyc/my-kyc');
    return response.data;
  },

  async getKYCStatus(): Promise<{
    status: string;
    submittedAt?: string;
    reviewedAt?: string;
    rejectionReason?: string;
  }> {
    const response = await api.get('/kyc/status');
    return response.data;
  },
};