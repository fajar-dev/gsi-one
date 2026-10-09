
declare const process: any;

export const SUPABASE_URL = process.env.SUPABASE_URL || 'https://blysalihwznhzpufocus.supabase.co';
export const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'sb_publishable_pFL9rXfQEA2NNnqgVa87YA_eRgt8pqB';
export const APP_ENV = process.env.APP_ENV || 'production';
export const API_BASE_URL_EMULATOR = process.env.API_BASE_URL_EMULATOR || 'http://10.0.2.2:3000';
export const API_BASE_URL_SIMULATOR = process.env.API_BASE_URL_SIMULATOR || 'http://localhost:3000';
export const API_BASE_URL_PRODUCTION = process.env.API_BASE_URL_PRODUCTION || 'https://grahasurvei.com';

export default {
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  APP_ENV,
  API_BASE_URL_EMULATOR,
  API_BASE_URL_SIMULATOR,
  API_BASE_URL_PRODUCTION,
};
