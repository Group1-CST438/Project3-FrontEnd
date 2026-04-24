import Link from 'next/link'
import HexPanel from '@/components/HexPanel'

const sidebarItems = [
    { label: 'Explore Projects', href: '/projects', active: true },
    { label: 'My Matches', href: '/matches' },
    { label: 'Saved', href: '/saved' },
    { label: 'My Profile', href: '/profile' },
]

const projects = [
    {
        id: 'eco-track-ai',
        title: 'EcoTrack AI',
        category: ['Sustainability', 'AI'],
        description:
            'Build an AI-powered platform that helps students and local businesses track carbon footprints using simple reporting tools and dashboards.',
        roles: ['Frontend Engineer', 'Data Scientist', 'UI Designer'],
        owner: 'Alex Rivera',
        image:
            'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80',
        status: 'New',
    },
    {
        id: 'soundscape-vr',
        title: 'SoundScape VR',
        category: ['VR', 'Accessibility'],
        description:
            'Design an immersive virtual reality experience that translates ambient sound into visual landscapes for more inclusive storytelling.',
        roles: ['Unity Developer', 'Sound Engineer', 'UX Researcher'],
        owner: 'Sarah Chen',
        image:
            'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&w=1200&q=80',
        status: 'New',
    },
    {
        id: 'localfood-connect',
        title: 'LocalFood Connect',
        category: ['Agriculture', 'E-commerce'],
        description:
            'Create a platform that connects local farmers directly with urban consumers to reduce waste and support neighborhood food networks.',
        roles: ['Mobile Developer', 'Marketing Lead', 'Backend Engineer'],
        owner: 'Marcus Johnson',
        image:
            'https://images.unsplash.com/photo-1482192505345-5655af888cc4?auto=format&fit=crop&w=1200&q=80',
        status: 'New',
    },
    {
        id: 'reelwise',
        title: 'ReelWise',
        category: ['Film', 'Analytics'],
        description:
            'Help indie filmmakers understand audience engagement with a dashboard for trailer feedback, campaign metrics, and release planning.',
        roles: ['Full Stack Developer', 'Business Analyst', 'Motion Designer'],
        owner: 'Naomi Brooks',
        image:
            'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1200&q=80',
        status: 'Featured',
    },
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

export default function ProjectsPage() {
    return (
        <main className="min-h-screen" style={{ background: 'var(--fp-bg)' }}>
            <div className="grid min-h-screen md:grid-cols-[240px_1fr]">
                {/* Sidebar */}
                <aside
                    className="border-r"
                    style={{ borderColor: 'rgba(111,149,197,0.15)', background: 'rgba(10,16,26,0.72)' }}
                >
                    <div className="px-6 py-6">
                        <Link
                            href="/"
                            className="inline-flex items-center gap-3 text-lg font-bold"
                            style={{ color: 'var(--fp-text-primary)' }}
                        >
                            <div
                                className="flex h-9 w-9 items-center justify-center text-sm font-bold"
                                style={{
                                    clipPath: cutCorners(10),
                                    background: 'var(--fp-surface-accent)',
                                    color: 'var(--fp-button-accent)',
                                }}
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
                                            ? {
                                                clipPath: cutCorners(8),
                                                background: 'rgba(63,102,152,0.18)',
                                                border: '1px solid rgba(111,149,197,0.25)',
                                                color: 'var(--fp-button-accent)',
                                            }
                                            : {
                                                clipPath: cutCorners(8),
                                                color: 'var(--fp-text-muted)',
                                            }
                                    }
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
                    <div
                        className="sticky top-0 z-40 border-b px-6 py-4 backdrop-blur-md"
                        style={{
                            borderColor: 'rgba(111,149,197,0.15)',
                            background: 'rgba(8,13,20,0.72)',
                        }}
                    >
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                            <div className="w-full max-w-2xl">
                                <div
                                    className="flex items-center gap-3 px-4 py-3"
                                    style={{
                                        clipPath: cutCorners(10),
                                        background: 'rgba(17,28,45,0.95)',
                                        border: '1px solid rgba(111,149,197,0.18)',
                                    }}
                                >
                                    <span style={{ color: 'var(--fp-text-subtle)' }}>⌕</span>
                                    <input
                                        type="text"
                                        placeholder="Search projects, skills, or roles..."
                                        className="w-full bg-transparent text-sm outline-none"
                                        style={{ color: 'var(--fp-text-primary)' }}
                                    />
                                </div>
                            </div>

                            <div className="flex items-center gap-3 self-end lg:self-auto">
                                <button
                                    className="px-4 py-2 text-sm font-medium transition hover:brightness-110"
                                    style={{
                                        clipPath: cutCorners(8),
                                        background: 'rgba(19,34,58,0.6)',
                                        border: '1px solid rgba(111,149,197,0.28)',
                                        color: 'var(--fp-text-secondary)',
                                    }}
                                >
                                    Filters
                                </button>

                                <Link
                                    href="/projects/new"
                                    className="px-4 py-2 text-sm font-semibold transition hover:brightness-110"
                                    style={{
                                        clipPath: cutCorners(8),
                                        background: 'var(--fp-surface-accent)',
                                        color: 'var(--fp-button-accent)',
                                    }}
                                >
                                    + Create Project
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Body */}
                    <div className="px-6 py-8">
                        <div className="mb-8">
                            <h1
                                className="text-3xl font-bold mb-2"
                                style={{ color: 'var(--fp-text-primary)' }}
                            >
                                Discover Projects
                            </h1>
                            <p style={{ color: 'var(--fp-text-muted)' }}>
                                Found {projects.length} projects matching your profile.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3 md:grid-cols-2">
                            {projects.map((project) => (
                                <HexPanel
                                    key={project.id}
                                    fill="var(--fp-surface-primary)"
                                    cut={18}
                                    className="overflow-hidden"
                                    contentStyle={{ padding: 0 }}
                                >
                                    <div className="flex h-full flex-col">
                                        <div className="relative h-52 w-full overflow-hidden">
                                            <img
                                                src={project.image}
                                                alt={project.title}
                                                className="h-full w-full object-cover"
                                            />
                                            <div className="absolute right-4 top-4">
                        <span
                            className="text-xs px-3 py-1 font-medium"
                            style={{
                                clipPath: cutCorners(8),
                                background: 'rgba(8,13,20,0.88)',
                                border: '1px solid rgba(111,149,197,0.2)',
                                color: 'var(--fp-text-primary)',
                            }}
                        >
                          {project.status}
                        </span>
                                            </div>
                                        </div>

                                        <div className="flex flex-1 flex-col p-5">
                                            <div className="mb-4 flex flex-wrap gap-2">
                                                {project.category.map((item) => (
                                                    <Tag key={item}>{item}</Tag>
                                                ))}
                                            </div>

                                            <h2
                                                className="mb-3 text-2xl font-semibold"
                                                style={{ color: 'var(--fp-text-primary)' }}
                                            >
                                                {project.title}
                                            </h2>

                                            <p
                                                className="mb-5 text-sm leading-relaxed"
                                                style={{ color: 'var(--fp-text-muted)' }}
                                            >
                                                {project.description}
                                            </p>

                                            <div className="mb-3">
                                                <p
                                                    className="mb-2 text-xs font-bold uppercase tracking-widest"
                                                    style={{ color: 'var(--fp-text-subtle)' }}
                                                >
                                                    Open roles
                                                </p>
                                                <div className="flex flex-wrap gap-2">
                                                    {project.roles.map((role) => (
                                                        <Tag key={role}>{role}</Tag>
                                                    ))}
                                                </div>
                                            </div>

                                            <div
                                                className="mt-auto flex items-center justify-between border-t pt-4"
                                                style={{ borderColor: 'rgba(111,149,197,0.12)' }}
                                            >
                        <span
                            className="text-sm"
                            style={{ color: 'var(--fp-text-secondary)' }}
                        >
                          {project.owner}
                        </span>

                                                <Link
                                                    href={`/projects/${project.id}`}
                                                    className="text-sm font-semibold transition hover:brightness-110"
                                                    style={{ color: 'var(--fp-button-accent)' }}
                                                >
                                                    View Details →
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </HexPanel>
                            ))}
                        </div>
                    </div>
                </section>
            </div>
        </main>
    )
}