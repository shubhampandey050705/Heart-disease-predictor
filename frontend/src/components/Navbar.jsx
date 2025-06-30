import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const isAuthenticated = !!localStorage.getItem('access_token');

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    navigate('/login');
  };

  return (
    <nav className="bg-gradient-to-r from-indigo-900 via-purple-800 to-rose-800 p-4 shadow-md text-white">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold text-rose-200 tracking-wide">❤️ HeartCare AI</h1>

        <div className="space-x-4">
          {isAuthenticated ? (
            <>
              <Link
                to="/dashboard"
                className="hover:text-indigo-200 transition duration-200 font-medium"
              >
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="bg-rose-600 hover:bg-rose-700 text-white px-4 py-1 rounded-md font-semibold transition duration-200"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-1 rounded-md font-medium transition duration-200"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-1 rounded-md font-medium transition duration-200"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
