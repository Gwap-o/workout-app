import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase/client';
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card';
import { DunamisLogo } from '@/components/ui/DunamisLogo';
import { Dumbbell, TrendingUp, Activity, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function Login() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Sign in - only invited users can access
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
    } catch (err: any) {
      setError(err.message || 'An error occurred. Make sure you have been invited to use this app.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#FCFCF9] dark:bg-[#0D1117] p-4">
      <Card className="max-w-md w-full shadow-2xl bg-white dark:bg-[#161B22] border-[#E8EAED] dark:border-[#30363D]">
        <CardHeader className="text-center space-y-2 pb-4">
          <div className="flex justify-center mb-2">
            <DunamisLogo size="xl" showText />
          </div>
          <CardDescription className="text-base text-[#5F6368] dark:text-[#8B949E]">
            Unleash Your Inner Strength
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-[#202124] dark:text-[#E6EDF3]">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-[#FCFCF9] dark:bg-[#0D1117] border-[#E8EAED] dark:border-[#30363D]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-[#202124] dark:text-[#E6EDF3]">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-[#FCFCF9] dark:bg-[#0D1117] border-[#E8EAED] dark:border-[#30363D]"
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 rounded-md bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50">
                <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 flex-shrink-0" />
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-[#20808D] hover:bg-[#1A6B76] dark:bg-[#1FB8CD] dark:hover:bg-[#2DD4E8] text-white"
            >
              {loading ? 'Loading...' : 'Sign In'}
            </Button>
          </form>

          <div className="pt-2 border-t border-[#E8EAED] dark:border-[#30363D]">
            <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/50 rounded-md p-3 mb-4">
              <p className="text-xs text-blue-800 dark:text-blue-300 text-center">
                🔒 This app is invite-only. Only invited users can create accounts.
              </p>
            </div>
            <p className="text-sm text-[#5F6368] dark:text-[#8B949E] text-center mb-4 font-medium">
              Start tracking your journey to greatness
            </p>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="flex flex-col items-center space-y-1">
                <Activity className="w-5 h-5 text-[#20808D] dark:text-[#1FB8CD]" />
                <p className="text-xs text-[#5F6368] dark:text-[#8B949E]">Track Workouts</p>
              </div>
              <div className="flex flex-col items-center space-y-1">
                <TrendingUp className="w-5 h-5 text-[#20808D] dark:text-[#1FB8CD]" />
                <p className="text-xs text-[#5F6368] dark:text-[#8B949E]">Monitor Progress</p>
              </div>
              <div className="flex flex-col items-center space-y-1">
                <Dumbbell className="w-5 h-5 text-[#20808D] dark:text-[#1FB8CD]" />
                <p className="text-xs text-[#5F6368] dark:text-[#8B949E]">Build Strength</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
