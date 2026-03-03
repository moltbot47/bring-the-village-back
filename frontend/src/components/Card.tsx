import { CSSProperties, ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  style?: CSSProperties
  highlighted?: boolean
}

export default function Card({ children, style, highlighted }: CardProps) {
  return (
    <div
      style={{
        background: 'var(--bg-surface)',
        border: `1.5px solid ${highlighted ? 'var(--orange)' : 'var(--border-subtle)'}`,
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-lg)',
        transition: 'border-color 0.2s, box-shadow 0.2s',
        ...(highlighted && {
          boxShadow: '0 0 0 3px var(--orange-dim)',
        }),
        ...style,
      }}
    >
      {children}
    </div>
  )
}
