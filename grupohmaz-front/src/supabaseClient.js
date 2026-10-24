import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://ravpfavtrjelafxubgrg.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_OUb8TF5P29lz5md1lWqfjA_8f_DGm_1';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);