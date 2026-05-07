import Link from 'next/link'
import HexPanel from '@/components/HexPanel'

const sidebarItems = [
    { label: 'Explore Projects', href: '/projects' },
    { label: 'My Matches', href: '/matches', active: true },
    { label: 'Saved', href: '/saved' },
    { label: 'My Profile', href: '/profile' },
]

const matches = [
    {
        id: 'mappedout',
        title: 'MappedOut',
        description:
            'A map-driven app for finding nearby car photo spots, helping users explore their area and discover visually strong locations for shoots and meetups.',
        roles: ['Mobile Developer', 'Map API Engineer', 'UX Designer'],
        owner: 'Rishabh Patel',
        image:
            'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80',
        status: 'Matched',
    },
    {
        id: 'motorRyx',
        title: 'MotorRyx',
        description:
            'Any model, any track, every lap. An application to help find drivers on any track across the world to view their lap times and their car models',
        roles: ['Web Developer', 'Cybersecurity Engineer', 'Data Scientist'],
        owner: 'MotorRyx Team',
        image:
            'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&w=1200&q=80',
        status: 'Matched',
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

export default function MatchesPage() {
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
                                        placeholder="Search projects, skills, or roles..."
                                        className="w-full bg-transparent text-sm outline-none"
                                        style={{ color: 'var(--fp-text-primary)' }}
                                    />
                                </div>
                            </div>

                            <div className="text-sm" style={{ color: 'var(--fp-text-muted)' }}>
                                Your collaboration hub
                            </div>
                        </div>
                    </div>

                    <div className="px-6 py-8">
                        <div className="mb-8">
                            <h1
                                className="text-3xl font-bold mb-2"
                                style={{ color: 'var(--fp-text-primary)' }}
                            >
                                My Matches
                            </h1>
                            <p style={{ color: 'var(--fp-text-muted)' }}>
                                You have {matches.length} new matches this week.
                            </p>
                        </div>

                        <div className="flex flex-col gap-6">
                            {matches.map((match) => (
                                <HexPanel
                                    key={match.id}
                                    fill="var(--fp-surface-primary)"
                                    cut={18}
                                    contentStyle={{ padding: 0 }}
                                >
                                    <div className="flex flex-col md:flex-row">
                                        <div className="w-full md:w-[220px] shrink-0">
                                            <img
                                                src={match.image}
                                                alt={match.title}
                                                className="h-full w-full object-cover md:min-h-[190px]"
                                            />
                                        </div>

                                        <div className="flex flex-1 flex-col p-5">
                                            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                                                <div className="flex-1">
                                                    <h2
                                                        className="text-2xl font-semibold mb-2"
                                                        style={{ color: 'var(--fp-text-primary)' }}
                                                    >
                                                        {match.title}
                                                    </h2>

                                                    <p
                                                        className="text-sm leading-relaxed mb-4"
                                                        style={{ color: 'var(--fp-text-muted)' }}
                                                    >
                                                        {match.description}
                                                    </p>

                                                    <div className="mb-4">
                                                        <p
                                                            className="mb-2 text-xs font-bold uppercase tracking-widest"
                                                            style={{ color: 'var(--fp-text-subtle)' }}
                                                        >
                                                            Matching roles
                                                        </p>
                                                        <div className="flex flex-wrap gap-2">
                                                            {match.roles.map((role) => (
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
                              {match.owner
                                  .split(' ')
                                  .map((name) => name[0])
                                  .join('')
                                  .slice(0, 2)}
                            </span>
                                                        <span>{match.owner}</span>
                                                    </div>
                                                </div>

                                                <div className="flex flex-col items-start gap-3 md:items-end md:min-w-[170px]">
                          <span
                              className="text-xs font-semibold px-3 py-1"
                              style={{
                                  clipPath: cutCorners(8),
                                  background: 'rgba(42,127,70,0.18)',
                                  border: '1px solid rgba(72,191,110,0.28)',
                                  color: '#7ee2a8',
                              }}
                          >
                            {match.status}
                          </span>

                                                    <div className="flex gap-3 pt-2">
                                                        <Link
                                                            href={`/projects/${match.id}`}
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

                                                        <Link
                                                            href={`/messages/${match.id}`}
                                                            className="px-4 py-2 text-sm font-semibold transition hover:brightness-110"
                                                            style={{
                                                                clipPath: cutCorners(8),
                                                                background: 'var(--fp-surface-accent)',
                                                                color: 'var(--fp-button-accent)',
                                                            }}
                                                        >
                                                            Send Message
                                                        </Link>
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