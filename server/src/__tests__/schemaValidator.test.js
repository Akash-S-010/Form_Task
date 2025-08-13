import { buildJoiSchema } from '../utils/schemaValidator.js';
import fs from 'fs';
import path from 'path';

// Mock the fs and path modules
jest.mock('fs', () => ({
  readFileSync: jest.fn().mockReturnValue(JSON.stringify({
    step1: [
      { id: 'aadhaar', name: 'aadhaar', label: 'Aadhaar', required: true, pattern: '\\d{12}' },
      { id: 'name', name: 'name', label: 'Name', required: true },
      { id: 'consent', name: 'consent', typeAttr: 'checkbox', label: 'I consent' },
      { id: 'hidden', name: 'hidden', typeAttr: 'hidden' },
      { id: 'submit', name: 'submit', type: 'button' }
    ],
    step2: [
      { id: 'pan', name: 'pan', label: 'PAN', required: true, pattern: '[A-Z]{5}\\d{4}[A-Z]{1}' }
    ]
  }))
}));

jest.mock('path', () => ({
  resolve: jest.fn().mockReturnValue('mocked-path')
}));

describe('Schema Validator Tests', () => {
  test('buildJoiSchema creates correct schema for step1', () => {
    const schema = buildJoiSchema('step1');
    
    // Validate with valid data
    const validData = {
      aadhaar: '123456789012',
      name: 'Test User',
      consent: true
    };
    const { error: validError } = schema.validate(validData);
    expect(validError).toBeUndefined();
    
    // Validate with invalid Aadhaar
    const invalidAadhaar = {
      aadhaar: '12345', // Too short
      name: 'Test User',
      consent: true
    };
    const { error: aadhaarError } = schema.validate(invalidAadhaar);
    expect(aadhaarError).toBeDefined();
    expect(aadhaarError.message).toContain('Aadhaar');
    
    // Validate with missing required field
    const missingName = {
      aadhaar: '123456789012',
      consent: true
    };
    const { error: nameError } = schema.validate(missingName);
    expect(nameError).toBeDefined();
    expect(nameError.message).toContain('name');
    
    // Validate with invalid consent
    const invalidConsent = {
      aadhaar: '123456789012',
      name: 'Test User',
      consent: false
    };
    const { error: consentError } = schema.validate(invalidConsent);
    expect(consentError).toBeDefined();
    expect(consentError.message).toContain('consent');
  });

  test('buildJoiSchema creates correct schema for step2', () => {
    const schema = buildJoiSchema('step2');
    
    // Validate with valid PAN
    const validData = {
      pan: 'ABCDE1234F'
    };
    const { error: validError } = schema.validate(validData);
    expect(validError).toBeUndefined();
    
    // Validate with invalid PAN
    const invalidPan = {
      pan: 'ABCD1234F' // Missing one letter at the beginning
    };
    const { error: panError } = schema.validate(invalidPan);
    expect(panError).toBeDefined();
    expect(panError.message).toContain('PAN');
  });

  test('buildJoiSchema ignores hidden fields and buttons', () => {
    const schema = buildJoiSchema('step1');
    
    // The schema should not have validators for hidden or button fields
    const schemaKeys = Object.keys(schema.describe().keys);
    expect(schemaKeys).not.toContain('hidden');
    expect(schemaKeys).not.toContain('submit');
  });
});