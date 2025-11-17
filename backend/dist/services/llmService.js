"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.llmService = exports.LLMService = void 0;
const sdk_1 = __importDefault(require("@anthropic-ai/sdk"));
const client = new sdk_1.default({
    apiKey: process.env.ANTHROPIC_API_KEY,
});
class LLMService {
    /**
     * Generate an intelligent summary of KYC submission
     */
    async generateIntelligentSummary(kycData) {
        try {
            const prompt = `You are a professional KYC compliance officer. Generate a concise, professional summary (3-4 sentences) of the following Know Your Customer (KYC) submission:

Full Name: ${kycData.fullName}
Date of Birth: ${kycData.dateOfBirth}
Address: ${kycData.address}, ${kycData.city}, ${kycData.country} - ${kycData.postalCode}
ID Type: ${kycData.idType}
ID Number: ${kycData.idNumber}
Additional Information: ${kycData.additionalInfo || 'None provided'}

The summary should be professional, objective, and highlight key compliance-relevant information.`;
            const response = await client.messages.create({
                model: 'claude-3-5-sonnet-20241022',
                max_tokens: 300,
                messages: [
                    {
                        role: 'user',
                        content: prompt,
                    },
                ],
            });
            const summary = response.content[0].type === 'text' ? response.content[0].text : '';
            return summary.trim();
        }
        catch (error) {
            console.error('Error generating intelligent summary:', error);
            throw new Error('Failed to generate summary using LLM');
        }
    }
    /**
     * Generate a professional rejection reason
     */
    async generateRejectionReason(kycData) {
        try {
            const prompt = `You are a professional KYC compliance officer writing a rejection notice. Generate a professional and courteous rejection reason (2-3 sentences) for the following KYC submission that is being rejected.

Applicant Name: ${kycData.fullName}
ID Type: ${kycData.idType}
ID Number: ${kycData.idNumber}
Rejection Reason: ${kycData.reason || 'Failed compliance checks'}

The rejection reason should be:
- Professional and courteous
- Clear about why the submission was rejected
- Suggest what improvements are needed (if applicable)
- Encourage resubmission with correct information`;
            const response = await client.messages.create({
                model: 'claude-3-5-sonnet-20241022',
                max_tokens: 250,
                messages: [
                    {
                        role: 'user',
                        content: prompt,
                    },
                ],
            });
            const reason = response.content[0].type === 'text' ? response.content[0].text : '';
            return reason.trim();
        }
        catch (error) {
            console.error('Error generating rejection reason:', error);
            throw new Error('Failed to generate rejection reason using LLM');
        }
    }
    /**
     * Translate text to specified language
     */
    async translateText(text, targetLanguage, sourceLanguage = 'English') {
        try {
            const prompt = `Translate the following text from ${sourceLanguage} to ${targetLanguage}. 
      
Provide only the translated text without any explanations or additional text.

Text to translate:
"${text}"`;
            const response = await client.messages.create({
                model: 'claude-3-5-sonnet-20241022',
                max_tokens: 500,
                messages: [
                    {
                        role: 'user',
                        content: prompt,
                    },
                ],
            });
            const translatedText = response.content[0].type === 'text' ? response.content[0].text : '';
            return translatedText.trim();
        }
        catch (error) {
            console.error('Error translating text:', error);
            throw new Error(`Failed to translate text to ${targetLanguage}`);
        }
    }
    /**
     * Translate complete KYC summary to multiple languages
     */
    async translateSummaryToMultipleLanguages(summary, languages) {
        try {
            const translations = {};
            for (const language of languages) {
                const translated = await this.translateText(summary, language, 'English');
                translations[language.toLowerCase()] = translated;
            }
            return translations;
        }
        catch (error) {
            console.error('Error translating summary to multiple languages:', error);
            throw new Error('Failed to translate summary');
        }
    }
    /**
     * Detect language of given text
     */
    async detectLanguage(text) {
        try {
            const prompt = `Detect the language of the following text and respond with only the language name in English.

Text: "${text}"`;
            const response = await client.messages.create({
                model: 'claude-3-5-sonnet-20241022',
                max_tokens: 50,
                messages: [
                    {
                        role: 'user',
                        content: prompt,
                    },
                ],
            });
            const language = response.content[0].type === 'text' ? response.content[0].text : 'Unknown';
            return language.trim();
        }
        catch (error) {
            console.error('Error detecting language:', error);
            throw new Error('Failed to detect language');
        }
    }
    /**
     * Generate risk assessment for KYC submission
     */
    async generateRiskAssessment(kycData) {
        try {
            const prompt = `You are a KYC compliance risk assessor. Analyze the following submission and provide a risk assessment.

Full Name: ${kycData.fullName}
Address: ${kycData.address}, ${kycData.city}, ${kycData.country}
ID Type: ${kycData.idType}
Additional Information: ${kycData.additionalInfo || 'None provided'}

Respond in this exact JSON format:
{
  "riskLevel": "low|medium|high",
  "details": "Brief assessment of compliance risk"
}`;
            const response = await client.messages.create({
                model: 'claude-3-5-sonnet-20241022',
                max_tokens: 300,
                messages: [
                    {
                        role: 'user',
                        content: prompt,
                    },
                ],
            });
            const responseText = response.content[0].type === 'text' ? response.content[0].text : '{}';
            const assessment = JSON.parse(responseText);
            return {
                riskLevel: assessment.riskLevel || 'medium',
                details: assessment.details || 'Unable to assess risk',
            };
        }
        catch (error) {
            console.error('Error generating risk assessment:', error);
            throw new Error('Failed to generate risk assessment');
        }
    }
}
exports.LLMService = LLMService;
exports.llmService = new LLMService();
