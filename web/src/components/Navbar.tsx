'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { onAuthStateChanged, signOut, type User } from 'firebase/auth'
import { auth } from '@/lib/firebase'

function cutCorners(px: number) {
    return `polygon(${px}px 0,calc(100% - ${px}px) 0,100% ${px}px,100% calc(100% - ${px}px),calc(100% - ${px}px) 100%,${px}px 100%,0 calc(100% - ${px}px),0 ${px}px)`
}

export default function Navbar() {
    const [user, setUser] = useState<User | null>(null)
    const [ready, setReady] = useState(false)
    const [menuOpen, setMenuOpen] = useState(false)
    const menuRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        return onAuthStateChanged(auth, (u) => {
            setUser(u)
            setReady(true)
        })
    }, [])

    useEffect(() => {
        function handleClick(e: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setMenuOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClick)
        return () => document.removeEventListener('mousedown', handleClick)
    }, [])

    return (
        <nav
            className="sticky top-0 z-50 backdrop-blur-md"
            style={{
                background: 'rgba(8,13,20,0.72)',
                borderBottom: '1px solid rgba(111,149,197,0.25)',
            }}
        >
            <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
                <Link
                    href="/"
                    className="text-lg font-bold tracking-tight hover:brightness-110 transition-all"
                    style={{ color: 'var(--fp-text-primary)' }}
                >
                    ProjectMatch
                </Link>

                <div className="flex items-center gap-3">
                    {!ready ? (
                        <div className="w-8 h-8 rounded-full animate-pulse" style={{ background: 'rgba(63,102,152,0.2)' }} />
                    ) : user ? (
                        <div className="relative" ref={menuRef}>
                            <button
                                onClick={() => setMenuOpen((o) => !o)}
                                className="flex items-center justify-center rounded-full overflow-hidden transition hover:ring-2"
                                style={{ width: 36, height: 36 }}
                                aria-label="Account menu"
                            >
                                {user.photoURL ? (
                                    <img
                                        src={user.photoURL}
                                        alt={user.displayName ?? 'Profile'}
                                        className="w-full h-full object-cover"
                                        referrerPolicy="no-referrer"
                                    />
                                ) : (
                                    <span
                                        className="w-full h-full flex items-center justify-center text-sm font-bold"
                                        style={{ background: 'var(--fp-surface-accent)', color: 'var(--fp-button-accent)' }}
                                    >
                                        {(user.displayName ?? user.email ?? '?').charAt(0).toUpperCase()}
                                    </span>
                                )}
                            </button>

                            {menuOpen && (
                                <div
                                    className="absolute right-0 mt-2 w-48 py-1 flex flex-col"
                                    style={{
                                        clipPath: cutCorners(10),
                                        background: 'var(--fp-surface-primary)',
                                        border: '1px solid rgba(111,149,197,0.2)',
                                        boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
                                    }}
                                >
                                    <p className="px-4 py-2 text-xs truncate" style={{ color: 'var(--fp-text-muted)' }}>
                                        {user.displayName ?? user.email}
                                    </p>
                                    <div style={{ borderTop: '1px solid rgba(111,149,197,0.12)' }} />
                                    <Link
                                        href="/projects"
                                        onClick={() => setMenuOpen(false)}
                                        className="px-4 py-2 text-sm transition hover:brightness-110"
                                        style={{ color: 'var(--fp-text-secondary)' }}
                                    >
                                        My Projects
                                    </Link>
                                    <button
                                        onClick={() => { signOut(auth); setMenuOpen(false) }}
                                        className="px-4 py-2 text-sm text-left transition hover:brightness-110"
                                        style={{ color: '#f87171' }}
                                    >
                                        Sign out
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <>
                            <Link
                                href="/login"
                                className="px-4 py-1.5 text-sm font-medium transition hover:brightness-110"
                                style={{ color: 'var(--fp-text-muted)' }}
                            >
                                Log in
                            </Link>

                            <div style={{ position: 'relative' }}>
                                <div
                                    aria-hidden
                                    style={{
                                        position: 'absolute',
                                        inset: 0,
                                        clipPath: cutCorners(8),
                                        background: 'var(--fp-panel-border)',
                                        boxShadow: '0 0 12px var(--fp-panel-glow-1)',
                                        pointerEvents: 'none',
                                    }}
                                />
                                <Link
                                    href="/signup"
                                    className="relative inline-block px-4 py-1.5 text-sm font-semibold transition hover:brightness-110"
                                    style={{
                                        margin: 2,
                                        clipPath: cutCorners(6),
                                        background: 'var(--fp-surface-accent)',
                                        color: 'var(--fp-button-accent)',
                                    }}
                                >
                                    Sign up
                                </Link>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </nav>
    )
}
