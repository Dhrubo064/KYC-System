"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PDFService = void 0;
const pdfkit_1 = __importDefault(require("pdfkit"));
class PDFService {
    generateKYCPDF(kyc) {
        const doc = new pdfkit_1.default({ margin: 50 });
        // Header
        doc
            .fontSize(20)
            .font('Helvetica-Bold')
            .text('KYC Verification Report', { align: 'center' })
            .moveDown();
        // Status Badge
        doc
            .fontSize(12)
            .font('Helvetica-Bold')
            .fillColor(kyc.status === 'approved' ? 'green' : 'red')
            .text(`Status: ${kyc.status.toUpperCase()}`, { align: 'center' })
            .fillColor('black')
            .moveDown(2);
        // Personal Information Section
        doc
            .fontSize(14)
            .font('Helvetica-Bold')
            .text('Personal Information')
            .moveDown(0.5);
        doc
            .fontSize(11)
            .font('Helvetica');
        this.addField(doc, 'Full Name', kyc.fullName);
        this.addField(doc, 'Date of Birth', new Date(kyc.dateOfBirth).toLocaleDateString());
        this.addField(doc, 'Address', kyc.address);
        this.addField(doc, 'City', kyc.city);
        this.addField(doc, 'Country', kyc.country);
        this.addField(doc, 'Postal Code', kyc.postalCode);
        doc.moveDown();
        // ID Information Section
        doc
            .fontSize(14)
            .font('Helvetica-Bold')
            .text('Identification Details')
            .moveDown(0.5);
        doc
            .fontSize(11)
            .font('Helvetica');
        this.addField(doc, 'ID Type', kyc.idType.replace(/_/g, ' ').toUpperCase());
        this.addField(doc, 'ID Number', kyc.idNumber);
        if (kyc.additionalInfo) {
            doc.moveDown();
            this.addField(doc, 'Additional Information', kyc.additionalInfo);
        }
        doc.moveDown();
        // Summary Section
        doc
            .fontSize(14)
            .font('Helvetica-Bold')
            .text('Summary')
            .moveDown(0.5);
        doc
            .fontSize(11)
            .font('Helvetica')
            .text(kyc.summary, { align: 'justify' })
            .moveDown();
        // Review Information
        if (kyc.reviewedAt) {
            doc.moveDown();
            doc
                .fontSize(14)
                .font('Helvetica-Bold')
                .text('Review Information')
                .moveDown(0.5);
            doc
                .fontSize(11)
                .font('Helvetica');
            this.addField(doc, 'Reviewed At', new Date(kyc.reviewedAt).toLocaleString());
            if (kyc.rejectionReason) {
                this.addField(doc, 'Rejection Reason', kyc.rejectionReason);
            }
        }
        // Footer
        doc
            .moveDown(3)
            .fontSize(9)
            .font('Helvetica')
            .text(`Generated on ${new Date().toLocaleString()}`, 50, doc.page.height - 50, { align: 'center' });
        return doc;
    }
    addField(doc, label, value) {
        doc
            .font('Helvetica-Bold')
            .text(`${label}: `, { continued: true })
            .font('Helvetica')
            .text(value)
            .moveDown(0.3);
    }
}
exports.PDFService = PDFService;
exports.default = new PDFService();
