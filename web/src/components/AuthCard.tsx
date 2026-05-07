'use client'

import Link from 'next/link'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'

type AuthMode = 'login' | 'signup'

interface AuthCardProps {
    mode: AuthMode
}

function cutCorners(px: number) {
    return `polygon(${px}px 0,calc(100% - ${px}px) 0,100% ${px}px,100% calc(100% - ${px}px),calc(100% - ${px}px) 100%,${px}px 100%,0 calc(100% - ${px}px),0 ${px}px)`
}

export default function AuthCard({ mode }: AuthCardProps) {
    const isLogin = mode === 'login'
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    async function signIn() {
        setError(null)
        setLoading(true)
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: { redirectTo: `${window.location.origin}/auth/callback` },
        })
        if (error) setError('Sign-in failed. Please try again.')
        setLoading(false)
    }

    return (
        <div className="w-full max-w-md" style={{ position: 'relative' }}>
            <div
                aria-hidden
                style={{
                    position: 'absolute',
                    inset: 0,
                    clipPath: cutCorners(16),
                    background: 'var(--fp-panel-border)',
                    boxShadow: '0 0 20px var(--fp-panel-glow-1), 0 0 40px var(--fp-panel-glow-2)',
                }}
            />

            <div
                className="relative m-[3px] p-8"
                style={{
                    clipPath: cutCorners(14),
                    background: 'var(--fp-surface-primary)',
                }}
            >
                <p
                    className="text-xs font-bold uppercase tracking-[0.25em] mb-3"
                    style={{ color: 'var(--fp-text-subtle)' }}
                >
                    ProjectMatch
                </p>

                <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--fp-text-primary)' }}>
                    {isLogin ? 'Welcome back' : 'Create your account'}
                </h1>

                <p className="text-sm mb-8" style={{ color: 'var(--fp-text-muted)' }}>
                    {isLogin
                        ? 'Log in to continue building and collaborating.'
                        : 'Sign up to post projects, join teams, and build experience.'}
                </p>

                <div className="flex flex-col gap-3">
                    <button
                        onClick={() => signIn()}
                        disabled={loading}
                        className="flex items-center justify-center gap-3 px-4 py-3 text-sm font-semibold rounded-md transition hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{
                            background: 'var(--fp-input-bg)',
                            border: '1px solid var(--fp-input-border)',
                            color: 'var(--fp-text-primary)',
                        }}
                    >
                        {loading ? (
                            <span className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden>
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                            </svg>
                        )}
                        Continue with Google
                    </button>
                </div>

                {error && (
                    <p className="text-sm mt-4 text-center" style={{ color: '#f87171' }}>
                        {error}
                    </p>
                )}

                <p className="text-sm mt-6" style={{ color: 'var(--fp-text-muted)' }}>
                    {isLogin ? (
                        <>
                            Don&apos;t have an account?{' '}
                            <Link href="/signup" className="font-semibold" style={{ color: 'var(--fp-button-accent)' }}>
                                Sign up
                            </Link>
                        </>
                    ) : (
                        <>
                            Already have an account?{' '}
                            <Link href="/login" className="font-semibold" style={{ color: 'var(--fp-button-accent)' }}>
                                Log in
                            </Link>
                        </>
                    )}
                </p>
            </div>
        </div>
    )
}
