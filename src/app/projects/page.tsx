'use client'

import { useRef, useState, useMemo, useEffect, useCallback } from 'react'
import Link from 'next/link'
import HexPanel from '@/components/HexPanel'
import { getProjects, createProject, updateProject, deleteProject, type BackendProject } from '@/lib/api'

type Project = {
    id: string
    title: string
    category: string[]
    description: string
    roles: string[]
    owner: string
    image: string
    status: string
}

function fromBackend(p: BackendProject): Project {
    return {
        id: p.id,
        title: p.title,
        category: p.type ? p.type.split(', ').filter(Boolean) : [],
        description: p.generalDescription ?? '',
        roles: [],
        owner: p.userId ?? 'Unknown',
        image: '',
        status: 'Open',
    }
}

function toBackendPayload(p: Project) {
    return {
        title: p.title,
        generalDescription: p.description || undefined,
        type: p.category.length > 0 ? p.category.join(', ') : undefined,
        county: undefined as string | undefined,
    }
}

const sidebarItems = [
    { label: 'Explore Projects', href: '/projects', active: true },
    { label: 'My Matches', href: '/matches' },
    { label: 'Saved', href: '/saved' },
    { label: 'My Profile', href: '/profile' },
]

function cutCorners(px: number) {
    return `polygon(${px}px 0,calc(100% - ${px}px) 0,100% ${px}px,100% calc(100% - ${px}px),calc(100% - ${px}px) 100%,${px}px 100%,0 calc(100% - ${px}px),0 ${px}px)`
}

function Tag({ children }: { children: React.ReactNode }) {
    return (
        <span
            className="text-[11px] px-2 py-1"
            style={{
                clipPath: cutCorners(6),
                background: 'rgba(63,102,152,0.18)',
                border: '1px solid rgba(111,149,197,0.28)',
                color: 'var(--fp-text-secondary)',
            }}
        >
            {children}
        </span>
    )
}

function EditModal({
    project,
    onSave,
    onClose,
}: {
    project: Project
    onSave: (updated: Project) => void
    onClose: () => void
}) {
    const [draft, setDraft] = useState<Project>({ ...project })
    const [catInput, setCatInput] = useState('')
    const [roleInput, setRoleInput] = useState('')
    const imgRef = useRef<HTMLInputElement>(null)

    function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0]
        if (!file) return
        const url = URL.createObjectURL(file)
        setDraft((d) => ({ ...d, image: url }))
    }

    function addTag(field: 'category' | 'roles', value: string) {
        const trimmed = value.trim()
        if (!trimmed) return
        setDraft((d) => ({ ...d, [field]: [...d[field], trimmed] }))
        if (field === 'category') setCatInput('')
        else setRoleInput('')
    }

    function removeTag(field: 'category' | 'roles', index: number) {
        setDraft((d) => ({ ...d, [field]: d[field].filter((_, i) => i !== index) }))
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)' }}>
            <div
                className="w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 flex flex-col gap-5"
                style={{
                    clipPath: cutCorners(16),
                    background: 'var(--fp-surface-primary)',
                    border: '1px solid rgba(111,149,197,0.25)',
                }}
            >
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold" style={{ color: 'var(--fp-text-primary)' }}>Edit Project</h2>
                    <button onClick={onClose} style={{ color: 'var(--fp-text-muted)' }}>✕</button>
                </div>

                {/* Image */}
                <div>
                    <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--fp-text-subtle)' }}>Image</p>
                    <div
                        className="relative h-36 w-full overflow-hidden cursor-pointer group"
                        style={{ clipPath: cutCorners(10), background: 'rgba(17,28,45,0.9)' }}
                        onClick={() => imgRef.current?.click()}
                    >
                        <img src={draft.image} alt="" className="h-full w-full object-contain p-3 bg-black" />
                        <div
                            className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                            style={{ background: 'rgba(0,0,0,0.55)' }}
                        >
                            <span className="text-sm font-semibold" style={{ color: 'var(--fp-button-accent)' }}>Upload image</span>
                        </div>
                    </div>
                    <input ref={imgRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                </div>

                {/* Title */}
                <Field label="Title">
                    <input
                        className="w-full px-3 py-2 text-sm rounded outline-none"
                        style={{ background: 'var(--fp-input-bg)', border: '1px solid var(--fp-input-border)', color: 'var(--fp-text-primary)' }}
                        value={draft.title}
                        onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
                    />
                </Field>

                {/* Owner */}
                <Field label="Owner">
                    <input
                        className="w-full px-3 py-2 text-sm rounded outline-none"
                        style={{ background: 'var(--fp-input-bg)', border: '1px solid var(--fp-input-border)', color: 'var(--fp-text-primary)' }}
                        value={draft.owner}
                        onChange={(e) => setDraft((d) => ({ ...d, owner: e.target.value }))}
                    />
                </Field>

                {/* Status */}
                <Field label="Status">
                    <select
                        className="w-full px-3 py-2 text-sm rounded outline-none"
                        style={{ background: 'var(--fp-input-bg)', border: '1px solid var(--fp-input-border)', color: 'var(--fp-text-primary)' }}
                        value={draft.status}
                        onChange={(e) => setDraft((d) => ({ ...d, status: e.target.value }))}
                    >
                        {['New', 'Open', 'In Progress', 'Closed'].map((s) => (
                            <option key={s} value={s}>{s}</option>
                        ))}
                    </select>
                </Field>

                {/* Description */}
                <Field label="Description">
                    <textarea
                        rows={3}
                        className="w-full px-3 py-2 text-sm rounded outline-none resize-none"
                        style={{ background: 'var(--fp-input-bg)', border: '1px solid var(--fp-input-border)', color: 'var(--fp-text-primary)' }}
                        value={draft.description}
                        onChange={(e) => setDraft((d) => ({ ...d, description: e.target.value }))}
                    />
                </Field>

                {/* Categories */}
                <Field label="Categories">
                    <div className="flex flex-wrap gap-2 mb-2">
                        {draft.category.map((c, i) => (
                            <button
                                key={i}
                                onClick={() => removeTag('category', i)}
                                className="text-[11px] px-2 py-1 flex items-center gap-1 hover:opacity-70 transition"
                                style={{
                                    clipPath: cutCorners(6),
                                    background: 'rgba(63,102,152,0.18)',
                                    border: '1px solid rgba(111,149,197,0.28)',
                                    color: 'var(--fp-text-secondary)',
                                }}
                            >
                                {c} ✕
                            </button>
                        ))}
                    </div>
                    <div className="flex gap-2">
                        <input
                            className="flex-1 px-3 py-2 text-sm rounded outline-none"
                            style={{ background: 'var(--fp-input-bg)', border: '1px solid var(--fp-input-border)', color: 'var(--fp-text-primary)' }}
                            placeholder="Add category…"
                            value={catInput}
                            onChange={(e) => setCatInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && addTag('category', catInput)}
                        />
                        <button
                            onClick={() => addTag('category', catInput)}
                            className="px-3 py-2 text-sm font-semibold"
                            style={{ clipPath: cutCorners(6), background: 'var(--fp-surface-accent)', color: 'var(--fp-button-accent)' }}
                        >
                            Add
                        </button>
                    </div>
                </Field>

                {/* Roles */}
                <Field label="Open Roles">
                    <div className="flex flex-wrap gap-2 mb-2">
                        {draft.roles.map((r, i) => (
                            <button
                                key={i}
                                onClick={() => removeTag('roles', i)}
                                className="text-[11px] px-2 py-1 flex items-center gap-1 hover:opacity-70 transition"
                                style={{
                                    clipPath: cutCorners(6),
                                    background: 'rgba(63,102,152,0.18)',
                                    border: '1px solid rgba(111,149,197,0.28)',
                                    color: 'var(--fp-text-secondary)',
                                }}
                            >
                                {r} ✕
                            </button>
                        ))}
                    </div>
                    <div className="flex gap-2">
                        <input
                            className="flex-1 px-3 py-2 text-sm rounded outline-none"
                            style={{ background: 'var(--fp-input-bg)', border: '1px solid var(--fp-input-border)', color: 'var(--fp-text-primary)' }}
                            placeholder="Add role…"
                            value={roleInput}
                            onChange={(e) => setRoleInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && addTag('roles', roleInput)}
                        />
                        <button
                            onClick={() => addTag('roles', roleInput)}
                            className="px-3 py-2 text-sm font-semibold"
                            style={{ clipPath: cutCorners(6), background: 'var(--fp-surface-accent)', color: 'var(--fp-button-accent)' }}
                        >
                            Add
                        </button>
                    </div>
                </Field>

                <div className="flex gap-3 justify-end pt-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm"
                        style={{ color: 'var(--fp-text-muted)' }}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => onSave(draft)}
                        className="px-5 py-2 text-sm font-semibold transition hover:brightness-110"
                        style={{ clipPath: cutCorners(8), background: 'var(--fp-surface-accent)', color: 'var(--fp-button-accent)' }}
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div className="flex flex-col gap-1">
            <p className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--fp-text-subtle)' }}>{label}</p>
            {children}
        </div>
    )
}

export default function ProjectsPage() {
    const [projects, setProjects] = useState<Project[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [editing, setEditing] = useState<Project | null>(null)
    const [deleteId, setDeleteId] = useState<string | null>(null)
    const [search, setSearch] = useState('')

    const load = useCallback(async () => {
        setLoading(true)
        setError(null)
        try {
            const data = await getProjects()
            setProjects(data.map(fromBackend))
        } catch {
            setError('Could not reach the backend. Is it running on port 8080?')
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => { load() }, [load])

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase()
        if (!q) return projects
        return projects.filter(
            (p) =>
                p.title.toLowerCase().includes(q) ||
                p.description.toLowerCase().includes(q) ||
                p.owner.toLowerCase().includes(q) ||
                p.category.some((c) => c.toLowerCase().includes(q)) ||
                p.roles.some((r) => r.toLowerCase().includes(q)),
        )
    }, [projects, search])

    async function handleSave(updated: Project) {
        try {
            if (updated.id === '__new__') {
                const created = await createProject(toBackendPayload(updated))
                setProjects((prev) => [...prev.filter((p) => p.id !== '__new__'), fromBackend(created)])
            } else {
                const saved = await updateProject(updated.id, toBackendPayload(updated))
                setProjects((prev) => prev.map((p) => (p.id === saved.id ? { ...fromBackend(saved), roles: updated.roles, image: updated.image, status: updated.status } : p)))
            }
        } catch {
            alert('Save failed — check that the backend is running.')
        }
        setEditing(null)
    }

    async function handleDelete(id: string) {
        try {
            await deleteProject(id)
            setProjects((prev) => prev.filter((p) => p.id !== id))
        } catch {
            alert('Delete failed — check that the backend is running.')
        }
        setDeleteId(null)
    }

    return (
        <main className="min-h-screen" style={{ background: 'var(--fp-bg)' }}>
            {editing && <EditModal project={editing} onSave={handleSave} onClose={() => setEditing(null)} />}

            {/* Delete confirmation */}
            {deleteId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)' }}>
                    <div
                        className="w-full max-w-sm p-6 flex flex-col gap-4"
                        style={{ clipPath: cutCorners(14), background: 'var(--fp-surface-primary)', border: '1px solid rgba(239,68,68,0.3)' }}
                    >
                        <h2 className="text-lg font-bold" style={{ color: 'var(--fp-text-primary)' }}>Delete project?</h2>
                        <p className="text-sm" style={{ color: 'var(--fp-text-muted)' }}>This can't be undone.</p>
                        <div className="flex gap-3 justify-end">
                            <button onClick={() => setDeleteId(null)} className="px-4 py-2 text-sm" style={{ color: 'var(--fp-text-muted)' }}>
                                Cancel
                            </button>
                            <button
                                onClick={() => handleDelete(deleteId)}
                                className="px-5 py-2 text-sm font-semibold transition hover:brightness-110"
                                style={{ clipPath: cutCorners(8), background: 'rgba(239,68,68,0.2)', border: '1px solid rgba(239,68,68,0.4)', color: '#f87171' }}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="grid min-h-screen md:grid-cols-[240px_1fr]">
                {/* Sidebar */}
                <aside
                    className="border-r"
                    style={{ borderColor: 'rgba(111,149,197,0.15)', background: 'rgba(10,16,26,0.72)' }}
                >
                    <div className="px-6 py-6">
                        <Link href="/" className="inline-flex items-center gap-3 text-lg font-bold" style={{ color: 'var(--fp-text-primary)' }}>
                            <div
                                className="flex h-9 w-9 items-center justify-center text-sm font-bold"
                                style={{ clipPath: cutCorners(10), background: 'var(--fp-surface-accent)', color: 'var(--fp-button-accent)' }}
                            >
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
                                    style={
                                        item.active
                                            ? { clipPath: cutCorners(8), background: 'rgba(63,102,152,0.18)', border: '1px solid rgba(111,149,197,0.25)', color: 'var(--fp-button-accent)' }
                                            : { clipPath: cutCorners(8), color: 'var(--fp-text-muted)' }
                                    }
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </div>
                    </nav>
                </aside>

                {/* Main */}
                <section className="flex min-w-0 flex-col">
                    {/* Topbar */}
                    <div
                        className="sticky top-0 z-40 border-b px-6 py-4 backdrop-blur-md"
                        style={{ borderColor: 'rgba(111,149,197,0.15)', background: 'rgba(8,13,20,0.72)' }}
                    >
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                            <div className="w-full max-w-2xl">
                                <div
                                    className="flex items-center gap-3 px-4 py-3"
                                    style={{ clipPath: cutCorners(10), background: 'rgba(17,28,45,0.95)', border: '1px solid rgba(111,149,197,0.18)' }}
                                >
                                    <span style={{ color: 'var(--fp-text-subtle)' }}>⌕</span>
                                    <input
                                        type="text"
                                        placeholder="Search projects, skills, or roles..."
                                        className="w-full bg-transparent text-sm outline-none"
                                        style={{ color: 'var(--fp-text-primary)' }}
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                    />
                                    {search && (
                                        <button onClick={() => setSearch('')} className="text-xs" style={{ color: 'var(--fp-text-subtle)' }}>✕</button>
                                    )}
                                </div>
                            </div>
                            <div className="flex items-center gap-3 self-end lg:self-auto">
                                <Link
                                    href="/projects/new"
                                    className="px-4 py-2 text-sm font-semibold transition hover:brightness-110"
                                    style={{ clipPath: cutCorners(8), background: 'var(--fp-surface-accent)', color: 'var(--fp-button-accent)' }}
                                >
                                    + Create Project
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Body */}
                    <div className="px-6 py-8">
                        <div className="mb-8">
                            <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--fp-text-primary)' }}>
                                My Projects
                            </h1>
                            <p style={{ color: 'var(--fp-text-muted)' }}>
                                {loading
                                    ? 'Loading…'
                                    : error
                                        ? error
                                        : search
                                            ? `${filtered.length} result${filtered.length !== 1 ? 's' : ''} for "${search}"`
                                            : `${projects.length} project${projects.length !== 1 ? 's' : ''}`}
                            </p>
                        </div>

                        {loading ? (
                            <div className="grid grid-cols-1 gap-6 xl:grid-cols-3 md:grid-cols-2">
                                {Array.from({ length: 3 }).map((_, i) => (
                                    <div key={i} className="animate-pulse h-80 rounded" style={{ background: 'rgba(63,102,152,0.08)', border: '1px solid rgba(111,149,197,0.1)' }} />
                                ))}
                            </div>
                        ) : error ? (
                            <div className="text-center py-16">
                                <p className="text-4xl mb-4">⚠️</p>
                                <p className="text-lg font-semibold mb-2" style={{ color: 'var(--fp-text-primary)' }}>Backend unreachable</p>
                                <button onClick={load} className="text-sm px-4 py-2 mt-2" style={{ clipPath: cutCorners(8), background: 'var(--fp-surface-accent)', color: 'var(--fp-button-accent)' }}>
                                    Retry
                                </button>
                            </div>
                        ) : filtered.length === 0 ? (
                            <div className="text-center py-24" style={{ color: 'var(--fp-text-muted)' }}>
                                {search ? (
                                    <>
                                        <p className="text-4xl mb-4">🔍</p>
                                        <p className="text-lg font-semibold mb-1" style={{ color: 'var(--fp-text-primary)' }}>No projects match &ldquo;{search}&rdquo;</p>
                                        <p className="text-sm">Try a different search term</p>
                                    </>
                                ) : (
                                    <>
                                        <p className="text-4xl mb-4">📂</p>
                                        <p className="text-lg font-semibold mb-1" style={{ color: 'var(--fp-text-primary)' }}>No projects yet</p>
                                        <p className="text-sm mb-6">Post your first project and start building your team.</p>
                                        <Link
                                            href="/projects/new"
                                            className="inline-block px-5 py-2.5 text-sm font-semibold transition hover:brightness-110"
                                            style={{ clipPath: cutCorners(8), background: 'var(--fp-surface-accent)', color: 'var(--fp-button-accent)' }}
                                        >
                                            + Post a Project
                                        </Link>
                                    </>
                                )}
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-6 xl:grid-cols-3 md:grid-cols-2">
                                {filtered.map((project) => (
                                    <HexPanel
                                        key={project.id}
                                        fill="var(--fp-surface-primary)"
                                        cut={18}
                                        className="overflow-hidden"
                                        contentStyle={{ padding: 0 }}
                                    >
                                        <div className="flex h-full flex-col">
                                            <div className="relative h-52 w-full overflow-hidden">
                                                {project.image ? (
                                                    <img
                                                        style={{ background: 'radial-gradient(circle, rgba(0,255,255,0.1), transparent)' }}
                                                        src={project.image}
                                                        alt={project.title}
                                                        className="h-full w-full object-contain p-4 bg-black"
                                                    />
                                                ) : (
                                                    <div
                                                        className="h-full w-full bg-black"
                                                        style={{ background: 'radial-gradient(circle, rgba(0,255,255,0.1), transparent)' }}
                                                    />
                                                )}
                                                <div className="absolute right-4 top-4">
                                                    <span
                                                        className="text-xs px-3 py-1 font-medium"
                                                        style={{ clipPath: cutCorners(8), background: 'rgba(8,13,20,0.88)', border: '1px solid rgba(111,149,197,0.2)', color: 'var(--fp-text-primary)' }}
                                                    >
                                                        {project.status}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="flex flex-1 flex-col p-5">
                                                <div className="mb-4 flex flex-wrap gap-2">
                                                    {project.category.map((item) => <Tag key={item}>{item}</Tag>)}
                                                </div>

                                                <h2 className="mb-3 text-2xl font-semibold" style={{ color: 'var(--fp-text-primary)' }}>
                                                    {project.title}
                                                </h2>

                                                <p className="mb-5 text-sm leading-relaxed line-clamp-3" style={{ color: 'var(--fp-text-muted)' }}>
                                                    {project.description}
                                                </p>

                                                <div className="mb-3">
                                                    <p className="mb-2 text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--fp-text-subtle)' }}>
                                                        Open roles
                                                    </p>
                                                    <div className="flex flex-wrap gap-2">
                                                        {project.roles.map((role) => <Tag key={role}>{role}</Tag>)}
                                                    </div>
                                                </div>

                                                <div
                                                    className="mt-auto border-t pt-4 flex items-center justify-between gap-2"
                                                    style={{ borderColor: 'rgba(111,149,197,0.12)' }}
                                                >
                                                    <span className="text-sm" style={{ color: 'var(--fp-text-secondary)' }}>
                                                        {project.owner}
                                                    </span>

                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={() => setEditing(project)}
                                                            className="text-xs px-3 py-1 font-semibold transition hover:brightness-110"
                                                            style={{ clipPath: cutCorners(6), background: 'rgba(63,102,152,0.18)', border: '1px solid rgba(111,149,197,0.28)', color: 'var(--fp-button-accent)' }}
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            onClick={() => setDeleteId(project.id)}
                                                            className="text-xs px-3 py-1 font-semibold transition hover:brightness-110"
                                                            style={{ clipPath: cutCorners(6), background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171' }}
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </HexPanel>
                                ))}
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </main>
    )
}
