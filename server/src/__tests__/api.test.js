import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../server.js';
import Registration from '../models/Registration.js';

// Mock the Registration model
jest.mock('../models/Registration.js', () => {
  const mockRegistration = {
    _id: 'test-id',
    step1: {
      aadhaar: '123456789012',
      name: 'Test User',
      declaration: true,
      verified: false
    },
    save: jest.fn().mockResolvedValue(true),
  };

  return {
    __esModule: true,
    default: jest.fn().mockImplementation(() => mockRegistration),
    findById: jest.fn().mockResolvedValue(mockRegistration),
    findOne: jest.fn(),
    findByIdAndUpdate: jest.fn().mockImplementation(() => ({
      ...mockRegistration,
      step2: { pan: 'ABCDE1234F' }
    }))
  };
});

describe('API Endpoints Tests', () => {
  beforeAll(async () => {
    // Connect to test database if needed
    // await mongoose.connect(process.env.MONGO_URI_TEST);
  });

  afterAll(async () => {
    // Disconnect from test database if needed
    // await mongoose.connection.close();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/validate-aadhaar', () => {
    test('returns 400 for invalid Aadhaar number', async () => {
      const response = await request(app)
        .post('/api/validate-aadhaar')
        .send({ aadhaar: '12345', name: 'Test User', consent: true });

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('Invalid Aadhaar number');
    });

    test('returns 400 when consent is not provided', async () => {
      const response = await request(app)
        .post('/api/validate-aadhaar')
        .send({ aadhaar: '123456789012', name: 'Test User', consent: false });

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('consent');
    });

    test('returns 200 with registration ID for valid data', async () => {
      Registration.findOne.mockResolvedValueOnce(null); // No existing registration

      const response = await request(app)
        .post('/api/validate-aadhaar')
        .send({ aadhaar: '123456789012', name: 'Test User', consent: true });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id');
      expect(response.body.message).toContain('OTP sent');
    });
  });

  describe('POST /api/validate-otp', () => {
    test('returns 400 for invalid OTP', async () => {
      const response = await request(app)
        .post('/api/validate-otp')
        .send({ id: 'test-id', otp: '12345' }); // OTP should be 6 digits

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('Invalid OTP');
    });

    test('returns 404 when registration is not found', async () => {
      Registration.findById.mockResolvedValueOnce(null);

      const response = await request(app)
        .post('/api/validate-otp')
        .send({ id: 'non-existent-id', otp: '123456' });

      expect(response.status).toBe(404);
      expect(response.body.message).toContain('not found');
    });

    test('returns 200 for valid OTP', async () => {
      const mockReg = {
        _id: 'test-id',
        step1: {
          aadhaar: '123456789012',
          name: 'Test User',
          declaration: true,
          verified: false
        },
        save: jest.fn().mockResolvedValue(true),
      };
      Registration.findById.mockResolvedValueOnce(mockReg);

      const response = await request(app)
        .post('/api/validate-otp')
        .send({ id: 'test-id', otp: '123456' });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id');
      expect(mockReg.step1.verified).toBe(true);
    });
  });

  describe('POST /api/step1', () => {
    test('returns 400 for invalid data', async () => {
      // Mock the buildJoiSchema validation to fail
      jest.mock('../utils/schemaValidator.js', () => ({
        buildJoiSchema: jest.fn().mockReturnValue({
          validate: jest.fn().mockReturnValue({ error: { details: [{ message: 'Invalid data' }] } })
        })
      }));

      const response = await request(app)
        .post('/api/step1')
        .send({ /* invalid data */ });

      expect(response.status).toBe(400);
    });

    test('returns 201 for valid step1 data', async () => {
      const response = await request(app)
        .post('/api/step1')
        .send({
          aadhaar: '123456789012',
          name: 'Test User',
          declaration: true
        });

      expect(response.status).toBe(201);
      expect(response.body.message).toContain('Step step1 saved successfully');
    });
  });

  describe('POST /api/step2', () => {
    test('returns 400 when registration ID is missing', async () => {
      const response = await request(app)
        .post('/api/step2')
        .send({ pan: 'ABCDE1234F' }); // Missing id

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('Missing registration ID');
    });

    test('returns 404 when registration is not found', async () => {
      Registration.findByIdAndUpdate.mockResolvedValueOnce(null);

      const response = await request(app)
        .post('/api/step2')
        .send({ id: 'non-existent-id', pan: 'ABCDE1234F' });

      expect(response.status).toBe(404);
      expect(response.body.message).toContain('not found');
    });

    test('returns 201 for valid step2 data', async () => {
      const response = await request(app)
        .post('/api/step2')
        .send({ id: 'test-id', pan: 'ABCDE1234F' });

      expect(response.status).toBe(201);
      expect(response.body.message).toContain('Step step2 saved successfully');
    });
  });
});