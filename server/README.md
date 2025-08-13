# Form Automation - Backend

## Overview

This is the backend server for the Form Automation project. It's built with Node.js, Express, and MongoDB to provide API endpoints for form validation, OTP verification, and data storage.

## Features

- **RESTful API**: Clean API design following REST principles
- **Dynamic Schema Validation**: Server-side validation using Joi based on JSON schema
- **MongoDB Integration**: Data persistence with Mongoose ODM
- **OTP Verification Flow**: Simulated OTP verification process
- **Error Handling**: Comprehensive error handling and validation

## Tech Stack

- **Node.js**: JavaScript runtime
- **Express.js**: Web framework
- **MongoDB**: NoSQL database
- **Mongoose**: MongoDB object modeling
- **Joi**: Data validation
- **Jest**: Testing framework
- **Supertest**: HTTP testing

## Project Structure

```
├── src/
│   ├── controllers/    # Request handlers
│   ├── models/         # Mongoose models
│   ├── routes/         # API routes
│   ├── utils/          # Utility functions
│   └── __tests__/      # Test files
├── .env.example        # Example environment variables
├── .gitignore          # Git ignore file
├── Dockerfile          # Docker configuration
├── jest.config.js      # Jest configuration
├── package.json        # Dependencies and scripts
├── scraped-schema.json # Form schema definition
├── scraper.js          # Schema scraper utility
└── server.js           # Application entry point
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository and navigate to the server directory
   ```bash
   git clone https://github.com/yourusername/form-automation.git
   cd form-automation/server
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Set up environment variables
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. Start the development server
   ```bash
   npm run dev
   ```

5. The server will be running at `http://localhost:5000`

### Environment Variables

The following environment variables are required:

```
MONGO_URI=mongodb://localhost:27017/form_automation
PORT=5000
FRONTEND_URL=http://localhost:5173
```

## API Endpoints

### Schema Endpoints

- `GET /api/schema/:step` - Get form schema for a specific step

### Form Endpoints

- `POST /api/validate-aadhaar` - Validate Aadhaar number and create registration
- `POST /api/validate-otp` - Validate OTP for a registration
- `POST /api/step1` - Submit step 1 form data
- `POST /api/step2` - Submit step 2 form data

## Available Scripts

- `npm start` - Start the production server
- `npm run dev` - Start the development server with hot reload
- `npm test` - Run tests
- `npm run test:watch` - Run tests in watch mode

## Testing

The backend uses Jest and Supertest for testing API endpoints and utilities. Tests are located in the `src/__tests__` directory.

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch
```

## Docker

A Dockerfile is provided to containerize the backend application. To build and run the container:

```bash
# Build the image
docker build -t form-automation-server .

# Run the container
docker run -p 5000:5000 -e MONGO_URI=mongodb://host.docker.internal:27017/form_automation form-automation-server
```

## Deployment

The backend can be deployed to services like Heroku, Railway, or any other Node.js hosting platform. See the main project's [DEPLOYMENT.md](../DEPLOYMENT.md) for detailed instructions.

## Contributing

Please read the main project's README.md for contribution guidelines.