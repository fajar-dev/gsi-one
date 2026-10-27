
declare const process: any;

export const SUPABASE_URL = process.env.SUPABASE_URL || 'https://blysalihwznhzpufocus.supabase.co';
export const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'sb_publishable_pFL9rXfQEA2NNnqgVa87YA_eRgt8pqB';

export default {
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
};
