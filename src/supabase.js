// ── Supabase Client — Glopo Companion ─────────────────────────────
// Shared singleton. Import { supabase } from anywhere in the app.
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
    || import.meta.env.VITE_SUPABASE_ANON_KEY;

const isValidClientKey = (key) => typeof key === 'string'
    && (key.startsWith('sb_publishable_') || key.startsWith('eyJ'));
const isConfigured = SUPABASE_URL && isValidClientKey(SUPABASE_KEY);

if (!isConfigured) {
    console.warn(
        '[GloPo] Supabase client env vars are missing or invalid.\n' +
        'Auth/cloud-sync features disabled. Set VITE_SUPABASE_URL and\n' +
        'VITE_SUPABASE_PUBLISHABLE_KEY in Netlify env vars.'
    );
}

export const supabase = isConfigured
    ? createClient(SUPABASE_URL, SUPABASE_KEY)
    : {
        auth: {
            getUser:           () => Promise.resolve({ data: { user: null }, error: null }),
            getSession:        () => Promise.resolve({ data: { session: null }, error: null }),
            signInWithOtp:     () => Promise.resolve({ error: { message: 'Auth not configured' } }),
            signOut:           () => Promise.resolve({ error: null }),
            onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
        },
        from: () => ({
            select: () => ({ eq: () => ({ eq: () => ({ single: () => Promise.resolve({ data: null }) }) }) }),
            upsert: () => Promise.resolve({ error: null }),
        }),
    };
