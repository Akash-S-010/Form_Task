import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
      <div className="md:flex">
        <div className="md:shrink-0 bg-blue-600 md:w-48 flex items-center justify-center p-6">
          <div className="text-white text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <h2 className="text-xl font-bold mt-2">Udyam</h2>
            <p className="text-sm opacity-80">Registration Portal</p>
          </div>
        </div>
        <div className="p-8 md:p-10">
          <div className="uppercase tracking-wide text-sm text-blue-600 font-semibold">MSME Registration Demo</div>
          <h1 className="text-3xl font-bold mt-1 mb-4 text-gray-800">Udyam Registration Portal</h1>
          <p className="text-gray-600 mb-6">
            This application mimics the first two steps of the official Udyam registration process:
          </p>
          
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div className="border rounded-lg p-4 bg-gray-50">
              <div className="flex items-center mb-2">
                <span className="text-xl mr-2">📱</span>
                <h3 className="font-medium">Step 1: Aadhaar Verification</h3>
              </div>
              <p className="text-sm text-gray-600">Enter your Aadhaar number and verify with OTP</p>
            </div>
            
            <div className="border rounded-lg p-4 bg-gray-50">
              <div className="flex items-center mb-2">
                <span className="text-xl mr-2">🆔</span>
                <h3 className="font-medium">Step 2: PAN Verification</h3>
              </div>
              <p className="text-sm text-gray-600">Validate your PAN card details</p>
            </div>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg mb-6">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> This is a demo application. No real data is sent to the actual Udyam portal.
              For official registration, please visit the <a href="https://udyamregistration.gov.in" target="_blank" rel="noopener noreferrer" className="underline">official website</a>.
            </p>
          </div>
          
          <Link
            to="/step1"
            className="inline-flex items-center px-6 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-200"
          >
            <span>Start Registration</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}