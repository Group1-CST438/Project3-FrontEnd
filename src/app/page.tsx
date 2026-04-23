import HexPanel from '@/components/HexPanel'

const majors = [
  {
    id: 'cs',
    label: 'Computer Science',
    icon: '⌨️',
    description: 'Software tools, apps, research projects, and open-source initiatives.',
    fill: 'linear-gradient(180deg,#2e4a73 0%,#1c3050 100%)',
  },
  {
    id: 'film',
    label: 'Film',
    icon: '🎬',
    description: 'Short films, documentaries, screenplays, and collaborative productions.',
    fill: 'linear-gradient(180deg,#3b3060 0%,#1e1a38 100%)',
  },
  {
    id: 'business',
    label: 'Business',
    icon: '📊',
    description: 'Startups, case studies, market research, and consulting ventures.',
    fill: 'linear-gradient(180deg,#1d4a3b 0%,#122c24 100%)',
  },
  {
    id: 'comdes',
    label: 'Communication Design',
    icon: '🎨',
    description: 'Brand identities, UI/UX work, motion graphics, and visual campaigns.',
    fill: 'linear-gradient(180deg,#4a2e1d 0%,#2c1a10 100%)',
  },
]

const steps = [
  { step: '01', title: 'Post your project', body: 'Describe your idea, the skills you need, and your timeline. Open it up like an open-source repo.' },
  { step: '02', title: 'Get matched', body: 'Students from other majors find your project and request to join based on what they bring to the table.' },
  { step: '03', title: 'Build real work', body: 'Collaborate outside the classroom, ship something tangible, and add it to your portfolio.' },
]

/* Shared clip-path helper — cuts all 8 corners */
function cutCorners(px: number) {
  return `polygon(${px}px 0,calc(100% - ${px}px) 0,100% ${px}px,100% calc(100% - ${px}px),calc(100% - ${px}px) 100%,${px}px 100%,0 calc(100% - ${px}px),0 ${px}px)`
}

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">

      {/* ── Navbar ──────────────────────────────────────────────────────── */}
      <nav
        className="sticky top-0 z-50 backdrop-blur-md"
        style={{
          background: 'rgba(8,13,20,0.72)',
          borderBottom: '1px solid rgba(111,149,197,0.25)',
          clipPath: cutCorners(0), /* flat top edges, small cut bottom corners handled by border */
        }}
      >
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <span
            className="text-lg font-bold tracking-tight"
            style={{ color: 'var(--fp-text-primary)' }}
          >
            ProjectMatch
          </span>

          <div className="flex items-center gap-3">
            {/* Ghost button */}
            <button
              className="px-4 py-1.5 text-sm font-medium transition-colors hover:brightness-110"
              style={{
                color: 'var(--fp-text-muted)',
                clipPath: cutCorners(6),
                background: 'transparent',
                border: 'none',
              }}
            >
              Log in
            </button>

            {/* Accent button with cut corners */}
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
              <button
                className="relative px-4 py-1.5 text-sm font-semibold transition-all hover:brightness-110"
                style={{
                  margin: 2,
                  clipPath: cutCorners(6),
                  background: 'var(--fp-surface-accent)',
                  color: 'var(--fp-button-accent)',
                }}
              >
                Sign up
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="flex flex-col items-center text-center px-6 pt-24 pb-20">
        {/* Tag pill */}
        <div
          className="inline-block px-3 py-1 mb-6 text-xs font-semibold uppercase tracking-widest"
          style={{
            clipPath: cutCorners(6),
            background: 'rgba(63,102,152,0.22)',
            border: '1px solid var(--fp-panel-border)',
            color: 'var(--fp-button-accent)',
          }}
        >
          Open-source style · Cross-disciplinary · CUNY City Tech
        </div>

        <h1
          className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight max-w-3xl mb-6"
          style={{ color: 'var(--fp-text-primary)' }}
        >
          Real projects.{' '}
          <span style={{ color: 'var(--fp-button-accent)' }}>Real experience.</span>
        </h1>

        <p className="text-lg max-w-xl mb-10 leading-relaxed" style={{ color: 'var(--fp-text-muted)' }}>
          ProjectMatch connects students across CS, Film, Business, and Communication Design with open-source-style projects — so you can build hands-on experience, grow your portfolio, and develop skills that matter outside the classroom.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          {/* Primary CTA */}
          <HexPanel
            fill="var(--fp-surface-accent)"
            cut={10}
            className="cursor-pointer transition-all duration-150 hover:brightness-125"
            contentStyle={{ padding: '12px 28px' }}
          >
            <span className="text-base font-semibold" style={{ color: 'var(--fp-text-primary)' }}>
              Post a Project
            </span>
          </HexPanel>

          {/* Secondary CTA */}
          <HexPanel
            fill="rgba(19,34,58,0.6)"
            borderColor="rgba(111,149,197,0.45)"
            cut={10}
            className="cursor-pointer transition-all duration-150 hover:brightness-125"
            contentStyle={{ padding: '12px 28px' }}
          >
            <span className="text-base font-semibold" style={{ color: 'var(--fp-text-secondary)' }}>
              Browse Projects
            </span>
          </HexPanel>
        </div>
      </section>

      {/* ── Majors grid ──────────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto w-full px-6 pb-24">
        <p
          className="text-center text-xs font-bold uppercase tracking-widest mb-10"
          style={{ color: 'var(--fp-text-subtle)' }}
        >
          Explore by major
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {majors.map((m) => (
            <HexPanel
              key={m.id}
              fill={m.fill}
              cut={14}
              className="cursor-pointer transition-all duration-150 hover:brightness-125 hover:scale-[1.02]"
              contentStyle={{ padding: '24px 20px' }}
            >
              <div className="text-3xl mb-4">{m.icon}</div>
              <h3 className="text-base font-semibold mb-2" style={{ color: 'var(--fp-text-primary)' }}>
                {m.label}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--fp-text-muted)' }}>
                {m.description}
              </p>
            </HexPanel>
          ))}
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────────────────────── */}
      <section className="max-w-4xl mx-auto w-full px-6 pb-28 text-center">
        <h2 className="text-2xl font-bold mb-14" style={{ color: 'var(--fp-text-primary)' }}>
          How it works
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
          {steps.map((item) => (
            <div key={item.step} className="flex flex-col items-center gap-4">
              {/* Step badge with cut corners */}
              <HexPanel
                fill="var(--fp-surface-accent)"
                cut={8}
                style={{ width: 44, height: 44, flexShrink: 0 }}
                contentStyle={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <span className="text-sm font-bold" style={{ color: 'var(--fp-button-accent)' }}>
                  {item.step}
                </span>
              </HexPanel>

              <h3 className="text-base font-semibold" style={{ color: 'var(--fp-text-primary)' }}>
                {item.title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--fp-text-muted)' }}>
                {item.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA banner ───────────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto w-full px-6 pb-24">
        <HexPanel
          fill="var(--fp-surface-primary)"
          cut={20}
          contentStyle={{ padding: '56px 40px', textAlign: 'center' }}
        >
          <h2 className="text-2xl sm:text-3xl font-bold mb-4" style={{ color: 'var(--fp-text-primary)' }}>
            Stop waiting for class assignments.
          </h2>
          <p className="mb-8 text-base" style={{ color: 'var(--fp-text-muted)' }}>
            Join ProjectMatch and start building the kind of work that actually shows what you can do.
          </p>
          <div className="flex justify-center">
            <HexPanel
              fill="var(--fp-surface-accent)"
              cut={10}
              className="cursor-pointer transition-all duration-150 hover:brightness-125"
              contentStyle={{ padding: '14px 32px' }}
            >
              <span className="text-base font-semibold" style={{ color: 'var(--fp-text-primary)' }}>
                Get Started — it&apos;s free
              </span>
            </HexPanel>
          </div>
        </HexPanel>
      </section>

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <footer
        className="py-8 text-center text-sm"
        style={{ color: 'var(--fp-text-subtle)', borderTop: '1px solid rgba(111,149,197,0.18)' }}
      >
        <span suppressHydrationWarning>© {new Date().getFullYear()}</span> ProjectMatch · CUNY City Tech
      </footer>
    </div>
  )
}
