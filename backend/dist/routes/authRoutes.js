"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = __importDefault(require("../controllers/authController"));
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// Public routes
router.post('/register', authController_1.default.register.bind(authController_1.default));
router.post('/login', authController_1.default.login.bind(authController_1.default));
// Protected routes
router.get('/me', auth_1.authenticate, authController_1.default.getCurrentUser.bind(authController_1.default));
exports.default = router;
