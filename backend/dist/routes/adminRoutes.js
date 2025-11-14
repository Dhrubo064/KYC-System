"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const adminController_1 = __importDefault(require("../controllers/adminController"));
const auth_1 = require("../middleware/auth");
const adminAuth_1 = require("../middleware/adminAuth");
const router = express_1.default.Router();
// All routes require authentication and admin privileges
router.use(auth_1.authenticate);
router.use(adminAuth_1.requireAdmin);
router.get('/kyc/pending', adminController_1.default.getAllPendingKYC.bind(adminController_1.default));
router.get('/kyc/approved', adminController_1.default.getAllApprovedKYC.bind(adminController_1.default));
router.get('/kyc/rejected', adminController_1.default.getAllRejectedKYC.bind(adminController_1.default));
router.get('/kyc/stats', adminController_1.default.getKYCStats.bind(adminController_1.default));
router.put('/kyc/:kycId/approve', adminController_1.default.approveKYC.bind(adminController_1.default));
router.put('/kyc/:kycId/reject', adminController_1.default.rejectKYC.bind(adminController_1.default));
router.get('/kyc/:kycId/download', adminController_1.default.downloadKYCPDF.bind(adminController_1.default));
exports.default = router;
