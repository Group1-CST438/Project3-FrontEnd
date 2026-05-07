'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createProject } from '@/lib/api'

function cutCorners(px: number) {
    return `polygon(${px}px 0,calc(100% - ${px}px) 0,100% ${px}px,100% calc(100% - ${px}px),calc(100% - ${px}px) 100%,${px}px 100%,0 calc(100% - ${px}px),0 ${px}px)`
}

function Tag({ label, onRemove }: { label: string; onRemove: () => void }) {
    return (
        <button
            type="button"
            onClick={onRemove}
            className="flex items-center gap-1.5 text-[11px] px-2 py-1 transition hover:opacity-70"
            style={{
                clipPath: cutCorners(6),
                background: 'rgba(63,102,152,0.25)',
                border: '1px solid rgba(111,149,197,0.4)',
                color: 'var(--fp-button-accent)',
            }}
        >
            {label} <span style={{ fontSize: 9 }}>✕</span>
        </button>
    )
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
    return (
        <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold" style={{ color: 'var(--fp-text-secondary)' }}>
                {label}{required && <span style={{ color: '#f87171' }}> *</span>}
            </label>
            {children}
        </div>
    )
}

const inputStyle = {
    background: 'var(--fp-input-bg)',
    border: '1px solid var(--fp-input-border)',
    color: 'var(--fp-text-primary)',
} as React.CSSProperties

export default function NewProjectPage() {
    const router = useRouter()

    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [categories, setCategories] = useState<string[]>([])
    const [roles, setRoles] = useState<string[]>([])
    const [catInput, setCatInput] = useState('')
    const [roleInput, setRoleInput] = useState('')
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)

    function addTag(value: string, list: string[], setList: (v: string[]) => void, setInput: (v: string) => void) {
        const trimmed = value.trim()
        if (!trimmed || list.includes(trimmed)) return
        setList([...list, trimmed])
        setInput('')
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        if (!title.trim()) return

        setSubmitting(true)
        setError(null)

        try {
            await createProject({
                title: title.trim(),
                generalDescription: description.trim() || undefined,
                type: categories.length > 0 ? categories.join(', ') : undefined,
            })
            router.push('/projects')
        } catch {
            setError('Failed to create project — make sure the backend is running on port 8080.')
            setSubmitting(false)
        }
    }

    return (
        <main className="min-h-screen flex flex-col" style={{ background: 'var(--fp-bg)' }}>
            {/* Topbar */}
            <div
                className="sticky top-0 z-40 border-b px-6 h-14 flex items-center gap-4 backdrop-blur-md"
                style={{ borderColor: 'rgba(111,149,197,0.15)', background: 'rgba(8,13,20,0.72)' }}
            >
                <Link
                    href="/projects"
                    className="text-sm transition hover:brightness-110"
                    style={{ color: 'var(--fp-text-muted)' }}
                >
                    ← Back
                </Link>
                <span className="text-sm font-semibold" style={{ color: 'var(--fp-text-primary)' }}>
                    New Project
                </span>
            </div>

            {/* Form */}
            <div className="flex-1 flex items-start justify-center px-6 py-12">
                <div className="w-full max-w-xl" style={{ position: 'relative' }}>
                    {/* Border glow */}
                    <div
                        aria-hidden
                        style={{
                            position: 'absolute',
                            inset: 0,
                            clipPath: cutCorners(18),
                            background: 'var(--fp-panel-border)',
                            boxShadow: '0 0 20px var(--fp-panel-glow-1), 0 0 40px var(--fp-panel-glow-2)',
                        }}
                    />

                    <form
                        onSubmit={handleSubmit}
                        className="relative m-[3px] p-8 flex flex-col gap-6"
                        style={{ clipPath: cutCorners(16), background: 'var(--fp-surface-primary)' }}
                    >
                        <div>
                            <p className="text-xs font-bold uppercase tracking-[0.25em] mb-1" style={{ color: 'var(--fp-text-subtle)' }}>
                                ProjectMatch
                            </p>
                            <h1 className="text-2xl font-bold" style={{ color: 'var(--fp-text-primary)' }}>
                                Post a Project
                            </h1>
                            <p className="text-sm mt-1" style={{ color: 'var(--fp-text-muted)' }}>
                                Tell people what you're building and who you need.
                            </p>
                        </div>

                        {/* Title */}
                        <Field label="Project Title" required>
                            <input
                                type="text"
                                placeholder="e.g. Campus Navigator App"
                                className="w-full px-4 py-3 text-sm rounded-md outline-none"
                                style={inputStyle}
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                            />
                        </Field>

                        {/* Description */}
                        <Field label="Description">
                            <textarea
                                rows={4}
                                placeholder="What is this project about? What problem does it solve?"
                                className="w-full px-4 py-3 text-sm rounded-md outline-none resize-none"
                                style={inputStyle}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </Field>

                        {/* Categories */}
                        <Field label="Categories">
                            <div className="flex flex-wrap gap-2 min-h-[28px]">
                                {categories.map((c) => (
                                    <Tag key={c} label={c} onRemove={() => setCategories(categories.filter((x) => x !== c))} />
                                ))}
                            </div>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="e.g. Mobile App, Education…"
                                    className="flex-1 px-3 py-2 text-sm rounded-md outline-none"
                                    style={inputStyle}
                                    value={catInput}
                                    onChange={(e) => setCatInput(e.target.value)}
                                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag(catInput, categories, setCategories, setCatInput) } }}
                                />
                                <button
                                    type="button"
                                    onClick={() => addTag(catInput, categories, setCategories, setCatInput)}
                                    className="px-3 py-2 text-sm font-semibold transition hover:brightness-110"
                                    style={{ clipPath: cutCorners(6), background: 'var(--fp-surface-accent)', color: 'var(--fp-button-accent)' }}
                                >
                                    Add
                                </button>
                            </div>
                        </Field>

                        {/* Open Roles */}
                        <Field label="Open Roles">
                            <div className="flex flex-wrap gap-2 min-h-[28px]">
                                {roles.map((r) => (
                                    <Tag key={r} label={r} onRemove={() => setRoles(roles.filter((x) => x !== r))} />
                                ))}
                            </div>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="e.g. Backend Engineer, Designer…"
                                    className="flex-1 px-3 py-2 text-sm rounded-md outline-none"
                                    style={inputStyle}
                                    value={roleInput}
                                    onChange={(e) => setRoleInput(e.target.value)}
                                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag(roleInput, roles, setRoles, setRoleInput) } }}
                                />
                                <button
                                    type="button"
                                    onClick={() => addTag(roleInput, roles, setRoles, setRoleInput)}
                                    className="px-3 py-2 text-sm font-semibold transition hover:brightness-110"
                                    style={{ clipPath: cutCorners(6), background: 'var(--fp-surface-accent)', color: 'var(--fp-button-accent)' }}
                                >
                                    Add
                                </button>
                            </div>
                        </Field>

                        {error && (
                            <p className="text-sm" style={{ color: '#f87171' }}>{error}</p>
                        )}

                        <div className="flex items-center gap-3 pt-2">
                            <button
                                type="submit"
                                disabled={submitting || !title.trim()}
                                className="flex-1 py-3 text-sm font-semibold transition hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed"
                                style={{ clipPath: cutCorners(10), background: 'var(--fp-surface-accent)', color: 'var(--fp-button-accent)' }}
                            >
                                {submitting ? 'Posting…' : 'Post Project'}
                            </button>
                            <Link
                                href="/projects"
                                className="px-5 py-3 text-sm transition hover:brightness-110"
                                style={{ color: 'var(--fp-text-muted)' }}
                            >
                                Cancel
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </main>
    )
}
