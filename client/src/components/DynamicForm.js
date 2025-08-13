import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DynamicField from './DynamicField';
import { fetchSchema, postStep1, postStep2 } from '../api';
import Stepper from './Stepper';

export default function DynamicForm({ step }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [schema, setSchema] = useState(null);
  const [formData, setFormData] = useState({});
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [pinCodeData, setPinCodeData] = useState(null);

  useEffect(() => {
    fetchSchema(step)
      .then(data => setSchema(data))
      .catch(err => setErrorMsg('Failed to load form schema'));
  }, [step]);

  const handleChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handlePinCodeData = (data) => {
    setPinCodeData(data);
    if (data) {
      setFormData({
        ...formData,
        city: data.District,
        state: data.State,
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    const payload = step === 'step2' ? { id, ...formData } : formData;

    const postFn = step === 'step1' ? postStep1 : postStep2;
    postFn(payload)
      .then(res => {
        if (step === 'step1') {
          navigate(`/step2/${res.registration._id}`);
        } else {
          setSuccessMsg('Form submitted successfully!');
        }
      })
      .catch(err => {
        setErrorMsg(err.response?.data?.message || 'Something went wrong!');
      });
  };

  if (!schema) return <p className="text-center mt-10 text-gray-600">Loading form...</p>;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
        <Stepper />
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          Udyam Registration — {step === 'step1' ? 'Aadhaar + OTP' : 'PAN'}
        </h2>
        {errorMsg && <p className="text-red-500 mb-4 text-sm">{errorMsg}</p>}
        {successMsg && <p className="text-green-500 mb-4 text-sm">{successMsg}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          {schema.map(field => (
            <DynamicField
              key={field.id}
              field={field}
              value={formData[field.name || field.id]}
              onChange={handleChange}
              onPinCodeData={handlePinCodeData}
            />
          ))}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            {step === 'step1' ? 'Continue to Step 2' : 'Submit PAN'}
          </button>
        </form>
      </div>
    </div>
  );
}