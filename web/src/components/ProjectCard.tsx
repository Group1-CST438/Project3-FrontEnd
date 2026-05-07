'use client'

import HexPanel from '@/components/HexPanel'
import type { Project, MajorTag } from '@/types/project'

const MAJOR_LABELS: Record<MajorTag, string> = {
  cs: 'CS',
  film: 'Film',
  business: 'Business',
  comdes: 'Com. Design',
}

const MAJOR_COLORS: Record<MajorTag, { bg: string; text: string }> = {
  cs: { bg: 'rgba(46,74,115,0.55)', text: '#8fb7e0' },
  film: { bg: 'rgba(59,48,96,0.55)', text: '#b8aaee' },
  business: { bg: 'rgba(29,74,59,0.55)', text: '#7ec8a0' },
  comdes: { bg: 'rgba(74,46,29,0.55)', text: '#e0a87e' },
}

const STATUS_STYLES: Record<Project['status'], { label: string; bg: string; text: string }> = {
  open: { label: 'Open', bg: 'rgba(79,139,103,0.25)', text: '#7ec8a0' },
  'in-progress': { label: 'In Progress', bg: 'rgba(63,102,152,0.25)', text: '#8fb7e0' },
  closed: { label: 'Closed', bg: 'rgba(100,100,120,0.25)', text: '#8ea9c9' },
}

function clip(px: number) {
  return `polygon(${px}px 0,calc(100% - ${px}px) 0,100% ${px}px,100% calc(100% - ${px}px),calc(100% - ${px}px) 100%,${px}px 100%,0 calc(100% - ${px}px),0 ${px}px)`
}

interface ProjectCardProps {
  project: Project
  onInterest: (id: string) => void
  onPass: (id: string) => void
  isInterested: boolean
  isPassed: boolean
}

export default function ProjectCard({
  project,
  onInterest,
  onPass,
  isInterested,
  isPassed,
}: ProjectCardProps) {
  const status = STATUS_STYLES[project.status]
  const spotsLeft = project.spotsTotal - project.spotsFilled
  const canJoin = project.status === 'open' && spotsLeft > 0

  return (
    <div
      className="transition-opacity duration-300"
      style={{ opacity: isPassed ? 0.35 : 1, height: '100%' }}
    >
      <HexPanel
        fill="var(--fp-surface-primary)"
        borderColor={isInterested ? 'rgba(79,139,103,0.75)' : 'var(--fp-panel-border)'}
        cut={14}
        style={{ height: '100%' }}
        contentStyle={{
          padding: '22px 20px',
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
          height: '100%',
          boxSizing: 'border-box',
        }}
      >
        {/* Status + major pills */}
        <div className="flex items-start justify-between gap-2 flex-wrap">
          <span
            className="text-xs font-semibold px-2 py-0.5 shrink-0"
            style={{ clipPath: clip(4), background: status.bg, color: status.text }}
          >
            {status.label}
          </span>
          <div className="flex gap-1.5 flex-wrap justify-end">
            {project.majors.map((m) => (
              <span
                key={m}
                className="text-xs font-medium px-2 py-0.5"
                style={{
                  clipPath: clip(4),
                  background: MAJOR_COLORS[m].bg,
                  color: MAJOR_COLORS[m].text,
                }}
              >
                {MAJOR_LABELS[m]}
              </span>
            ))}
          </div>
        </div>

        {/* Title */}
        <h3
          className="text-base font-semibold leading-snug line-clamp-2"
          style={{ color: 'var(--fp-text-primary)' }}
        >
          {project.title}
        </h3>

        {/* Description */}
        <p
          className="text-sm leading-relaxed line-clamp-3"
          style={{ color: 'var(--fp-text-muted)', flex: 1 }}
        >
          {project.description}
        </p>

        {/* Owner + spots */}
        <div className="flex items-center justify-between">
          <span className="text-xs" style={{ color: 'var(--fp-text-subtle)' }}>
            by {project.ownerName}
          </span>
          <span
            className="text-xs font-medium"
            style={{ color: canJoin ? '#7ec8a0' : 'var(--fp-text-subtle)' }}
          >
            {canJoin ? `${spotsLeft} spot${spotsLeft !== 1 ? 's' : ''} left` : 'Full'}
          </span>
        </div>

        {/* Tags */}
        {project.tags.length > 0 && (
          <div className="flex gap-1.5 flex-wrap">
            {project.tags.slice(0, 4).map((tag) => (
              <span
                key={tag}
                className="text-xs px-2 py-0.5"
                style={{
                  clipPath: clip(3),
                  background: 'rgba(111,149,197,0.1)',
                  color: 'var(--fp-text-subtle)',
                  border: '1px solid rgba(111,149,197,0.18)',
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Pass / Interest buttons */}
        <div className="flex gap-3 pt-1">
          <button
            onClick={() => onPass(project.id)}
            disabled={isPassed || isInterested}
            className="flex-1 text-sm font-medium transition-all duration-150 hover:brightness-125 disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              clipPath: clip(8),
              background: isPassed ? 'rgba(220,38,38,0.25)' : 'rgba(220,38,38,0.1)',
              color: isPassed ? '#f87171' : '#dc2626',
              border: '1px solid rgba(220,38,38,0.25)',
              padding: '8px 0',
            }}
          >
            {isPassed ? 'Passed' : '✕  Pass'}
          </button>
          <button
            onClick={() => onInterest(project.id)}
            disabled={isPassed || !canJoin}
            className="flex-1 text-sm font-medium transition-all duration-150 hover:brightness-125 disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              clipPath: clip(8),
              background: isInterested ? 'rgba(79,139,103,0.35)' : 'rgba(79,139,103,0.12)',
              color: isInterested ? '#7ec8a0' : '#4f8b67',
              border: `1px solid ${isInterested ? 'rgba(79,139,103,0.5)' : 'rgba(79,139,103,0.22)'}`,
              padding: '8px 0',
            }}
          >
            {isInterested ? '✓  Interested' : '✓  Interested'}
          </button>
        </div>
      </HexPanel>
    </div>
  )
}
