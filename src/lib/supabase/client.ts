import { createClient } from '@supabase/supabase-js';
import netlifyIdentity from 'netlify-identity-widget';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

// Helper function to get auth headers
export const getAuthHeaders = () => {
  const user = netlifyIdentity.currentUser();

  if (user?.token?.access_token) {
    return {
      Authorization: `Bearer ${user.token.access_token}`,
    };
  }

  return {};
};
