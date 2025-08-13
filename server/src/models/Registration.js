import mongoose from 'mongoose';

const StepSchema = new mongoose.Schema({
  aadhaar: { type: String, required: true, match: /^\d{12}$/ },
  name: { type: String, required: true },
  otp: { type: String, match: /^\d{6}$/ },
  declaration: { type: Boolean, required: true },
  verified: { type: Boolean, default: false },
}, { strict: true });

const Step2Schema = new mongoose.Schema({
  pan: { type: String, required: true, match: /^[A-Z]{5}\d{4}[A-Z]{1}$/ },
}, { strict: true });

const RegistrationSchema = new mongoose.Schema({
  step1: { type: StepSchema, required: false },
  step2: { type: Step2Schema, required: false },
}, { timestamps: true });

export default mongoose.model('Registration', RegistrationSchema);