import rabbitmqConnection from '../config/rabbitmq';
import KYC from '../models/KYC';
import summaryService from './summaryService';
import { QueueMessage } from '../types';

export class QueueService {
  async startProcessing(): Promise<void> {
    await rabbitmqConnection.consumeQueue(async (message: QueueMessage) => {
      try {
        console.log('Processing KYC submission for user:', message.userId);
        
        // Generate summary
        const summary = await summaryService.generateSummary(message.kycData);
        
        // Save to database
        const kyc = new KYC({
          userId: message.userId,
          ...message.kycData,
          dateOfBirth: new Date(message.kycData.dateOfBirth),
          summary,
          status: 'pending'
        });
        
        await kyc.save();
        
        console.log('KYC submission processed successfully:', kyc._id);
      } catch (error) {
        console.error('Error processing KYC submission:', error);
        throw error;
      }
    });
  }

  async addToQueue(userId: string, kycData: any): Promise<boolean> {
    const message: QueueMessage = {
      userId,
      kycData
    };
    
    return await rabbitmqConnection.sendToQueue(message);
  }
}

export default new QueueService();