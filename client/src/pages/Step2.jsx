import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Stepper from '../components/Stepper';
import DynamicField from '../components/DynamicField';
import { fetchSchema, postStep2 } from '../api/client.js';

export default function Step2() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [schema, setSchema] = useState([]);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (!id) {
      navigate('/step1');
      return;
    }
    fetchSchema('step2').then(setSchema).catch(err => console.error(err));
  }, [id, navigate]);

  const handleChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));

    const field = schema.find(f => f.name === name);
    if (field?.pattern && value !== '' && !new RegExp(field.pattern).test(value)) {
      setErrors(prev => ({ ...prev, [name]: 'Invalid format' }));
    } else {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrors({});

    // optional: client side validate required fields
    for (let f of schema) {
      if (f.typeAttr === 'hidden' || f.type === 'button') continue;
      const name = f.name || f.id;
      if (f.required && !formData[name]) {
        setErrors(prev => ({ ...prev, [name]: 'Required' }));
        return;
      }
      if (f.pattern && formData[name] && !new RegExp(f.pattern).test(formData[name])) {
        setErrors(prev => ({ ...prev, [name]: 'Invalid format' }));
        return;
      }
    }

    try {
      const payload = { id, ...formData };
      await postStep2(payload);
      setSuccessMsg('PAN saved successfully!');
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving PAN');
    }
  };

  if (!schema.length) {
    return <p className="text-center mt-10">Loading form...</p>;
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <Stepper />
      <h2 className="text-xl font-bold mb-4">Udyam Registration — Step 2</h2>
      {successMsg && <p className="text-green-600 mb-3">{successMsg}</p>}
      <form onSubmit={handleSubmit}>
        {schema.map(f => {
          if (f.type === 'button' || (f.typeAttr && (f.typeAttr === 'hidden' || f.typeAttr === 'submit'))) return null;
          const name = f.name || f.id;
          return (
            <div key={f.id} className="mb-4">
              <label className="block mb-1 text-sm font-medium">{f.label || f.placeholder}</label>
              <input
                type={f.typeAttr || 'text'}
                name={name}
                placeholder={f.placeholder || ''}
                required={f.required}
                pattern={f.pattern || undefined}
                className={`w-full p-2 border rounded ${errors[name] ? 'border-red-500' : 'border-gray-300'}`}
                onChange={(e) => handleChange(name, e.target.value)}
              />
              {f.pattern && <p className="text-xs text-gray-500">Pattern: <code>{f.pattern}</code></p>}
              {errors[name] && <p className="text-red-500 text-sm">{errors[name]}</p>}
            </div>
          );
        })}

        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">Save PAN</button>
      </form>
    </div>
  );
}
