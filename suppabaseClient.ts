import { createClient } from '@supabase/supabase-js';

// Environment variables for better security
const supabaseUrl: string = 'https://rxjeijdgvbqpfyikhusl.supabase.co';
const supabaseKey: string = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ4amVpamRndmJxcGZ5aWtodXNsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzczOTYxMTMsImV4cCI6MjA1Mjk3MjExM30.Ez4EYLWKYDjwUbaHL4RcY93OsrqRFNivC415bRXvaUg';

// Create the Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
