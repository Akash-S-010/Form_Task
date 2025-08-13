# Form Automation - Frontend

## Overview

This is the frontend application for the Form Automation project. It's built with React and provides a user-friendly interface for filling out multi-step forms with validation and OTP verification.

## Features

- **Dynamic Form Rendering**: Forms are generated from a JSON schema fetched from the backend
- **Multi-step Form Process**: Guided step-by-step form submission
- **Client-side Validation**: Real-time validation using React Hook Form and Yup
- **OTP Verification Flow**: Simulated OTP verification process
- **Responsive Design**: Mobile-friendly interface

## Tech Stack

- **React**: UI library
- **React Router**: For navigation between form steps
- **React Hook Form**: Form state management and validation
- **Yup**: Schema-based form validation
- **Axios**: API client for backend communication
- **TailwindCSS**: Utility-first CSS framework
- **Vite**: Build tool and development server
- **Jest & React Testing Library**: Testing framework

## Project Structure

```
├── public/            # Static assets
├── src/
│   ├── api/           # API client and endpoints
│   ├── assets/        # Images, fonts, etc.
│   ├── components/    # Reusable UI components
│   ├── pages/         # Page components (Step1, Step2, etc.)
│   ├── __tests__/     # Test files
│   ├── App.jsx        # Main application component
│   ├── index.css      # Global styles
│   └── main.jsx       # Application entry point
├── .gitignore         # Git ignore file
├── babel.config.js    # Babel configuration

├── eslint.config.js   # ESLint configuration
├── jest.config.js     # Jest configuration
├── package.json       # Dependencies and scripts
└── vite.config.js     # Vite configuration
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository and navigate to the client directory
   ```bash
   git clone https://github.com/yourusername/form-automation.git
   cd form-automation/client
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Start the development server
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

### Environment Variables

Create a `.env` file in the root of the client directory with the following variables:

```
VITE_API_URL=http://localhost:5000
```

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm run lint` - Run ESLint to check for code quality issues
- `npm run preview` - Preview the production build locally
- `npm test` - Run tests
- `npm run test:watch` - Run tests in watch mode

## Testing

The frontend uses Jest and React Testing Library for testing. Tests are located in the `src/__tests__` directory.

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch
```

## Building for Production

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.



## Deployment

The frontend can be deployed to services like Vercel or Netlify. See the main project's [DEPLOYMENT.md](../DEPLOYMENT.md) for detailed instructions.

## Contributing

Please read the main project's README.md for contribution guidelines.
