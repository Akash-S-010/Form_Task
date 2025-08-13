import express from 'express';
import { submitStep, validateAadhaar, validateOTP } from '../controllers/formController.js';

const router = express.Router();

// Aadhaar validation -> creates/updates a registration draft and returns id
router.post('/validate-aadhaar', validateAadhaar);

// OTP validation -> verifies OTP for the registration id
router.post('/validate-otp', validateOTP);

// Final step submissions
router.post('/step1', (req, res) => submitStep(req, res, 'step1'));
router.post('/step2', (req, res) => submitStep(req, res, 'step2'));

export default router;
