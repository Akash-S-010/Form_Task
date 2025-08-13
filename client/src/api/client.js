// src/api/client.js
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

// Schema fetching
export const fetchSchema = (step) => api.get(`/api/schema/${step}`).then(r => r.data);

// Step 1: Aadhaar validation
export const validateAadhaar = (payload) => api.post('/api/validate-aadhaar', payload).then(r => r.data);
export const validateOTP = (payload) => api.post('/api/validate-otp', payload).then(r => r.data);
export const postStep1 = (payload) => api.post('/api/step1', payload).then(r => r.data);

// Step 2: PAN validation
export const postStep2 = (payload) => api.post('/api/step2', payload).then(r => r.data);

// Utility APIs
export const fetchPINInfo = (pincode) =>
  axios.get(`https://api.postalpincode.in/pincode/${pincode}`).then(r => r.data);