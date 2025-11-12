import api from './api';
import { KYC, KYCStats } from '../types';

export const adminService = {
  async getPendingKYCs(): Promise<{ kycs: KYC[] }> {
    const response = await api.get('/admin/kyc/pending');
    return response.data;
  },

  async getApprovedKYCs(): Promise<{ kycs: KYC[] }> {
    const response = await api.get('/admin/kyc/approved');
    return response.data;
  },

  async getRejectedKYCs(): Promise<{ kycs: KYC[] }> {
    const response = await api.get('/admin/kyc/rejected');
    return response.data;
  },

  async getKYCStats(): Promise<{ stats: KYCStats }> {
    const response = await api.get('/admin/kyc/stats');
    return response.data;
  },

  async approveKYC(kycId: string): Promise<{ message: string; kyc: KYC }> {
    const response = await api.put(`/admin/kyc/${kycId}/approve`);
    return response.data;
  },

  async rejectKYC(kycId: string, reason: string): Promise<{ message: string; kyc: KYC }> {
    const response = await api.put(`/admin/kyc/${kycId}/reject`, { reason });
    return response.data;
  },

  async downloadKYCPDF(kycId: string, fileName: string): Promise<void> {
    const response = await api.get(`/admin/kyc/${kycId}/download`, {
      responseType: 'blob',
    });
    
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },
};