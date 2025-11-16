/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_PUBLISHABLE_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare module 'netlify-identity-widget' {
  interface User {
    id: string;
    email: string;
    user_metadata: {
      full_name?: string;
      [key: string]: unknown;
    };
    app_metadata: {
      [key: string]: unknown;
    };
    token?: {
      access_token: string;
      expires_at: number;
      refresh_token: string;
      token_type: string;
    };
  }

  interface NetlifyIdentity {
    init: (config?: { container?: string }) => void;
    open: (tab?: 'login' | 'signup') => void;
    close: () => void;
    logout: () => void;
    currentUser: () => User | null;
    on: (event: string, callback: (user?: User) => void) => void;
    off: (event: string) => void;
  }

  const netlifyIdentity: NetlifyIdentity;
  export default netlifyIdentity;
}
