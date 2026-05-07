'use client'

import type React from 'react'

const CUT = 18
const BORDER = 3

function clip(cut: number) {
  return `polygon(${cut}px 0,calc(100% - ${cut}px) 0,100% ${cut}px,100% calc(100% - ${cut}px),calc(100% - ${cut}px) 100%,${cut}px 100%,0 calc(100% - ${cut}px),0 ${cut}px)`
}

interface HexPanelProps {
  children: React.ReactNode
  fill?: string
  borderColor?: string
  cut?: number
  className?: string
  style?: React.CSSProperties
  contentStyle?: React.CSSProperties
  onClick?: () => void
}

export default function HexPanel({
  children,
  fill = 'var(--fp-surface-primary)',
  borderColor = 'var(--fp-panel-border)',
  cut = CUT,
  className,
  style,
  contentStyle,
  onClick,
}: HexPanelProps) {
  const innerCut = Math.max(0, cut - BORDER)

  return (
    <div
      className={className}
      style={{ position: 'relative', display: 'flex', flexDirection: 'column', ...style }}
      onClick={onClick}
    >
      {/* Border + glow layer — fills the entire outer box */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          clipPath: clip(cut),
          background: borderColor,
          boxShadow: '0 0 20px var(--fp-panel-glow-1),0 0 44px var(--fp-panel-glow-2),0 0 76px var(--fp-panel-glow-3)',
          filter: 'drop-shadow(0 0 10px var(--fp-panel-drop-1)) drop-shadow(0 0 24px var(--fp-panel-drop-2)) drop-shadow(0 10px 18px rgba(0,0,0,0.55))',
          pointerEvents: 'none',
        }}
      />
      {/* Fill layer — flex:1 makes it stretch to match the border layer height */}
      <div
        style={{
          flex: 1,
          margin: BORDER,
          clipPath: clip(innerCut),
          background: fill,
          ...contentStyle,
        }}
      >
        {children}
      </div>
    </div>
  )
}
