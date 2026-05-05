'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import HexPanel from '@/components/HexPanel'
import Navbar from '@/components/Navbar'
import ProjectCard from '@/components/ProjectCard'
import { fetchProjects, expressInterest, passProject } from '@/lib/api'
import type { Project, MajorTag, ProjectStatus } from '@/types/project'

type FilterMajor = MajorTag | 'all'
type FilterStatus = ProjectStatus | 'all'

const MAJOR_FILTERS: { id: FilterMajor; label: string }[] = [
  { id: 'all', label: 'All Majors' },
  { id: 'cs', label: 'CS' },
  { id: 'film', label: 'Film' },
  { id: 'business', label: 'Business' },
  { id: 'comdes', label: 'Com. Design' },
]

const STATUS_FILTERS: { id: FilterStatus; label: string }[] = [
  { id: 'all', label: 'Any Status' },
  { id: 'open', label: 'Open' },
  { id: 'in-progress', label: 'In Progress' },
]

function clip(px: number) {
  return `polygon(${px}px 0,calc(100% - ${px}px) 0,100% ${px}px,100% calc(100% - ${px}px),calc(100% - ${px}px) 100%,${px}px 100%,0 calc(100% - ${px}px),0 ${px}px)`
}

function SkeletonCard() {
  return (
    <HexPanel
      fill="var(--fp-surface-primary)"
      cut={14}
      contentStyle={{ padding: '22px 20px' }}
    >
      <div className="flex flex-col gap-3 animate-pulse">
        <div className="flex justify-between gap-2">
          <div className="h-5 w-16 rounded" style={{ background: 'rgba(111,149,197,0.15)' }} />
          <div className="h-5 w-20 rounded" style={{ background: 'rgba(111,149,197,0.15)' }} />
        </div>
        <div className="h-5 w-3/4 rounded" style={{ background: 'rgba(111,149,197,0.12)' }} />
        <div className="flex flex-col gap-2">
          <div className="h-4 w-full rounded" style={{ background: 'rgba(111,149,197,0.08)' }} />
          <div className="h-4 w-full rounded" style={{ background: 'rgba(111,149,197,0.08)' }} />
          <div className="h-4 w-2/3 rounded" style={{ background: 'rgba(111,149,197,0.08)' }} />
        </div>
        <div className="h-4 w-1/2 rounded" style={{ background: 'rgba(111,149,197,0.08)' }} />
        <div className="flex gap-3 pt-1">
          <div className="flex-1 h-9 rounded" style={{ background: 'rgba(111,149,197,0.08)' }} />
          <div className="flex-1 h-9 rounded" style={{ background: 'rgba(111,149,197,0.08)' }} />
        </div>
      </div>
    </HexPanel>
  )
}

function FilterButton({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className="px-3 py-1.5 text-xs font-medium transition-all duration-150 hover:brightness-125"
      style={{
        clipPath: clip(6),
        background: active ? 'var(--fp-surface-accent)' : 'rgba(19,34,58,0.6)',
        color: active ? 'var(--fp-button-accent)' : 'var(--fp-text-muted)',
        border: `1px solid ${active ? 'var(--fp-panel-border)' : 'rgba(111,149,197,0.25)'}`,
      }}
    >
      {children}
    </button>
  )
}

export default function DiscoverPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)

  const [majorFilter, setMajorFilter] = useState<FilterMajor>('all')
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all')

  const [interested, setInterested] = useState<Set<string>>(new Set())
  const [passed, setPassed] = useState<Set<string>>(new Set())

  const load = useCallback(async (pageNum: number, replace: boolean) => {
    try {
      if (replace) setLoading(true)
      else setLoadingMore(true)
      setError(null)
      const data = await fetchProjects(pageNum)
      setProjects((prev) => (replace ? data.projects : [...prev, ...data.projects]))
      setHasMore(data.hasMore)
      setPage(pageNum)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong loading projects.')
    } finally {
      if (replace) setLoading(false)
      else setLoadingMore(false)
    }
  }, [])

  useEffect(() => {
    load(1, true)
  }, [load])

  const handleInterest = async (id: string) => {
    const wasInterested = interested.has(id)
    setInterested((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
    if (!wasInterested) {
      try {
        await expressInterest(id)
      } catch {
        setInterested((prev) => {
          const next = new Set(prev)
          next.delete(id)
          return next
        })
      }
    }
  }

  const handlePass = async (id: string) => {
    setPassed((prev) => new Set(prev).add(id))
    try {
      await passProject(id)
    } catch {
      setPassed((prev) => {
        const next = new Set(prev)
        next.delete(id)
        return next
      })
    }
  }

  const visibleProjects = projects.filter((p) => {
    if (majorFilter !== 'all' && !p.majors.includes(majorFilter as MajorTag)) return false
    if (statusFilter !== 'all' && p.status !== statusFilter) return false
    return true
  })

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      {/* Page header */}
      <div className="max-w-6xl mx-auto w-full px-6 pt-12 pb-6">
        <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--fp-text-primary)' }}>
          Discover Projects
        </h1>
        <p className="text-base" style={{ color: 'var(--fp-text-muted)' }}>
          Find open-source style projects across disciplines and request to join.
        </p>
      </div>

      {/* Filters */}
      <div className="max-w-6xl mx-auto w-full px-6 pb-8">
        <div className="flex flex-wrap items-center gap-2">
          {MAJOR_FILTERS.map((f) => (
            <FilterButton
              key={f.id}
              active={majorFilter === f.id}
              onClick={() => setMajorFilter(f.id)}
            >
              {f.label}
            </FilterButton>
          ))}
          <div
            style={{
              width: 1,
              height: 20,
              background: 'rgba(111,149,197,0.25)',
              margin: '0 4px',
            }}
          />
          {STATUS_FILTERS.map((f) => (
            <FilterButton
              key={f.id}
              active={statusFilter === f.id}
              onClick={() => setStatusFilter(f.id)}
            >
              {f.label}
            </FilterButton>
          ))}
        </div>
      </div>

      {/* Content */}
      <main className="max-w-6xl mx-auto w-full px-6 pb-24 flex-1">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : error ? (
          <div className="flex justify-center py-24">
            <HexPanel
              fill="rgba(220,38,38,0.08)"
              borderColor="rgba(220,38,38,0.35)"
              cut={14}
              contentStyle={{ padding: '36px 48px', textAlign: 'center' }}
            >
              <p className="text-base font-semibold mb-2" style={{ color: '#f87171' }}>
                Failed to load projects
              </p>
              <p className="text-sm mb-6" style={{ color: 'var(--fp-text-muted)' }}>
                {error}
              </p>
              <button
                onClick={() => load(1, true)}
                className="px-5 py-2 text-sm font-medium transition-all hover:brightness-125"
                style={{
                  clipPath: clip(7),
                  background: 'rgba(63,102,152,0.3)',
                  color: 'var(--fp-button-accent)',
                  border: '1px solid var(--fp-panel-border)',
                }}
              >
                Try again
              </button>
            </HexPanel>
          </div>
        ) : visibleProjects.length === 0 ? (
          <div className="flex justify-center py-24">
            <HexPanel
              fill="var(--fp-surface-primary)"
              cut={14}
              contentStyle={{ padding: '40px 56px', textAlign: 'center' }}
            >
              <p className="text-4xl mb-4">🔍</p>
              <p className="text-base font-semibold mb-2" style={{ color: 'var(--fp-text-primary)' }}>
                No projects found
              </p>
              <p className="text-sm" style={{ color: 'var(--fp-text-muted)' }}>
                Try adjusting your filters or check back later.
              </p>
            </HexPanel>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 items-start">
              {visibleProjects.map((p) => (
                <ProjectCard
                  key={p.id}
                  project={p}
                  onInterest={handleInterest}
                  onPass={handlePass}
                  isInterested={interested.has(p.id)}
                  isPassed={passed.has(p.id)}
                />
              ))}
            </div>

            {hasMore && (
              <div className="flex justify-center mt-10">
                <button
                  onClick={() => load(page + 1, false)}
                  disabled={loadingMore}
                  className="px-6 py-3 text-sm font-medium transition-all duration-150 hover:brightness-125 disabled:opacity-60 disabled:cursor-not-allowed"
                  style={{
                    clipPath: clip(10),
                    background: 'rgba(19,34,58,0.6)',
                    color: 'var(--fp-text-secondary)',
                    border: '1px solid rgba(111,149,197,0.35)',
                  }}
                >
                  {loadingMore ? 'Loading…' : 'Load more projects'}
                </button>
              </div>
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer
        className="py-8 text-center text-sm"
        style={{
          color: 'var(--fp-text-subtle)',
          borderTop: '1px solid rgba(111,149,197,0.18)',
        }}
      >
        <span suppressHydrationWarning>© {new Date().getFullYear()}</span> ProjectMatch · CUNY City Tech
      </footer>
    </div>
  )
}
