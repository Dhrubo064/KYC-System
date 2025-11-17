"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SummaryService = void 0;
const llmService_1 = require("./llmService");
class SummaryService {
    async generateSummary(kycData) {
        try {
            // Option 1: Use LLM-powered intelligent summarization (Claude)
            if (process.env.ANTHROPIC_API_KEY && process.env.USE_LLM_SUMMARY === 'true') {
                try {
                    const summary = await llmService_1.llmService.generateIntelligentSummary({
                        fullName: kycData.fullName,
                        dateOfBirth: new Date(kycData.dateOfBirth).toLocaleDateString(),
                        address: kycData.address,
                        city: kycData.city,
                        country: kycData.country,
                        postalCode: kycData.postalCode,
                        idType: kycData.idType,
                        idNumber: kycData.idNumber,
                        additionalInfo: kycData.additionalInfo,
                    });
                    console.log('Generated intelligent summary using LLM');
                    return summary;
                }
                catch (llmError) {
                    console.error('LLM summarization failed, falling back to external API:', llmError);
                }
            }
            // Option 2: Use external API for summarization
            const apiUrl = process.env.SUMMARIZATION_API_URL;
            if (apiUrl) {
                try {
                    const kycText = `
        Full Name: ${kycData.fullName}
        Date of Birth: ${kycData.dateOfBirth}
        Address: ${kycData.address}, ${kycData.city}, ${kycData.country} - ${kycData.postalCode}
        ID Type: ${kycData.idType}
        ID Number: ${kycData.idNumber}
        Additional Information: ${kycData.additionalInfo || 'None'}
      `;
                    const response = await fetch(apiUrl, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ text: kycText }),
                    });
                    if (response.ok) {
                        const data = (await response.json());
                        return data.summary || this.fallbackSummary(kycData);
                    }
                }
                catch (apiError) {
                    console.error('External API error, using fallback:', apiError);
                }
            }
            // Option 3: Fallback to simple summary generation
            return this.fallbackSummary(kycData);
        }
        catch (error) {
            console.error('Error generating summary:', error);
            return this.fallbackSummary(kycData);
        }
    }
    fallbackSummary(kycData) {
        const age = this.calculateAge(new Date(kycData.dateOfBirth));
        const idTypeFormatted = kycData.idType.replace(/_/g, ' ').toUpperCase();
        return `KYC verification for ${kycData.fullName}, ${age} years old, residing in ${kycData.city}, ${kycData.country}. Identity verified using ${idTypeFormatted} (${kycData.idNumber}). Address: ${kycData.address}, ${kycData.postalCode}.${kycData.additionalInfo ? ' Additional notes: ' + kycData.additionalInfo.substring(0, 100) : ''}`;
    }
    calculateAge(birthDate) {
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    }
}
exports.SummaryService = SummaryService;
exports.default = new SummaryService();
