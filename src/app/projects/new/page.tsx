'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import HexPanel from '@/components/HexPanel'
import { createProject } from '@/lib/api'

function cutCorners(px: number) {
    return `polygon(${px}px 0,calc(100% - ${px}px) 0,100% ${px}px,100% calc(100% - ${px}px),calc(100% - ${px}px) 100%,${px}px 100%,0 calc(100% - ${px}px),0 ${px}px)`
}

export default function NewProjectPage() {
    const router = useRouter()

    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [type, setType] = useState('')
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState<string | null>(null)

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setSaving(true)
        setError(null)

        try {
            await createProject({
                title,
                generalDescription: description || undefined,
                type: type || undefined,
                county: undefined,
            })

            router.push('/projects')
        } catch {
            setError('Could not create project. Make sure the backend is running.')
        } finally {
            setSaving(false)
        }
    }

    return (
        <main className="min-h-screen px-6 py-10" style={{ background: 'var(--fp-bg)' }}>
            <div className="max-w-2xl mx-auto">
                <Link
                    href="/projects"
                    className="text-sm"
                    style={{ color: 'var(--fp-button-accent)' }}
                >
                    ← Back to Projects
                </Link>

                <div className="mt-8">
                    <HexPanel
                        fill="var(--fp-surface-primary)"
                        cut={18}
                        contentStyle={{ padding: '32px' }}
                    >
                        <h1
                            className="text-3xl font-bold mb-2"
                            style={{ color: 'var(--fp-text-primary)' }}
                        >
                            Create Project
                        </h1>

                        <p className="mb-8 text-sm" style={{ color: 'var(--fp-text-muted)' }}>
                            Add a new project for students to discover and join.
                        </p>

                        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                            <div>
                                <label
                                    className="block text-xs font-bold uppercase tracking-widest mb-2"
                                    style={{ color: 'var(--fp-text-subtle)' }}
                                >
                                    Project Title
                                </label>
                                <input
                                    required
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full px-3 py-2 text-sm rounded outline-none"
                                    style={{
                                        background: 'var(--fp-input-bg)',
                                        border: '1px solid var(--fp-input-border)',
                                        color: 'var(--fp-text-primary)',
                                    }}
                                />
                            </div>

                            <div>
                                <label
                                    className="block text-xs font-bold uppercase tracking-widest mb-2"
                                    style={{ color: 'var(--fp-text-subtle)' }}
                                >
                                    Category / Type
                                </label>
                                <input
                                    value={type}
                                    onChange={(e) => setType(e.target.value)}
                                    placeholder="Example: cs, film, business"
                                    className="w-full px-3 py-2 text-sm rounded outline-none"
                                    style={{
                                        background: 'var(--fp-input-bg)',
                                        border: '1px solid var(--fp-input-border)',
                                        color: 'var(--fp-text-primary)',
                                    }}
                                />
                            </div>

                            <div>
                                <label
                                    className="block text-xs font-bold uppercase tracking-widest mb-2"
                                    style={{ color: 'var(--fp-text-subtle)' }}
                                >
                                    Description
                                </label>
                                <textarea
                                    rows={5}
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="w-full px-3 py-2 text-sm rounded outline-none resize-none"
                                    style={{
                                        background: 'var(--fp-input-bg)',
                                        border: '1px solid var(--fp-input-border)',
                                        color: 'var(--fp-text-primary)',
                                    }}
                                />
                            </div>

                            {error && (
                                <p className="text-sm" style={{ color: '#f87171' }}>
                                    {error}
                                </p>
                            )}

                            <div className="flex justify-end gap-3 pt-2">
                                <Link
                                    href="/projects"
                                    className="px-4 py-2 text-sm"
                                    style={{ color: 'var(--fp-text-muted)' }}
                                >
                                    Cancel
                                </Link>

                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="px-5 py-2 text-sm font-semibold transition hover:brightness-110 disabled:opacity-60"
                                    style={{
                                        clipPath: cutCorners(8),
                                        background: 'var(--fp-surface-accent)',
                                        color: 'var(--fp-button-accent)',
                                    }}
                                >
                                    {saving ? 'Creating…' : 'Create Project'}
                                </button>
                            </div>
                        </form>
                    </HexPanel>
                </div>
            </div>
        </main>
    )
}