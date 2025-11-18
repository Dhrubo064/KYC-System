import api from './api';
import { KYC, KYCFormData } from '../types';

export const kycService = {
  async submitKYC(data: KYCFormData): Promise<{ message: string; status: string }> {
    const response = await api.post('/kyc/submit', data);
    return response.data;
  },

  async getMyKYC(preferredLanguage?: string): Promise<{ kyc: KYC }> {
    const params = preferredLanguage ? { language: preferredLanguage } : {};
    const response = await api.get('/kyc/my-kyc', { params });
    return response.data;
  },

  async getKYCStatus(preferredLanguage?: string): Promise<{
    status: string;
    submittedAt?: string;
    reviewedAt?: string;
    rejectionReason?: string;
  }> {
    const params = preferredLanguage ? { language: preferredLanguage } : {};
    const response = await api.get('/kyc/status', { params });
    return response.data;
  },
};