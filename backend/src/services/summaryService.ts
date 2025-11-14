import { KYCSubmission } from '../types';

interface ApiResponse {
  summary: string;
}

export class SummaryService {
  async generateSummary(kycData: KYCSubmission): Promise<string> {
    try {
      // Prepare the KYC data as text
      const kycText = `
        Full Name: ${kycData.fullName}
        Date of Birth: ${kycData.dateOfBirth}
        Address: ${kycData.address}, ${kycData.city}, ${kycData.country} - ${kycData.postalCode}
        ID Type: ${kycData.idType}
        ID Number: ${kycData.idNumber}
        Additional Information: ${kycData.additionalInfo || 'None'}
      `;

      // Option 1: Use external API for summarization
      const apiUrl = process.env.SUMMARIZATION_API_URL;
      
      if (apiUrl) {
        try {
          const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text: kycText }),
          });

          if (response.ok) {
            const data = (await response.json()) as ApiResponse;
            return data.summary || this.fallbackSummary(kycData);
          }
        } catch (apiError) {
          console.error('External API error, using fallback:', apiError);
        }
      }

      // Option 2: Fallback to simple summary generation
      return this.fallbackSummary(kycData);
    } catch (error) {
      console.error('Error generating summary:', error);
      return this.fallbackSummary(kycData);
    }
  }

  private fallbackSummary(kycData: KYCSubmission): string {
    const age = this.calculateAge(new Date(kycData.dateOfBirth));
    const idTypeFormatted = kycData.idType.replace(/_/g, ' ').toUpperCase();
    
    return `KYC verification for ${kycData.fullName}, ${age} years old, residing in ${kycData.city}, ${kycData.country}. Identity verified using ${idTypeFormatted} (${kycData.idNumber}). Address: ${kycData.address}, ${kycData.postalCode}.${kycData.additionalInfo ? ' Additional notes: ' + kycData.additionalInfo.substring(0, 100) : ''}`;
  }

  private calculateAge(birthDate: Date): number {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  }
}

export default new SummaryService();
