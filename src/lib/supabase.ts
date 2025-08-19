import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Debug logging to check environment variables
console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Anon Key:', supabaseAnonKey ? 'Present' : 'Missing');
console.log('Supabase Anon Key (first 20 chars):', supabaseAnonKey ? supabaseAnonKey.substring(0, 20) + '...' : 'N/A');
console.log('Environment variables loaded at:', new Date().toISOString());

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(`Missing Supabase environment variables: URL=${supabaseUrl ? 'Present' : 'Missing'}, Key=${supabaseAnonKey ? 'Present' : 'Missing'}`);
}

// Validate URL format
try {
  new URL(supabaseUrl);
} catch (error) {
  throw new Error(`Invalid Supabase URL format: ${supabaseUrl}`);
}

console.log('Creating Supabase client with URL:', supabaseUrl);
console.log('Creating Supabase client with anon key (first 20 chars):', supabaseAnonKey.substring(0, 20) + '...');

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

console.log('Supabase client created successfully');
console.log('Client auth state:', supabase.auth.getSession());

// Create service role client for admin operations (bypasses RLS)
export const createServiceClient = () => {
  const serviceRoleKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY;
  
  if (!serviceRoleKey) {
    console.warn('Service role key not available - using regular client');
    return null;
  }
  
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
};

// Storage bucket names
export const STORAGE_BUCKETS = {
  LOGOS: 'logos',
  PRODUCTS: 'products',
  BANNERS: 'banners',
  TESTIMONIALS: 'testimonials'
} as const;

// Test storage connection
export const testStorageConnection = async () => {
  try {
    const { data, error } = await supabase.storage.listBuckets();
    console.log('Available storage buckets:', data);
    if (error) {
      console.error('Storage connection error:', error);
      return false;
    }
    return true;
  } catch (error) {
    console.error('Storage test failed:', error);
    return false;
  }
};

// Temporarily make supabase client globally accessible for debugging
// TODO: Remove this line after debugging is complete
(window as any).supabase = supabase;
console.log('Supabase client attached to window object for debugging');