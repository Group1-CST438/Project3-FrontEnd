'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { onAuthStateChanged, type User } from 'firebase/auth'
import { auth } from '@/lib/firebase'

// ── Types ─────────────────────────────────────────────────────────────────

type Profile = {
    bio: string
    roles: string[]
    skills: string[]
}

const EMPTY_PROFILE: Profile = { bio: '', roles: [], skills: [] }

// ── Preset options ────────────────────────────────────────────────────────

const PRESET_ROLES = [
    'Frontend Developer',
    'Backend Developer',
    'Full-Stack Developer',
    'Mobile Developer',
    'UX / UI Designer',
    'Graphic Designer',
    'Data Scientist',
    'DevOps / Cloud',
    'Product Manager',
    'Video Editor',
    'Content Creator',
    'Marketing Strategist',
    'Business Analyst',
    'Researcher',
    'Workshop Instructor',
]

const PRESET_SKILLS = [
    'React', 'Next.js', 'TypeScript', 'JavaScript', 'Python',
    'Java', 'Node.js', 'SQL', 'MongoDB', 'Figma',
    'Tailwind CSS', 'Docker', 'AWS', 'Git', 'Firebase',
    'Premiere Pro', 'After Effects', 'Photoshop', 'Illustrator',
]

// ── Helpers ───────────────────────────────────────────────────────────────

function storageKey(uid: string) {
    return `projectmatch_profile_${uid}`
}

function loadProfile(uid: string): Profile {
    try {
        const raw = localStorage.getItem(storageKey(uid))
        return raw ? { ...EMPTY_PROFILE, ...JSON.parse(raw) } : EMPTY_PROFILE
    } catch {
        return EMPTY_PROFILE
    }
}

function saveProfile(uid: string, profile: Profile) {
    localStorage.setItem(storageKey(uid), JSON.stringify(profile))
}

// ── UI helpers ────────────────────────────────────────────────────────────

function cutCorners(px: number) {
    return `polygon(${px}px 0,calc(100% - ${px}px) 0,100% ${px}px,100% calc(100% - ${px}px),calc(100% - ${px}px) 100%,${px}px 100%,0 calc(100% - ${px}px),0 ${px}px)`
}

const sidebarItems = [
    { label: 'Explore Projects', href: '/projects' },
    { label: 'My Matches', href: '/matches' },
    { label: 'Saved', href: '/saved' },
    { label: 'My Profile', href: '/profile', active: true },
]

// ── Component ─────────────────────────────────────────────────────────────

export default function ProfilePage() {
    const [user, setUser] = useState<User | null>(null)
    const [authReady, setAuthReady] = useState(false)
    const [profile, setProfile] = useState<Profile>(EMPTY_PROFILE)
    const [skillInput, setSkillInput] = useState('')
    const [saved, setSaved] = useState(false)
    const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

    // Subscribe to Firebase auth
    useEffect(() => {
        return onAuthStateChanged(auth, (u) => {
            setUser(u)
            setAuthReady(true)
            if (u) setProfile(loadProfile(u.uid))
        })
    }, [])

    // Auto-save to localStorage on every change
    function update(patch: Partial<Profile>) {
        setProfile((prev) => {
            const next = { ...prev, ...patch }
            if (user) {
                saveProfile(user.uid, next)
                setSaved(true)
                if (saveTimer.current) clearTimeout(saveTimer.current)
                saveTimer.current = setTimeout(() => setSaved(false), 1800)
            }
            return next
        })
    }

    function toggleRole(role: string) {
        update({
            roles: profile.roles.includes(role)
                ? profile.roles.filter((r) => r !== role)
                : [...profile.roles, role],
        })
    }

    function addSkill(value: string) {
        const trimmed = value.trim()
        if (!trimmed || profile.skills.includes(trimmed)) return
        update({ skills: [...profile.skills, trimmed] })
        setSkillInput('')
    }

    function removeSkill(skill: string) {
        update({ skills: profile.skills.filter((s) => s !== skill) })
    }

    function togglePresetSkill(skill: string) {
        if (profile.skills.includes(skill)) {
            removeSkill(skill)
        } else {
            update({ skills: [...profile.skills, skill] })
        }
    }

    if (!authReady) {
        return (
            <main className="min-h-screen flex items-center justify-center" style={{ background: 'var(--fp-bg)' }}>
                <div className="w-8 h-8 border-2 border-current border-t-transparent rounded-full animate-spin" style={{ color: 'var(--fp-button-accent)' }} />
            </main>
        )
    }

    if (!user) {
        return (
            <main className="min-h-screen flex items-center justify-center" style={{ background: 'var(--fp-bg)' }}>
                <div className="text-center">
                    <p className="text-lg mb-4" style={{ color: 'var(--fp-text-muted)' }}>Sign in to view your profile</p>
                    <Link href="/login" className="px-5 py-2 text-sm font-semibold" style={{ clipPath: cutCorners(8), background: 'var(--fp-surface-accent)', color: 'var(--fp-button-accent)' }}>
                        Log in
                    </Link>
                </div>
            </main>
        )
    }

    return (
        <main className="min-h-screen" style={{ background: 'var(--fp-bg)' }}>
            <div className="grid min-h-screen md:grid-cols-[240px_1fr]">

                {/* Sidebar */}
                <aside className="border-r" style={{ borderColor: 'rgba(111,149,197,0.15)', background: 'rgba(10,16,26,0.72)' }}>
                    <div className="px-6 py-6">
                        <Link href="/" className="inline-flex items-center gap-3 text-lg font-bold" style={{ color: 'var(--fp-text-primary)' }}>
                            <div className="flex h-9 w-9 items-center justify-center text-sm font-bold" style={{ clipPath: cutCorners(10), background: 'var(--fp-surface-accent)', color: 'var(--fp-button-accent)' }}>
                                ↗
                            </div>
                            ProjectMatch
                        </Link>
                    </div>
                    <nav className="px-4 pb-6">
                        <div className="flex flex-col gap-2">
                            {sidebarItems.map((item) => (
                                <Link
                                    key={item.label}
                                    href={item.href}
                                    className="px-4 py-3 text-sm font-medium transition hover:brightness-110"
                                    style={item.active
                                        ? { clipPath: cutCorners(8), background: 'rgba(63,102,152,0.18)', border: '1px solid rgba(111,149,197,0.25)', color: 'var(--fp-button-accent)' }
                                        : { clipPath: cutCorners(8), color: 'var(--fp-text-muted)' }}
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </div>
                    </nav>
                </aside>

                {/* Main content */}
                <section className="flex min-w-0 flex-col">
                    {/* Topbar */}
                    <div className="sticky top-0 z-40 border-b px-6 py-4 backdrop-blur-md flex items-center justify-between" style={{ borderColor: 'rgba(111,149,197,0.15)', background: 'rgba(8,13,20,0.72)' }}>
                        <h1 className="text-lg font-semibold" style={{ color: 'var(--fp-text-primary)' }}>My Profile</h1>
                        {saved && (
                            <span className="text-xs font-medium" style={{ color: '#4ade80' }}>Saved ✓</span>
                        )}
                    </div>

                    <div className="px-6 py-8 max-w-3xl flex flex-col gap-10">

                        {/* ── Identity ── */}
                        <div className="flex items-center gap-5">
                            {user.photoURL ? (
                                <img src={user.photoURL} alt={user.displayName ?? ''} className="rounded-full object-cover" style={{ width: 72, height: 72 }} referrerPolicy="no-referrer" />
                            ) : (
                                <div className="flex items-center justify-center rounded-full text-2xl font-bold" style={{ width: 72, height: 72, background: 'var(--fp-surface-accent)', color: 'var(--fp-button-accent)' }}>
                                    {(user.displayName ?? user.email ?? '?').charAt(0).toUpperCase()}
                                </div>
                            )}
                            <div>
                                <p className="text-2xl font-bold" style={{ color: 'var(--fp-text-primary)' }}>{user.displayName ?? 'Anonymous'}</p>
                                <p className="text-sm mt-0.5" style={{ color: 'var(--fp-text-muted)' }}>{user.email}</p>
                                {profile.roles.length > 0 && (
                                    <p className="text-sm mt-1 font-medium" style={{ color: 'var(--fp-button-accent)' }}>
                                        {profile.roles.slice(0, 2).join(' · ')}
                                        {profile.roles.length > 2 && ` +${profile.roles.length - 2}`}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* ── Bio ── */}
                        <Section title="Bio" subtitle="Tell collaborators what you're about.">
                            <textarea
                                rows={3}
                                placeholder="e.g. CS student passionate about mobile apps and open-source work..."
                                className="w-full px-4 py-3 text-sm rounded-md outline-none resize-none"
                                style={{ background: 'var(--fp-input-bg)', border: '1px solid var(--fp-input-border)', color: 'var(--fp-text-primary)' }}
                                value={profile.bio}
                                onChange={(e) => update({ bio: e.target.value })}
                            />
                        </Section>

                        {/* ── Roles ── */}
                        <Section title="Roles" subtitle="Select the roles you're interested in filling on a project.">
                            <div className="flex flex-wrap gap-2">
                                {PRESET_ROLES.map((role) => {
                                    const selected = profile.roles.includes(role)
                                    return (
                                        <button
                                            key={role}
                                            onClick={() => toggleRole(role)}
                                            className="px-3 py-1.5 text-sm font-medium transition hover:brightness-110"
                                            style={{
                                                clipPath: cutCorners(8),
                                                background: selected ? 'rgba(63,102,152,0.35)' : 'rgba(63,102,152,0.08)',
                                                border: selected ? '1px solid rgba(111,149,197,0.6)' : '1px solid rgba(111,149,197,0.2)',
                                                color: selected ? 'var(--fp-button-accent)' : 'var(--fp-text-muted)',
                                            }}
                                        >
                                            {selected && <span className="mr-1.5">✓</span>}
                                            {role}
                                        </button>
                                    )
                                })}
                            </div>
                        </Section>

                        {/* ── Skills ── */}
                        <Section title="Skills" subtitle="Add tools, languages, and technologies you know.">
                            {/* Preset chips */}
                            <div className="flex flex-wrap gap-2 mb-4">
                                {PRESET_SKILLS.map((skill) => {
                                    const selected = profile.skills.includes(skill)
                                    return (
                                        <button
                                            key={skill}
                                            onClick={() => togglePresetSkill(skill)}
                                            className="px-3 py-1 text-xs font-medium transition hover:brightness-110"
                                            style={{
                                                clipPath: cutCorners(6),
                                                background: selected ? 'rgba(63,102,152,0.35)' : 'rgba(63,102,152,0.08)',
                                                border: selected ? '1px solid rgba(111,149,197,0.6)' : '1px solid rgba(111,149,197,0.2)',
                                                color: selected ? 'var(--fp-button-accent)' : 'var(--fp-text-muted)',
                                            }}
                                        >
                                            {selected && <span className="mr-1">✓</span>}
                                            {skill}
                                        </button>
                                    )
                                })}
                            </div>

                            {/* Custom skill input */}
                            <div className="flex gap-2 mb-4">
                                <input
                                    type="text"
                                    placeholder="Add a custom skill…"
                                    className="flex-1 px-3 py-2 text-sm rounded-md outline-none"
                                    style={{ background: 'var(--fp-input-bg)', border: '1px solid var(--fp-input-border)', color: 'var(--fp-text-primary)' }}
                                    value={skillInput}
                                    onChange={(e) => setSkillInput(e.target.value)}
                                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addSkill(skillInput) } }}
                                />
                                <button
                                    onClick={() => addSkill(skillInput)}
                                    className="px-4 py-2 text-sm font-semibold transition hover:brightness-110"
                                    style={{ clipPath: cutCorners(6), background: 'var(--fp-surface-accent)', color: 'var(--fp-button-accent)' }}
                                >
                                    Add
                                </button>
                            </div>

                            {/* Selected custom skills (non-preset) */}
                            {profile.skills.filter((s) => !PRESET_SKILLS.includes(s)).length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                    {profile.skills
                                        .filter((s) => !PRESET_SKILLS.includes(s))
                                        .map((skill) => (
                                            <button
                                                key={skill}
                                                onClick={() => removeSkill(skill)}
                                                className="flex items-center gap-1.5 px-3 py-1 text-xs font-medium transition hover:opacity-70"
                                                style={{
                                                    clipPath: cutCorners(6),
                                                    background: 'rgba(63,102,152,0.35)',
                                                    border: '1px solid rgba(111,149,197,0.6)',
                                                    color: 'var(--fp-button-accent)',
                                                }}
                                            >
                                                {skill}
                                                <span style={{ fontSize: 10 }}>✕</span>
                                            </button>
                                        ))}
                                </div>
                            )}
                        </Section>

                        {/* ── Summary ── */}
                        {(profile.roles.length > 0 || profile.skills.length > 0) && (
                            <Section title="Your Profile Summary" subtitle="This is how you'll appear to project owners.">
                                <div
                                    className="p-5 flex flex-col gap-3"
                                    style={{ clipPath: cutCorners(12), background: 'var(--fp-surface-primary)', border: '1px solid rgba(111,149,197,0.2)' }}
                                >
                                    <div className="flex items-center gap-3">
                                        {user.photoURL
                                            ? <img src={user.photoURL} alt="" className="rounded-full" style={{ width: 40, height: 40 }} referrerPolicy="no-referrer" />
                                            : <div className="rounded-full flex items-center justify-center text-sm font-bold" style={{ width: 40, height: 40, background: 'var(--fp-surface-accent)', color: 'var(--fp-button-accent)' }}>
                                                {(user.displayName ?? '?').charAt(0).toUpperCase()}
                                            </div>
                                        }
                                        <div>
                                            <p className="font-semibold text-sm" style={{ color: 'var(--fp-text-primary)' }}>{user.displayName ?? 'You'}</p>
                                            {profile.bio && <p className="text-xs mt-0.5 line-clamp-1" style={{ color: 'var(--fp-text-muted)' }}>{profile.bio}</p>}
                                        </div>
                                    </div>
                                    {profile.roles.length > 0 && (
                                        <div>
                                            <p className="text-xs font-bold uppercase tracking-widest mb-1.5" style={{ color: 'var(--fp-text-subtle)' }}>Roles</p>
                                            <div className="flex flex-wrap gap-1.5">
                                                {profile.roles.map((r) => (
                                                    <span key={r} className="text-[11px] px-2 py-0.5" style={{ clipPath: cutCorners(5), background: 'rgba(63,102,152,0.18)', border: '1px solid rgba(111,149,197,0.28)', color: 'var(--fp-text-secondary)' }}>{r}</span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    {profile.skills.length > 0 && (
                                        <div>
                                            <p className="text-xs font-bold uppercase tracking-widest mb-1.5" style={{ color: 'var(--fp-text-subtle)' }}>Skills</p>
                                            <div className="flex flex-wrap gap-1.5">
                                                {profile.skills.map((s) => (
                                                    <span key={s} className="text-[11px] px-2 py-0.5" style={{ clipPath: cutCorners(5), background: 'rgba(63,102,152,0.18)', border: '1px solid rgba(111,149,197,0.28)', color: 'var(--fp-text-secondary)' }}>{s}</span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </Section>
                        )}

                    </div>
                </section>
            </div>
        </main>
    )
}

function Section({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
    return (
        <div className="flex flex-col gap-3">
            <div>
                <h2 className="text-lg font-bold" style={{ color: 'var(--fp-text-primary)' }}>{title}</h2>
                <p className="text-sm" style={{ color: 'var(--fp-text-muted)' }}>{subtitle}</p>
            </div>
            {children}
        </div>
    )
}
