import React, { useState } from 'react';
import instance from '../api/axios';
import { useNavigate } from 'react-router-dom';

export default function Predict() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    age: '',
    sex: '',
    cp: '',
    trestbps: '',
    chol: '',
    fbs: '',
    restecg: '',
    thalach: '',
    exang: '',
    oldpeak: '',
    slope: '',
    ca: '',
    thal: '',
    ecg_image: null,
  });

  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setForm({ ...form, ecg_image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    const token = localStorage.getItem('access_token');
    const formData = new FormData();

    try {
      // Frontend validations
      const numericKeys = Object.keys(form).filter(k => k !== 'ecg_image');
      for (const key of numericKeys) {
        if (form[key] === '') throw new Error(`Field '${key}' is required`);
        const value = key === 'oldpeak' ? parseFloat(form[key]) : parseInt(form[key]);
        if (isNaN(value)) throw new Error(`Invalid value for '${key}'`);
        formData.append(key, value);
      }

      if (form.ecg_image) {
        formData.append('ecg_image', form.ecg_image);
      }

      // 🐛 Debug payload
      for (let [key, val] of formData.entries()) {
        console.log(`${key}:`, val);
      }

      const response = await instance.post('/predict/predict', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('✅ API Response:', response.data);
      setResult(response.data.result);

    } catch (err) {
      console.error('❌ API Error:', err.response || err.message);
      setError(err.response?.data?.error || err.message || 'Something went wrong');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-gray-800 flex flex-col items-center justify-center text-white px-4">
      <h1 className="text-3xl font-bold mb-6">Heart Disease Prediction</h1>

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-4xl bg-white text-black p-8 rounded-2xl shadow-2xl grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        {Object.entries(form).map(([key, value]) =>
          key !== 'ecg_image' ? (
            <div key={key} className="flex flex-col">
              <label className="mb-1 capitalize font-semibold">{key}</label>
              <input
                type="number"
                step={key === 'oldpeak' ? 'any' : '1'}
                name={key}
                value={value}
                onChange={handleChange}
                required
                className="p-2 rounded-md border border-gray-300"
              />
            </div>
          ) : (
            <div key={key} className="md:col-span-2 flex flex-col">
              <label className="mb-1 font-semibold">ECG Image (Optional)</label>
              <input
                type="file"
                name="ecg_image"
                accept="image/*"
                onChange={handleFileChange}
                className="p-2 bg-gray-800 text-white border border-gray-600 file:bg-green-700 file:text-white"
              />
            </div>
          )
        )}

        <div className="md:col-span-2 flex justify-center">
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-xl"
            disabled={loading}
          >
            {loading ? 'Predicting...' : 'Predict'}
          </button>
        </div>
      </form>

      {result && (
        <div className="mt-6 text-xl font-semibold text-green-400">
          ✅ Result: {result}
        </div>
      )}
      {error && (
        <div className="mt-6 text-red-500 text-center">
          ❌ {error}
        </div>
      )}
    </div>
  );
}
