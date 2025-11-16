import { useAuth } from '@/contexts/AuthContext';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export function Login() {
  const { user, login, signup } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Kinobody Workout Tracker
          </h1>
          <p className="text-gray-600">
            Greek God 2.0 Program
          </p>
        </div>

        <div className="space-y-4">
          <button
            onClick={login}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Log In
          </button>

          <button
            onClick={signup}
            className="w-full border-2 border-blue-600 text-blue-600 py-3 px-4 rounded-lg hover:bg-blue-50 transition-colors font-medium"
          >
            Sign Up
          </button>
        </div>

        <p className="text-sm text-gray-500 text-center mt-6">
          Track your workouts, nutrition, and progress across all devices
        </p>
      </div>
    </div>
  );
}
