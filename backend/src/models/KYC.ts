import mongoose, { Schema, Document } from 'mongoose';

export interface IKYCDocument extends Document {
  userId: mongoose.Types.ObjectId;
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
  multiLanguageSummary?: Record<string, string>;
  preferredLanguage?: string;
  status: 'pending' | 'approved' | 'rejected';
  reviewedBy?: mongoose.Types.ObjectId;
  reviewedAt?: Date;
  rejectionReason?: string;
  rejectionReasonMultiLang?: Record<string, string>;
  riskAssessment?: {
    level: 'low' | 'medium' | 'high';
    details: string;
    timestamp: Date;
  };
  createdAt: Date;
}

const KYCSchema = new Schema<IKYCDocument>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  dateOfBirth: {
    type: Date,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: true
  },
  postalCode: {
    type: String,
    required: true
  },
  idType: {
    type: String,
    required: true,
    enum: ['passport', 'driving_license', 'national_id', 'other']
  },
  idNumber: {
    type: String,
    required: true
  },
  additionalInfo: {
    type: String,
    default: ''
  },
  summary: {
    type: String,
    required: true
  },
  multiLanguageSummary: {
    type: Schema.Types.Mixed,
    default: {}
  },
  preferredLanguage: {
    type: String,
    default: 'English'
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  reviewedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  reviewedAt: {
    type: Date
  },
  rejectionReason: {
    type: String
  },
  rejectionReasonMultiLang: {
    type: Schema.Types.Mixed,
    default: {}
  },
  riskAssessment: {
    level: {
      type: String,
      enum: ['low', 'medium', 'high']
    },
    details: String,
    timestamp: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for faster queries
KYCSchema.index({ userId: 1 });
KYCSchema.index({ status: 1 });

export default mongoose.model<IKYCDocument>('KYC', KYCSchema);