import { useAuth } from '@/contexts/AuthContext';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '@/lib/supabase/client';
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card';
import { DunamisLogo } from '@/components/ui/DunamisLogo';
import { Dumbbell, TrendingUp, Activity } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

export function Login() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

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
          <Auth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: resolvedTheme === 'dark' ? '#1FB8CD' : '#20808D',
                    brandAccent: resolvedTheme === 'dark' ? '#2DD4E8' : '#1A6B76',
                    brandButtonText: 'white',
                    defaultButtonBackground: resolvedTheme === 'dark' ? '#161B22' : '#FCFCF9',
                    defaultButtonBackgroundHover: resolvedTheme === 'dark' ? '#1C2128' : '#F5F5F5',
                    defaultButtonBorder: resolvedTheme === 'dark' ? '#30363D' : '#E8EAED',
                    defaultButtonText: resolvedTheme === 'dark' ? '#E6EDF3' : '#202124',
                    dividerBackground: resolvedTheme === 'dark' ? '#30363D' : '#E8EAED',
                    inputBackground: resolvedTheme === 'dark' ? '#0D1117' : '#FCFCF9',
                    inputBorder: resolvedTheme === 'dark' ? '#30363D' : '#E8EAED',
                    inputBorderHover: resolvedTheme === 'dark' ? '#30363D' : '#E8EAED',
                    inputBorderFocus: resolvedTheme === 'dark' ? '#1FB8CD' : '#20808D',
                    inputText: resolvedTheme === 'dark' ? '#E6EDF3' : '#202124',
                    inputPlaceholder: resolvedTheme === 'dark' ? '#8B949E' : '#5F6368',
                  },
                  radii: {
                    borderRadiusButton: '0.5rem',
                    buttonBorderRadius: '0.5rem',
                    inputBorderRadius: '0.375rem',
                  },
                },
              },
            }}
            providers={[]}
            redirectTo={window.location.origin}
            onlyThirdPartyProviders={false}
            magicLink={false}
          />

          <div className="pt-2 border-t border-[#E8EAED] dark:border-[#30363D]">
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
