import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Stepper from '../components/Stepper';
import DynamicField from '../components/DynamicField.jsx';
import { fetchSchema, validateAadhaar, validateOTP, postStep1, fetchPINInfo } from '../api/client.js';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import '../index.css';

// Build a small yup schema for fields we know
const schemaYup = yup.object({
  // we'll validate aadhaar & name & consent, OTP validated separately
  aadhaar: yup.string().matches(/^\d{12}$/, 'Aadhaar must be exactly 12 digits').required('Aadhaar required'),
  name: yup.string().required('Name is required'),
  'ctl00$ContentPlaceHolder1$chkDecarationA': yup.boolean().oneOf([true], 'Consent required')
});

export default function Step1() {
  const [schema, setSchema] = useState([]);
  const [serverError, setServerError] = useState('');
  const [regId, setRegId] = useState(null);
  const [showOTP, setShowOTP] = useState(false);
  const [otpValue, setOtpValue] = useState('');
  const [otpError, setOtpError] = useState('');
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    resolver: yupResolver(schemaYup),
    mode: 'onBlur'
  });

  useEffect(() => {
    fetchSchema('step1').then(setSchema).catch(err => console.error(err));
  }, []);

  // Prevent Aadhaar input from growing beyond 12 digits as user types
  useEffect(() => {
    const sub = watch((value, { name }) => {
      if (!name) return;
      if (name.toLowerCase().includes('adhar') || name.toLowerCase().includes('aadhaar')) {
        const v = value[name] ?? '';
        if (v.length > 12) {
          setValue(name, v.slice(0, 12));
        }
      }
      if (name.toLowerCase().includes('pin') && value[name] && value[name].length === 6) {
        // optional PIN autofill
        fetchPINInfo(value[name]).then(data => {
          const post = data?.[0]?.PostOffice?.[0];
          if (post) {
            setValue('city', post.District || post.Region || '');
            setValue('state', post.State || '');
          }
        }).catch(()=>{});
      }
    });
    return () => sub.unsubscribe && sub.unsubscribe();
  }, [watch, setValue]);

  const onValidateAadhaar = async (form) => {
    setServerError('');
    try {
      // schemaYup already validated client-side; call backend to "validate aadhaar"
      const res = await validateAadhaar({
        aadhaar: form.aadhaar || form['ctl00_ContentPlaceHolder1_txtadharno'],
        name: form.name || form['ctl00_ContentPlaceHolder1_txtownername'],
        consent: form['ctl00$ContentPlaceHolder1$chkDecarationA'] === true || form['ctl00$ContentPlaceHolder1$chkDecarationA'] === 'true'
      });
      // backend returns id
      setRegId(res.id);
      setShowOTP(true);
    } catch (err) {
      setServerError(err.response?.data?.message || 'Aadhaar validation failed');
    }
  };

  const onValidateOTP = async () => {
    setOtpError('');
    if (!regId) return setOtpError('Missing registration id');
    if (!otpValue) return setOtpError('Enter OTP');
    try {
      const res = await validateOTP({ id: regId, otp: otpValue });
      // success: OTP verified and backend moved partial into step1
      // redirect to step2 with id
      navigate(`/step2/${res.id}`);
    } catch (err) {
      setOtpError(err.response?.data?.message || 'OTP validation failed');
    }
  };

  // optionally final submit endpoint (in this flow validateOTP already saved step1)
  const onSubmitFinal = async (data) => {
    if (!regId) {
      setServerError('Please validate Aadhaar first');
      return;
    }
    if (!otpValue) {
      setServerError('Please verify OTP first');
      return;
    }
    setSaving(true);
    try {
      // call step1 endpoint to attach any extra fields (if any)
      await postStep1({ id: regId, ...data });
      navigate(`/step2/${regId}`);
    } catch (err) {
      setServerError(err.response?.data?.message || 'Could not save step1');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 bg-gray-50 min-h-screen">
      <Stepper />
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-2xl font-bold mb-4 text-blue-800 border-b pb-2">Udyam Registration — Step 1</h2>
        <p className="text-gray-600 mb-4">Please enter your Aadhaar details to proceed with the registration.</p>

        {serverError && <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
          <p>{serverError}</p>
        </div>}

      <form onSubmit={handleSubmit(onValidateAadhaar)}>
        {/* Render dynamic schema but attach react-hook-form register */}
        {schema.map(f => {
          // skip OTP & button types; OTP controlled separately
          if (f.type === 'button' || (f.typeAttr && (f.typeAttr === 'hidden' || f.typeAttr === 'submit'))) return null;
          // Skip the OTP field from the schema as we'll handle it separately
          if (f.id === 'ctl00_ContentPlaceHolder1_txtAadhaarOTP' || f.name === 'otp') return null;

          const name = f.name || f.id;
          const label = f.label || f.placeholder || name;

          // checkbox
          if (f.typeAttr === 'checkbox') {
            return (
              <div key={f.id} className="mb-4 flex items-start">
                <input {...register(name)} type="checkbox" className="mt-1 mr-2" />
                <label className="text-sm">
                  I, the holder of the above Aadhaar, hereby give my consent to Ministry of MSME, Government of India, for using my Aadhaar number as alloted by UIDAI for Udyam Registration. NIC / Ministry of MSME, Government of India, have informed me that my aadhaar data will not be stored/shared.
                </label>
                {errors[name] && <p className="text-red-500 text-sm ml-2">{errors[name].message}</p>}
              </div>
            );
          }

          // text-like inputs
          // Map the field IDs to our form field names
          let fieldName = name;
          if (f.id === 'ctl00_ContentPlaceHolder1_txtadharno') {
            fieldName = 'aadhaar';
          } else if (f.id === 'ctl00_ContentPlaceHolder1_txtownername') {
            fieldName = 'name';
          }
          
          return (
            <div key={f.id} className="mb-4">
              <label className="block mb-1 text-sm font-medium">
                {f.id === 'ctl00_ContentPlaceHolder1_txtadharno' ? 'Aadhaar Number / आधार संख्या' : 
                 f.id === 'ctl00_ContentPlaceHolder1_txtownername' ? 'Name of Entrepreneur / उद्यमी का नाम' : 
                 label}
              </label>
              <input
                {...register(fieldName)}
                type={f.typeAttr || 'text'}
                placeholder={f.placeholder || ''}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
              {f.pattern && <p className="text-xs text-gray-500">Pattern: <code>{f.pattern}</code></p>}
              {errors[fieldName] && <p className="text-red-500 text-sm">{errors[fieldName].message}</p>}
            </div>
          );
        })}

        {/* Validate Aadhaar button */}
        <div className="flex gap-2">
          <button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white font-bold hover:bg-blue-700 transition-colors">Validate & Generate OTP</button>
          <button type="button" onClick={() => { 
            // Reset form
            setValue('aadhaar', '');
            setValue('name', '');
            setValue('ctl00$ContentPlaceHolder1$chkDecarationA', false);
            setShowOTP(false);
            setOtpValue('');
            setOtpError('');
            setServerError('');
          }} className="px-4 py-2 rounded border hover:bg-gray-100 transition-colors">Reset</button>
        </div>
      </form>

      {/* OTP area shown only after Aadhaar validated */}
      {showOTP && (
        <div className="mt-6 bg-white p-4 rounded border shadow-md">
          <h3 className="font-medium mb-2">OTP Verification</h3>
          <p className="text-sm text-gray-600 mb-2">An OTP has been sent to the mobile number linked with your Aadhaar. For demo purposes, use <code>123456</code>.</p>
          <div className="flex items-center gap-2 mb-3">
            <input
              value={otpValue}
              onChange={(e) => {
                const v = e.target.value.replace(/\D/g, '');
                setOtpValue(v.slice(0, 6));
              }}
              placeholder="Enter 6-digit OTP"
              className="w-60 p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              maxLength="6"
            />
            <button 
              onClick={() => {
                // Resend OTP functionality would go here
                alert('In a real implementation, a new OTP would be sent to your mobile number.');
              }} 
              className="text-blue-600 hover:text-blue-800 text-sm underline"
            >
              Resend OTP
            </button>
          </div>
          <div className="mt-3 flex items-center gap-3">
            <button 
              onClick={onValidateOTP} 
              className="px-4 py-2 bg-green-600 text-white rounded font-bold hover:bg-green-700 transition-colors"
            >
              Validate OTP
            </button>
            <button 
              onClick={() => {
                // allow clicking final submit which will save step1 (but OTP endpoint already did)
                handleSubmit(onSubmitFinal)();
              }} 
              className="px-4 py-2 bg-blue-600 text-white rounded font-bold hover:bg-blue-700 transition-colors" 
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Proceed to Step 2'}
            </button>
          </div>
          {otpError && <p className="text-red-500 mt-2 font-medium">{otpError}</p>}
        </div>
      )}
      </div>
    </div>
  );
}
