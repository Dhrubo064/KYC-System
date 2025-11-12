export interface User {
  id: string;
  email: string;
  fullName: string;
  phoneNumber: string;
  isAdmin: boolean;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

export interface KYCFormData {
  fullName: string;
  dateOfBirth: string;
  address: string;
  city: string;
  country: string;
  postalCode: string;
  idType: string;
  idNumber: string;
  additionalInfo: string;
}

export interface KYC {
  _id: string;
  userId: string | {
    _id: string;
    email: string;
    fullName: string;
    phoneNumber: string;
  };
  fullName: string;
  dateOfBirth: string;
  address: string;
  city: string;
  country: string;
  postalCode: string;
  idType: string;
  idNumber: string;
  additionalInfo: string;
  summary: string;
  status: 'pending' | 'approved' | 'rejected';
  reviewedBy?: string;
  reviewedAt?: string;
  rejectionReason?: string;
  createdAt: string;
}

export interface KYCStats {
  pending: number;
  approved: number;
  rejected: number;
  total: number;
}