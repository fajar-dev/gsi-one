declare module '@env' {
  export const SUPABASE_URL: string;
  export const SUPABASE_ANON_KEY: string;

  export const APP_ENV: 'emulator' | 'simulator' | 'production';

  export const API_BASE_URL_EMULATOR: string;
  export const API_BASE_URL_SIMULATOR: string;
  export const API_BASE_URL_PRODUCTION: string;
}
