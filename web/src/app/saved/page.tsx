import Link from 'next/link'
import HexPanel from '@/components/HexPanel'

const sidebarItems = [
    { label: 'Explore Projects', href: '/projects' },
    { label: 'My Matches', href: '/matches' },
    { label: 'Saved', href: '/saved', active: true },
    { label: 'My Profile', href: '/profile' },
]

const savedProjects = [
    {
        id: 'parknarc',
        title: 'ParkNarc',
        category: ['Social Networking', 'Campus Life'],
        description:
            'A student-focused app for sharing parking alerts around campus, helping drivers stay informed, avoid tickets, and make faster parking decisions.',
        roles: ['iOS Developer', 'Backend Engineer', 'Product Designer'],
        owner: 'Noe Gutierrez',
        image:
            'images/ParkNarc.webp',
        savedDate: 'Saved today',
    },
    {
        id: 'furnace-video-program',
        title: 'Furnace Teen Video Program',
        category: ['Nonprofit', 'Education'],
        description:
            'A youth-focused initiative where volunteers teach teens through video production, helping them learn new skills, explore interests, and build confidence through creative content.',
        roles: ['Video Creator', 'Editor', 'Mentor'],
        owner: 'The Furnace Teen Center',
        image:
            '/images/furnace.avif',
        savedDate: 'Saved today',
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

export default function SavedPage() {
    return (
        <main className="min-h-screen" style={{ background: 'var(--fp-bg)' }}>
            <div className="grid min-h-screen md:grid-cols-[240px_1fr]">
                <aside
                    className="border-r"
                    style={{
                        borderColor: 'rgba(111,149,197,0.15)',
                        background: 'rgba(10,16,26,0.72)',
                    }}
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

                <section className="flex min-w-0 flex-col">
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
                                        placeholder="Search saved projects..."
                                        className="w-full bg-transparent text-sm outline-none"
                                        style={{ color: 'var(--fp-text-primary)' }}
                                    />
                                </div>
                            </div>

                            <div className="text-sm" style={{ color: 'var(--fp-text-muted)' }}>
                                Keep track of projects you want to revisit
                            </div>
                        </div>
                    </div>

                    <div className="px-6 py-8">
                        <div className="mb-8">
                            <h1
                                className="text-3xl font-bold mb-2"
                                style={{ color: 'var(--fp-text-primary)' }}
                            >
                                Saved Projects
                            </h1>
                            <p style={{ color: 'var(--fp-text-muted)' }}>
                                You have {savedProjects.length} saved projects.
                            </p>
                        </div>

                        <div className="flex flex-col gap-6">
                            {savedProjects.map((project) => (
                                <HexPanel
                                    key={project.id}
                                    fill="var(--fp-surface-primary)"
                                    cut={18}
                                    contentStyle={{ padding: 0 }}
                                >
                                    <div className="flex flex-col md:flex-row">
                                        <div className="w-full md:w-[220px] shrink-0">
                                            <img
                                                style={{
                                                    background: 'radial-gradient(circle, rgba(0,255,255,0.1), transparent)'
                                                }}
                                                src={project.image}
                                                alt={project.title}
                                                className="h-full w-full object-contain p-4 bg-black"
                                            />
                                        </div>

                                        <div className="flex flex-1 flex-col p-5">
                                            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                                                <div className="flex-1">
                                                    <div className="mb-3 flex flex-wrap gap-2">
                                                        {project.category.map((item) => (
                                                            <Tag key={item}>{item}</Tag>
                                                        ))}
                                                    </div>

                                                    <h2
                                                        className="text-2xl font-semibold mb-2"
                                                        style={{ color: 'var(--fp-text-primary)' }}
                                                    >
                                                        {project.title}
                                                    </h2>

                                                    <p
                                                        className="text-sm leading-relaxed mb-4"
                                                        style={{ color: 'var(--fp-text-muted)' }}
                                                    >
                                                        {project.description}
                                                    </p>

                                                    <div className="mb-4">
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
                                                        className="inline-flex items-center gap-3 text-sm"
                                                        style={{ color: 'var(--fp-text-secondary)' }}
                                                    >
                            <span
                                className="flex h-8 w-8 items-center justify-center text-xs font-bold"
                                style={{
                                    clipPath: cutCorners(8),
                                    background: 'rgba(63,102,152,0.18)',
                                    border: '1px solid rgba(111,149,197,0.25)',
                                    color: 'var(--fp-button-accent)',
                                }}
                            >
                              {project.owner
                                  .split(' ')
                                  .map((name) => name[0])
                                  .join('')
                                  .slice(0, 2)}
                            </span>
                                                        <span>{project.owner}</span>
                                                    </div>
                                                </div>

                                                <div className="flex flex-col items-start gap-3 md:items-end md:min-w-[180px]">
                          <span
                              className="text-xs font-semibold px-3 py-1"
                              style={{
                                  clipPath: cutCorners(8),
                                  background: 'rgba(63,102,152,0.18)',
                                  border: '1px solid rgba(111,149,197,0.28)',
                                  color: 'var(--fp-button-accent)',
                              }}
                          >
                            {project.savedDate}
                          </span>

                                                    <div className="flex gap-3 pt-2">
                                                        <Link
                                                            href={`/projects/${project.id}`}
                                                            className="px-4 py-2 text-sm font-medium transition hover:brightness-110"
                                                            style={{
                                                                clipPath: cutCorners(8),
                                                                background: 'rgba(19,34,58,0.6)',
                                                                border: '1px solid rgba(111,149,197,0.28)',
                                                                color: 'var(--fp-text-secondary)',
                                                            }}
                                                        >
                                                            View Project
                                                        </Link>

                                                        <button
                                                            className="px-4 py-2 text-sm font-semibold transition hover:brightness-110"
                                                            style={{
                                                                clipPath: cutCorners(8),
                                                                background: 'var(--fp-surface-accent)',
                                                                color: 'var(--fp-button-accent)',
                                                            }}
                                                        >
                                                            Remove
                                                        </button>
                                                    </div>
                                                </div>
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