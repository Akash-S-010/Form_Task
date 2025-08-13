import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Step1 from '../pages/Step1';
import * as api from '../api/client';

// Mock the API calls
jest.mock('../api/client', () => ({
  fetchSchema: jest.fn().mockResolvedValue([]),
  validateAadhaar: jest.fn(),
  validateOTP: jest.fn(),
  postStep1: jest.fn(),
  fetchPINInfo: jest.fn()
}));

const renderWithRouter = (ui) => {
  return render(ui, { wrapper: BrowserRouter });
};

describe('Form Validation Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('shows error for invalid Aadhaar number', async () => {
    renderWithRouter(<Step1 />);
    
    // Find the Aadhaar input field
    const aadhaarInput = screen.getByLabelText(/Aadhaar/i) || 
                         screen.getByPlaceholderText(/Aadhaar/i) ||
                         screen.getByRole('textbox', { name: /aadhaar/i });
    
    // Type an invalid Aadhaar (less than 12 digits)
    fireEvent.change(aadhaarInput, { target: { value: '12345' } });
    fireEvent.blur(aadhaarInput);
    
    // Check for validation error message
    await waitFor(() => {
      expect(screen.getByText(/Aadhaar must be exactly 12 digits/i)).toBeInTheDocument();
    });
  });

  test('shows error when consent checkbox is not checked', async () => {
    renderWithRouter(<Step1 />);
    
    // Find the consent checkbox
    const consentCheckbox = screen.getByRole('checkbox') || 
                           screen.getByLabelText(/consent/i, { exact: false });
    
    // Ensure it's unchecked
    if (consentCheckbox.checked) {
      fireEvent.click(consentCheckbox);
    }
    
    // Find and click the submit button
    const submitButton = screen.getByRole('button', { name: /validate/i });
    fireEvent.click(submitButton);
    
    // Check for validation error message
    await waitFor(() => {
      expect(screen.getByText(/consent required/i)).toBeInTheDocument();
    });
  });

  test('calls validateAadhaar API with correct data when form is valid', async () => {
    // Mock the API to resolve successfully
    api.validateAadhaar.mockResolvedValueOnce({ id: 'test-id' });
    
    renderWithRouter(<Step1 />);
    
    // Find and fill the Aadhaar input
    const aadhaarInput = screen.getByLabelText(/Aadhaar/i) || 
                         screen.getByPlaceholderText(/Aadhaar/i) ||
                         screen.getByRole('textbox', { name: /aadhaar/i });
    fireEvent.change(aadhaarInput, { target: { value: '123456789012' } });
    
    // Find and fill the name input
    const nameInput = screen.getByLabelText(/name/i) || 
                     screen.getByPlaceholderText(/name/i) ||
                     screen.getByRole('textbox', { name: /name/i });
    fireEvent.change(nameInput, { target: { value: 'Test User' } });
    
    // Find and check the consent checkbox
    const consentCheckbox = screen.getByRole('checkbox') || 
                           screen.getByLabelText(/consent/i, { exact: false });
    fireEvent.click(consentCheckbox);
    
    // Find and click the submit button
    const submitButton = screen.getByRole('button', { name: /validate/i });
    fireEvent.click(submitButton);
    
    // Verify the API was called with correct data
    await waitFor(() => {
      expect(api.validateAadhaar).toHaveBeenCalledWith(expect.objectContaining({
        aadhaar: '123456789012',
        name: 'Test User',
        consent: true
      }));
    });
  });

  test('shows OTP input after successful Aadhaar validation', async () => {
    // Mock the API to resolve successfully
    api.validateAadhaar.mockResolvedValueOnce({ id: 'test-id' });
    
    renderWithRouter(<Step1 />);
    
    // Fill and submit the form
    const aadhaarInput = screen.getByLabelText(/Aadhaar/i) || 
                         screen.getByPlaceholderText(/Aadhaar/i) ||
                         screen.getByRole('textbox', { name: /aadhaar/i });
    const nameInput = screen.getByLabelText(/name/i) || 
                     screen.getByPlaceholderText(/name/i) ||
                     screen.getByRole('textbox', { name: /name/i });
    const consentCheckbox = screen.getByRole('checkbox') || 
                           screen.getByLabelText(/consent/i, { exact: false });
    
    fireEvent.change(aadhaarInput, { target: { value: '123456789012' } });
    fireEvent.change(nameInput, { target: { value: 'Test User' } });
    fireEvent.click(consentCheckbox);
    
    const submitButton = screen.getByRole('button', { name: /validate/i });
    fireEvent.click(submitButton);
    
    // Check that OTP input appears
    await waitFor(() => {
      expect(screen.getByPlaceholderText(/Enter 6-digit OTP/i) || 
             screen.getByLabelText(/OTP/i) ||
             screen.getByRole('textbox', { name: /otp/i })).toBeInTheDocument();
    });
  });
});