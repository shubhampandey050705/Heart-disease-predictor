import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import instance from '../api/axios'; // ✅ Correct import

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await instance.post('/auth/register', form); // ✅ Use custom axios instance
      if (response.status === 201 || response.status === 200) {
        navigate('/login');
      } else {
        setError('Registration failed. Try again.');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white px-4">
      <Card className="w-full max-w-md shadow-2xl rounded-xl border border-violet-700 bg-gradient-to-br from-indigo-900 via-purple-900 to-purple-800 backdrop-blur">
        <CardContent className="p-6 space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-violet-300">Create Account</h2>
            <p className="text-sm text-purple-200">Join us and predict health smarter.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name" className="text-purple-200">Name</Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="John Doe"
                value={form.name}
                onChange={handleChange}
                required
                className="bg-gray-900 text-white border-gray-700 focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            <div>
              <Label htmlFor="email" className="text-purple-200">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                required
                className="bg-gray-900 text-white border-gray-700 focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            <div>
              <Label htmlFor="password" className="text-purple-200">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                required
                className="bg-gray-900 text-white border-gray-700 focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">
              Register
            </Button>

            <p className="text-sm text-center text-purple-200">
              Already have an account?{' '}
              <a href="/login" className="text-indigo-300 hover:underline font-medium">
                Login
              </a>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;
