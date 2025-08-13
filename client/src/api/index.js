import axios from 'axios';

const API_BASE_URL = process.env.VITE_API_BASE_URL;

export const fetchSchema = async (step) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/schema/${step}`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch schema');
  }
};

export const postStep1 = async (data) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/step1`, data);
    return response.data;
  } catch (error) {
    throw error.response || new Error('Failed to submit Step 1');
  }
};

export const postStep2 = async (data) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/step2`, data);
    return response.data;
  } catch (error) {
    throw error.response || new Error('Failed to submit Step 2');
  }
};