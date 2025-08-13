# Form Automation Project

## Overview

This project is a comprehensive form automation solution built with the MERN stack (MongoDB, Express.js, React, Node.js). It automates the process of filling out and submitting multi-step forms with validation, OTP verification, and data persistence.

## Features

- **Multi-step Form Process**: Guided step-by-step form submission
- **Dynamic Form Generation**: Forms are generated from a JSON schema
- **Validation**: Client and server-side validation for all form fields
- **OTP Verification**: Simulated OTP verification process
- **Responsive Design**: Mobile-friendly interface
- **Data Persistence**: All form data is stored in MongoDB

## Project Structure

```
├── client/            # React frontend
├── server/            # Express.js backend
├── .github/           # GitHub Actions workflows
├── docker-compose.yml # Docker configuration
├── DEPLOYMENT.md      # Deployment instructions
└── README.md          # This file
```

## Technologies Used

### Frontend
- React.js
- React Router
- React Hook Form with Yup validation
- Axios for API requests
- TailwindCSS for styling

### Backend
- Node.js with Express
- MongoDB with Mongoose
- Joi for validation
- JWT for authentication (if implemented)

### DevOps
- Docker & Docker Compose
- GitHub Actions for CI/CD
- Jest for testing

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/form-automation.git
   cd form-automation
   ```

2. Install dependencies and start the development servers

   ```bash
   # For the backend
   cd server
   npm install
   npm run dev

   # For the frontend (in a new terminal)
   cd client
   npm install
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:5173`

### Using Docker

Alternatively, you can use Docker to run the entire application:

```bash
docker-compose up -d
```

This will start the MongoDB database, backend server, and frontend client.

## Testing

### Running Tests

```bash
# Client tests
cd client
npm test

# Server tests
cd server
npm test
```

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- This project was created as a demonstration of form automation capabilities
- Special thanks to all the open-source libraries that made this project possible
