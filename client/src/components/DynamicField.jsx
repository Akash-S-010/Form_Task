import React, { useState, useEffect } from 'react';
import { fetchPINInfo } from '../api/client';

export default function DynamicField({ field, value, onChange, onPinCodeData, register, errors }) {
  const [validationState, setValidationState] = useState({
    error: '',
    isValidating: false,
    isValid: false
  });
  const [pinCodeData, setPinCodeData] = useState(null);

  // Skip rendering buttons, hidden fields, and submit buttons
  if (field.type === 'button' || field.typeAttr === 'hidden' || field.typeAttr === 'submit') {
    return null;
  }

  const name = field.name || field.id;
  const label = field.label?.trim() || field.placeholder || name;

  const validate = (val) => {
    if (field.required && !val) return 'This field is required';
    if (field.pattern) {
      const regex = new RegExp(field.pattern);
      if (!regex.test(val)) {
        if (name.includes('adhar') || name.includes('aadhaar')) return 'Aadhaar must be 12 digits';
        if (name.includes('otp')) return 'OTP must be 6 digits';
        if (name.includes('pan')) return 'PAN must be 5 letters, 4 digits, 1 letter (e.g., ABCDE1234F)';
        return 'Invalid format';
      }
    }
    return '';
  };

  const handleChange = (e) => {
    const val = field.typeAttr === 'checkbox' ? e.target.checked : e.target.value;
    
    // For Aadhaar and OTP fields, enforce numeric input and max length
    if ((name.includes('adhar') || name.includes('aadhaar')) && typeof val === 'string') {
      const numericVal = val.replace(/\D/g, '').slice(0, 12);
      onChange(name, numericVal);
      setValidationState({
        ...validationState,
        error: validate(numericVal),
        isValid: numericVal.length === 12 && /^\d{12}$/.test(numericVal)
      });
      return;
    }
    
    if (name.includes('otp') && typeof val === 'string') {
      const numericVal = val.replace(/\D/g, '').slice(0, 6);
      onChange(name, numericVal);
      setValidationState({
        ...validationState,
        error: validate(numericVal),
        isValid: numericVal.length === 6 && /^\d{6}$/.test(numericVal)
      });
      return;
    }
    
    // For PAN, enforce uppercase and pattern
    if (name.includes('pan') && typeof val === 'string') {
      const formattedVal = val.toUpperCase().slice(0, 10);
      onChange(name, formattedVal);
      setValidationState({
        ...validationState,
        error: validate(formattedVal),
        isValid: /^[A-Z]{5}\d{4}[A-Z]{1}$/.test(formattedVal)
      });
      return;
    }
    
    // For PIN code, fetch location data
    if (name.includes('pincode') && typeof val === 'string' && val.length === 6) {
      fetchPINInfo(val)
        .then(data => {
          if (data[0].Status === 'Success') {
            setPinCodeData(data[0].PostOffice[0]);
            if (onPinCodeData) onPinCodeData(data[0].PostOffice[0]);
          } else {
            setPinCodeData(null);
            if (onPinCodeData) onPinCodeData(null);
          }
        })
        .catch(() => {
          setPinCodeData(null);
          if (onPinCodeData) onPinCodeData(null);
        });
    }
    
    // Default handling for other fields
    onChange(name, val);
    setValidationState({
      ...validationState,
      error: validate(val),
      isValid: !validate(val)
    });
  };

  // If using react-hook-form
  if (register) {
    return (
      <div className="mb-4">
        {label && (
          <label htmlFor={field.id || name} className="block text-sm font-medium text-gray-700 mb-1">
            {label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        {field.typeAttr === 'checkbox' ? (
          <div className="flex items-center">
            <input
              {...register(name)}
              id={field.id || name}
              type="checkbox"
              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor={field.id || name} className="ml-2 block text-sm text-gray-700">
              {label || 'I agree'}
            </label>
          </div>
        ) : (
          <input
            {...register(name)}
            id={field.id || name}
            type={field.typeAttr || 'text'}
            placeholder={field.placeholder || ''}
            className={`mt-1 block w-full px-3 py-2 border ${errors?.[name] ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
          />
        )}
        {errors?.[name] && <p className="mt-1 text-sm text-red-600">{errors[name].message}</p>}
        {field.pattern && <p className="mt-1 text-xs text-gray-500">Format: {field.pattern}</p>}
      </div>
    );
  }

  // Standard version without react-hook-form
  return (
    <div className="mb-4">
      {label && (
        <label htmlFor={field.id || name} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {field.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      {field.typeAttr === 'checkbox' ? (
        <div className="flex items-center">
          <input
            id={field.id || name}
            name={name}
            type="checkbox"
            checked={!!value}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            required={field.required}
          />
          <label htmlFor={field.id || name} className="ml-2 block text-sm text-gray-700">
            {label || 'I agree'}
          </label>
        </div>
      ) : (
        <div className="relative">
          <input
            id={field.id || name}
            name={name}
            type={field.typeAttr || 'text'}
            placeholder={field.placeholder || ''}
            value={value ?? ''}
            onChange={handleChange}
            className={`block w-full px-3 py-2 border ${validationState.error ? 'border-red-500' : validationState.isValid ? 'border-green-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
            required={field.required}
            pattern={field.pattern || undefined}
          />
          {validationState.isValid && (
            <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-green-500">
              ✓
            </span>
          )}
        </div>
      )}
      {validationState.error && <p className="mt-1 text-sm text-red-600">{validationState.error}</p>}
      {field.pattern && <p className="mt-1 text-xs text-gray-500">Format: {field.pattern}</p>}
      {pinCodeData && name.includes('pincode') && (
        <div className="mt-1 p-2 bg-gray-50 rounded-md">
          <p className="text-sm text-gray-700">
            <span className="font-medium">City:</span> {pinCodeData.District}, <span className="font-medium">State:</span> {pinCodeData.State}
          </p>
        </div>
      )}
    </div>
  );
}