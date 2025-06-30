import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="text-center space-y-6">
        <h1 className="text-3xl font-bold">Welcome to HeartCare AI</h1>
        <p>Click below to make a prediction.</p>
        <Button
          onClick={() => navigate('/predict')}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl"
        >
          Go to Predict Page
        </Button>
      </div>
    </div>
  );
};

export default Dashboard;
