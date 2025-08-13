import React from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';

const steps = [
  { key: 'step1', label: 'Aadhaar + OTP', path: '/step1', icon: '📱' },
  { key: 'step2', label: 'PAN Verification', path: '/step2', icon: '🆔' },
];

export default function Stepper() {
  const { pathname } = useLocation();
  const { id } = useParams();
  
  // Determine current step index
  const currentStepIndex = steps.findIndex(s => pathname.startsWith(s.path));
  
  return (
    <div className="w-full max-w-3xl mx-auto mb-8">
      <div className="py-2 px-3 bg-blue-50 text-blue-700 text-sm rounded-lg mb-4">
        <p className="font-medium">Udyam Registration Portal Demo</p>
        <p className="text-xs">This form mimics the first two steps of the official Udyam registration process</p>
      </div>
      
      <ol className="flex items-center justify-between text-sm relative mb-2">
        {steps.map((step, index) => {
          // A step is active if it's the current step or a previous step
          const isActive = currentStepIndex >= index;
          // A step is clickable if it's the first step or we have an ID for step 2
          const isClickable = index === 0 || (index === 1 && id);
          
          return (
            <li key={step.key} className="flex-1 z-10">
              {isClickable ? (
                <Link
                  to={index === 0 ? step.path : `${step.path}/${id}`}
                  className={`flex flex-col items-center p-3 rounded-lg text-center border ${isActive ? 'bg-blue-600 text-white border-blue-600' : 'bg-white border-gray-200 text-gray-700'} transition-all duration-300`}
                >
                  <span className="text-xl mb-1">{step.icon}</span>
                  <div className="font-medium">{step.label}</div>
                  <div className="text-xs opacity-80">Step {index + 1}</div>
                </Link>
              ) : (
                <div className={`flex flex-col items-center p-3 rounded-lg text-center border ${isActive ? 'bg-blue-600 text-white border-blue-600' : 'bg-gray-100 border-gray-200 text-gray-400'} transition-all duration-300`}>
                  <span className="text-xl mb-1">{step.icon}</span>
                  <div className="font-medium">{step.label}</div>
                  <div className="text-xs opacity-80">Step {index + 1}</div>
                </div>
              )}
              
              {index < steps.length - 1 && (
                <div className="absolute top-8 left-0 w-full h-1 bg-gray-200 -z-10">
                  <div
                    className={`h-full ${isActive ? 'bg-blue-600' : 'bg-gray-200'} transition-all duration-300`}
                    style={{ width: isActive ? '100%' : '0%' }}
                  ></div>
                </div>
              )}
            </li>
          );
        })}
      </ol>
      
      {/* Progress indicator */}
      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
        <div 
          className="bg-blue-600 h-2.5 rounded-full transition-all duration-500" 
          style={{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }}
        ></div>
      </div>
      
      <p className="text-xs text-center text-gray-500">
        {currentStepIndex === 0 ? 'Please complete Aadhaar verification to proceed' : 'Complete PAN verification to finish'}
      </p>
    </div>
  );
}