import { buildJoiSchema } from '../utils/schemaValidator.js';
import Registration from '../models/Registration.js';

export const validateAadhaar = async (req, res) => {
  try {
    const { aadhaar, name, consent } = req.body;

    // Validate Aadhaar format
    if (!aadhaar || !/^\d{12}$/.test(aadhaar)) {
      return res.status(400).json({ message: 'Invalid Aadhaar number. Must be exactly 12 digits.' });
    }

    // Validate name
    if (!name || name.trim() === '') {
      return res.status(400).json({ message: 'Name is required.' });
    }

    // Validate consent
    if (!consent) {
      return res.status(400).json({ message: 'You must provide consent to proceed.' });
    }

    // Check if Aadhaar already exists
    const existingRegistration = await Registration.findOne({ 'step1.aadhaar': aadhaar });
    if (existingRegistration) {
      // In a real app, we might want to handle this differently
      // For demo, we'll just return the existing registration
      return res.status(200).json({
        message: 'Aadhaar validated successfully. OTP sent.',
        id: existingRegistration._id
      });
    }

    // Create a new registration draft
    const registration = new Registration({
      step1: {
        aadhaar,
        name,
        declaration: consent
      }
    });

    await registration.save();

    // In a real app, this would trigger an OTP to the user's phone
    // For demo purposes, we'll just return success
    console.log(`OTP would be sent to mobile linked with Aadhaar ${aadhaar}`);

    res.status(200).json({
      message: 'Aadhaar validated successfully. OTP sent.',
      id: registration._id
    });
  } catch (err) {
    console.error('Aadhaar validation error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const validateOTP = async (req, res) => {
  try {
    const { id, otp } = req.body;

    if (!id) {
      return res.status(400).json({ message: 'Registration ID is required.' });
    }

    if (!otp || !/^\d{6}$/.test(otp)) {
      return res.status(400).json({ message: 'Invalid OTP. Must be 6 digits.' });
    }

    // Find the registration
    const registration = await Registration.findById(id);
    if (!registration) {
      return res.status(404).json({ message: 'Registration not found.' });
    }

    // In a real app, we would validate the OTP against what was sent
    // For demo purposes, we'll accept 123456 as the valid OTP
    if (otp !== '123456') {
      return res.status(400).json({ message: 'Invalid OTP. For demo, use 123456.' });
    }
    
    // Update the registration with the OTP
    registration.step1.otp = otp;
    registration.step1.verified = true; // Mark as verified
    await registration.save();

    res.status(200).json({
      message: 'OTP validated successfully.',
      id: registration._id
    });
  } catch (err) {
    console.error('OTP validation error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const submitStep = async (req, res, step) => {
  try {
    const schema = buildJoiSchema(step);
    let formData = req.body;
    let id = null;

    if (step === 'step2') {
      id = req.body.id;
      if (!id) return res.status(400).json({ message: 'Missing registration ID for step 2' });
      const { id: _, ...fieldsWithoutId } = req.body;
      formData = fieldsWithoutId;
    }

    // Trim string fields
    Object.keys(formData).forEach(key => {
      if (typeof formData[key] === 'string') formData[key] = formData[key].trim();
    });

    const { error } = schema.validate(formData);
    if (error) return res.status(400).json({ message: error.details[0].message });

    let registration;
    if (step === 'step1') {
      registration = new Registration({ step1: formData });
      await registration.save();
    } else if (step === 'step2') {
      registration = await Registration.findByIdAndUpdate(
        id,
        { step2: formData },
        { new: true }
      );
      if (!registration) return res.status(404).json({ message: 'Registration not found' });
    }

    res.status(201).json({
      message: `Step ${step} saved successfully`,
      registration,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};