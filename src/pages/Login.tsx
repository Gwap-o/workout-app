import { useAuth } from '@/contexts/AuthContext';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dumbbell, TrendingUp, Activity } from 'lucide-react';

export function Login() {
  const { user, login, signup } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <Card className="max-w-md w-full mx-4 shadow-2xl border-0">
        <CardHeader className="text-center space-y-2 pb-4">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-4 rounded-2xl shadow-lg">
              <Dumbbell className="w-12 h-12 text-white" />
            </div>
          </div>
          <CardTitle className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Greek God Tracker
          </CardTitle>
          <CardDescription className="text-base">
            Kinobody 2.0 Workout Program
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="space-y-3">
            <Button
              onClick={login}
              className="w-full h-12 text-base font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              size="lg"
            >
              Log In
            </Button>

            <Button
              onClick={signup}
              variant="outline"
              className="w-full h-12 text-base font-semibold border-2"
              size="lg"
            >
              Sign Up
            </Button>
          </div>

          <div className="pt-6 border-t">
            <p className="text-sm text-gray-600 text-center mb-4 font-medium">
              Start tracking your journey to greatness
            </p>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="flex flex-col items-center space-y-1">
                <Activity className="w-5 h-5 text-blue-600" />
                <p className="text-xs text-gray-600">Track Workouts</p>
              </div>
              <div className="flex flex-col items-center space-y-1">
                <TrendingUp className="w-5 h-5 text-green-600" />
                <p className="text-xs text-gray-600">Monitor Progress</p>
              </div>
              <div className="flex flex-col items-center space-y-1">
                <Dumbbell className="w-5 h-5 text-purple-600" />
                <p className="text-xs text-gray-600">Build Strength</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
