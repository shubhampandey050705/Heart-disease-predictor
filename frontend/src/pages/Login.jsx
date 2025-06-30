import { useState , useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import instance from '../api/axios'; // ✅ Using your axios instance
import { Card, CardContent } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Button } from '../components/ui/button';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await instance.post('/auth/login', {
        email,
        password,
      });

      // Store JWT token
      localStorage.setItem('access_token', res.data.access_token);

      // Navigate to dashboard
      navigate('/dashboard');
    } catch (err) {
      const msg =
        err.response?.data?.message || err.response?.data?.error || 'Invalid credentials';
      setError(msg);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white px-4">
      <Card className="w-full max-w-md shadow-2xl rounded-xl border border-violet-700 bg-gradient-to-br from-indigo-900 via-purple-900 to-purple-800 backdrop-blur">
        <CardContent className="p-6 space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-violet-300">Welcome Back</h2>
            <p className="text-sm text-purple-200">Login to continue</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="email" className="text-purple-200">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-gray-900 text-white border-gray-700 focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            <div>
              <Label htmlFor="password" className="text-purple-200">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-gray-900 text-white border-gray-700 focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">
              Login
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
