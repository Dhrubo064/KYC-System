"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rejectionReasonService = exports.RejectionReasonService = void 0;
const llmService_1 = require("./llmService");
class RejectionReasonService {
    /**
     * Generate a professional rejection reason using LLM
     */
    async generateRejectionReason(input) {
        try {
            // If LLM is disabled or API key not set, use fallback
            if (process.env.ANTHROPIC_API_KEY && process.env.USE_LLM_REJECTION === 'true') {
                try {
                    const reason = await llmService_1.llmService.generateRejectionReason({
                        fullName: input.fullName,
                        idType: input.idType,
                        idNumber: input.idNumber,
                        reason: input.customReason || input.reason,
                    });
                    console.log('Generated rejection reason using LLM');
                    return reason;
                }
                catch (llmError) {
                    console.error('LLM rejection reason generation failed, using fallback:', llmError);
                }
            }
            // Fallback to template-based rejection reasons
            return this.getFallbackRejectionReason(input);
        }
        catch (error) {
            console.error('Error in rejection reason service:', error);
            return this.getFallbackRejectionReason(input);
        }
    }
    /**
     * Get predefined professional rejection templates
     */
    getFallbackRejectionReason(input) {
        const templates = {
            invalid_document: `Dear ${input.fullName}, Your KYC application has been rejected due to invalid or unverifiable identification document. Please resubmit with a valid ${input.idType} that is clearly legible and within the validity period. If you have questions, please contact our support team.`,
            incomplete_information: `Dear ${input.fullName}, Your KYC submission is incomplete. Required information is missing or unclear. Please review your submission and resubmit with all mandatory fields completed accurately.`,
            document_mismatch: `Dear ${input.fullName}, There is a mismatch between the information provided and your identification document. Please ensure all details match your ${input.idType} exactly and resubmit.`,
            address_verification_failed: `Dear ${input.fullName}, We were unable to verify your address. Please provide a valid proof of residence along with your KYC documents and resubmit.`,
            duplicate_submission: `Dear ${input.fullName}, A KYC submission with your identification number already exists in our system. If you believe this is an error, please contact our support team.`,
            compliance_check_failed: `Dear ${input.fullName}, Your submission did not pass our compliance and verification checks. We recommend reviewing the requirements and resubmitting with accurate information.`,
            other: `Dear ${input.fullName}, Your KYC application has been rejected. Reason: ${input.customReason || 'Failed verification'}. Please correct the issues and resubmit your application.`,
        };
        const reason = input.reason || 'other';
        return templates[reason] || templates['other'];
    }
    /**
     * Get available rejection reason categories
     */
    getAvailableReasons() {
        return [
            'invalid_document',
            'incomplete_information',
            'document_mismatch',
            'address_verification_failed',
            'duplicate_submission',
            'compliance_check_failed',
            'other',
        ];
    }
}
exports.RejectionReasonService = RejectionReasonService;
exports.rejectionReasonService = new RejectionReasonService();
