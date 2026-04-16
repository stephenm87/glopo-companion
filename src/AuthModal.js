import React, { useState, useEffect } from 'react';
import { supabase } from './supabase';

const ALLOWED_DOMAIN = 'saschina.org';

function getDisplayName(user) {
    if (!user) return null;
    const emailPart = user.email.split('@')[0];
    const firstName = emailPart.split('.')[0];
    return firstName.charAt(0).toUpperCase() + firstName.slice(1);
}

// ── Auth Badge rendered in the header ─────────────────────────────
export function AuthBadge({ user, onSignInClick }) {
    const handleSignOut = async () => { await supabase.auth.signOut(); };

    if (user) {
        const name = getDisplayName(user);
        return (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-blue-500/20 bg-blue-500/5">
                <span className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-xs font-black text-white flex-shrink-0">
                    {name.charAt(0)}
                </span>
                <span className="text-sm font-semibold text-blue-300 max-w-[90px] overflow-hidden text-ellipsis whitespace-nowrap">
                    {name}
                </span>
                <button
                    onClick={handleSignOut}
                    className="text-xs text-gray-600 hover:text-gray-400 transition-colors ml-1"
                    title="Sign out"
                >
                    ↗
                </button>
            </div>
        );
    }
    return (
        <button
            onClick={onSignInClick}
            id="companion-signin-trigger"
            className="inline-flex items-center gap-2 px-5 py-2 rounded-xl border border-blue-500/20 bg-blue-500/5 text-blue-400 text-sm font-bold hover:bg-blue-500/10 hover:border-blue-500/40 transition-all"
        >
            🔒 Sign in to save work
        </button>
    );
}

// ── Magic Link Modal ──────────────────────────────────────────────
export function AuthModal({ onClose }) {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);

    useEffect(() => {
        const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
        document.addEventListener('keydown', handleKey);
        return () => document.removeEventListener('keydown', handleKey);
    }, [onClose]);

    const handleSend = async () => {
        const trimmed = email.trim();
        if (!trimmed) { setError('Please enter your email.'); return; }
        const domain = trimmed.split('@')[1]?.toLowerCase();
        if (domain !== ALLOWED_DOMAIN) {
            setError(`Please use your SAS school email (@${ALLOWED_DOMAIN})`);
            return;
        }
        setError('');
        setLoading(true);
        try {
            const { error: sbError } = await supabase.auth.signInWithOtp({
                email: trimmed,
                options: { emailRedirectTo: window.location.href, shouldCreateUser: true }
            });
            if (sbError) throw sbError;
            setSent(true);
        } catch (err) {
            setError(err.message || 'Something went wrong. Try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-md"
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
            role="dialog" aria-modal="true" aria-label="Sign in to Glopo Companion"
        >
            <div className="relative bg-glopo-dark border border-blue-500/25 rounded-2xl p-9 w-full max-w-sm shadow-2xl shadow-black/60"
                style={{ animation: 'companionAuthSlide 0.25s ease' }}>
                <style>{`@keyframes companionAuthSlide { from { transform:translateY(14px);opacity:0; } to { transform:translateY(0);opacity:1; } }`}</style>
                <button
                    className="absolute top-4 right-5 text-gray-600 hover:text-gray-400 transition-colors text-xl leading-none"
                    onClick={onClose} aria-label="Close"
                >
                    &times;
                </button>
                {!sent ? (
                    <>
                        <div className="text-center mb-6">
                            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-blue-600/10 border border-blue-500/20 mb-4">
                                <span className="text-2xl">📚</span>
                            </div>
                            <h2 className="text-xl font-black text-white mb-1">Sign in to Companion</h2>
                            <p className="text-sm text-gray-500">Enter your SAS email — a magic link will be sent to your inbox.</p>
                        </div>
                        <input
                            type="email"
                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-gray-600 outline-none focus:border-blue-500 transition-colors mb-3 box-border"
                            placeholder="yourname@saschina.org"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            onKeyDown={(e) => { if (e.key === 'Enter') handleSend(); }}
                            autoComplete="email"
                            inputMode="email"
                            id="companion-auth-email"
                        />
                        <button
                            className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-sm transition-all disabled:opacity-40"
                            onClick={handleSend}
                            disabled={loading}
                            id="companion-auth-send"
                        >
                            {loading ? 'Sending…' : 'Send Magic Link'}
                        </button>
                        {error && <p className="text-red-400 text-xs text-center mt-2">{error}</p>}
                    </>
                ) : (
                    <div className="text-center py-4">
                        <div className="text-4xl mb-4">📬</div>
                        <h3 className="text-lg font-black text-blue-400 mb-2">Check your inbox!</h3>
                        <p className="text-sm text-gray-500">
                            A sign-in link was sent to <strong className="text-gray-300">{email}</strong>.<br />
                            Click it to sign in — no password needed.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

// ── useAuth hook — call once in App ──────────────────────────────
export function useAuth() {
    const [user, setUser] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        supabase.auth.getUser().then(({ data: { user } }) => setUser(user));
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user || null);
            if (session?.user) setShowModal(false);
        });
        return () => subscription.unsubscribe();
    }, []);

    return { user, showModal, openModal: () => setShowModal(true), closeModal: () => setShowModal(false) };
}
