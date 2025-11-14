"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const kycController_1 = __importDefault(require("../controllers/kycController"));
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// All routes require authentication
router.use(auth_1.authenticate);
router.post('/submit', kycController_1.default.submitKYC.bind(kycController_1.default));
router.get('/my-kyc', kycController_1.default.getMyKYC.bind(kycController_1.default));
router.get('/status', kycController_1.default.getKYCStatus.bind(kycController_1.default));
exports.default = router;
