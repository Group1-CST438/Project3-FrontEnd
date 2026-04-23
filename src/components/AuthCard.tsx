'use client'

import Link from 'next/link'
import type React from 'react'

type AuthMode = 'login' | 'signup'

interface AuthCardProps {
    mode: AuthMode
}

function cutCorners(px: number) {
    return `polygon(${px}px 0,calc(100% - ${px}px) 0,100% ${px}px,100% calc(100% - ${px}px),calc(100% - ${px}px) 100%,${px}px 100%,0 calc(100% - ${px}px),0 ${px}px)`
}

export default function AuthCard({ mode }: AuthCardProps) {
    const isLogin = mode === 'login'

    return (
        <div
            className="w-full max-w-md"
            style={{
                position: 'relative',
            }}
        >
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

                <p className="text-sm mb-6" style={{ color: 'var(--fp-text-muted)' }}>
                    {isLogin
                        ? 'Log in to continue building and collaborating.'
                        : 'Sign up to post projects, join teams, and build experience.'}
                </p>

                <form className="flex flex-col gap-4">
                    {!isLogin && (
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium" style={{ color: 'var(--fp-text-secondary)' }}>
                                Full Name
                            </label>
                            <input
                                type="text"
                                placeholder="Jane Doe"
                                className="px-4 py-3 rounded-md outline-none"
                                style={{
                                    background: 'var(--fp-input-bg)',
                                    border: '1px solid var(--fp-input-border)',
                                    color: 'var(--fp-text-primary)',
                                }}
                            />
                        </div>
                    )}

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium" style={{ color: 'var(--fp-text-secondary)' }}>
                            Email
                        </label>
                        <input
                            type="email"
                            placeholder="you@example.com"
                            className="px-4 py-3 rounded-md outline-none"
                            style={{
                                background: 'var(--fp-input-bg)',
                                border: '1px solid var(--fp-input-border)',
                                color: 'var(--fp-text-primary)',
                            }}
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium" style={{ color: 'var(--fp-text-secondary)' }}>
                            Password
                        </label>
                        <input
                            type="password"
                            placeholder="Enter your password"
                            className="px-4 py-3 rounded-md outline-none"
                            style={{
                                background: 'var(--fp-input-bg)',
                                border: '1px solid var(--fp-input-border)',
                                color: 'var(--fp-text-primary)',
                            }}
                        />
                    </div>

                    {!isLogin && (
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium" style={{ color: 'var(--fp-text-secondary)' }}>
                                Confirm Password
                            </label>
                            <input
                                type="password"
                                placeholder="Re-enter your password"
                                className="px-4 py-3 rounded-md outline-none"
                                style={{
                                    background: 'var(--fp-input-bg)',
                                    border: '1px solid var(--fp-input-border)',
                                    color: 'var(--fp-text-primary)',
                                }}
                            />
                        </div>
                    )}

                    <button
                        type="submit"
                        className="mt-2 px-4 py-3 text-sm font-semibold transition hover:brightness-110"
                        style={{
                            clipPath: cutCorners(10),
                            background: 'var(--fp-surface-accent)',
                            color: 'var(--fp-text-primary)',
                        }}
                    >
                        {isLogin ? 'Log In' : 'Create Account'}
                    </button>
                </form>

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