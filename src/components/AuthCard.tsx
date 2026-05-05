'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { GoogleAuthProvider, GithubAuthProvider, signInWithPopup } from 'firebase/auth'
import { auth } from '@/lib/firebase'

type AuthMode = 'login' | 'signup'

interface AuthCardProps {
    mode: AuthMode
}

function cutCorners(px: number) {
    return `polygon(${px}px 0,calc(100% - ${px}px) 0,100% ${px}px,100% calc(100% - ${px}px),calc(100% - ${px}px) 100%,${px}px 100%,0 calc(100% - ${px}px),0 ${px}px)`
}

export default function AuthCard({ mode }: AuthCardProps) {
    const isLogin = mode === 'login'
    const router = useRouter()
    const [loading, setLoading] = useState<'google' | 'github' | null>(null)
    const [error, setError] = useState<string | null>(null)

    async function signIn(provider: 'google' | 'github') {
        setError(null)
        setLoading(provider)
        try {
            const authProvider = provider === 'google'
                ? new GoogleAuthProvider()
                : new GithubAuthProvider()
            await signInWithPopup(auth, authProvider)
            router.push('/discover')
        } catch (err: unknown) {
            const code = (err as { code?: string }).code
            if (code === 'auth/popup-closed-by-user' || code === 'auth/cancelled-popup-request') {
                // user dismissed — not an error worth showing
            } else if (code === 'auth/account-exists-with-different-credential') {
                setError('An account already exists with a different sign-in method.')
            } else {
                setError('Sign-in failed. Please try again.')
            }
        } finally {
            setLoading(null)
        }
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
                        onClick={() => signIn('google')}
                        disabled={loading !== null}
                        className="flex items-center justify-center gap-3 px-4 py-3 text-sm font-semibold rounded-md transition hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{
                            background: 'var(--fp-input-bg)',
                            border: '1px solid var(--fp-input-border)',
                            color: 'var(--fp-text-primary)',
                        }}
                    >
                        {loading === 'google' ? (
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

                    <button
                        onClick={() => signIn('github')}
                        disabled={loading !== null}
                        className="flex items-center justify-center gap-3 px-4 py-3 text-sm font-semibold rounded-md transition hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{
                            background: 'var(--fp-input-bg)',
                            border: '1px solid var(--fp-input-border)',
                            color: 'var(--fp-text-primary)',
                        }}
                    >
                        {loading === 'github' ? (
                            <span className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden fill="currentColor">
                                <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844a9.59 9.59 0 012.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
                            </svg>
                        )}
                        Continue with GitHub
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
