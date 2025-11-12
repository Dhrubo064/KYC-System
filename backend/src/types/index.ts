import { Request } from 'express';

export interface IUser {
  _id?: string;
  email: string;
  password: string;
  fullName: string;
  phoneNumber: string;
  isAdmin: boolean;
  createdAt?: Date;
}

export interface IKYC {
  _id?: string;
  userId: string;
  fullName: string;
  dateOfBirth: Date;
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
  reviewedAt?: Date;
  rejectionReason?: string;
  createdAt?: Date;
}

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    email: string;
    isAdmin: boolean;
  };
}

export interface KYCSubmission {
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

export interface QueueMessage {
  userId: string;
  kycData: KYCSubmission;
}