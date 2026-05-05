import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://cvfrhfiaprdtwxxplngk.supabase.co';
const supabaseAnonKey = 'sb_publishable_rSI50V3UO3AeGBxnI8gP8A_uLdZIUk8';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
