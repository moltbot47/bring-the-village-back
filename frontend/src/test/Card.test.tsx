import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Card from '../components/Card'

describe('Card', () => {
  it('renders children', () => {
    render(<Card><p>Hello</p></Card>)
    expect(screen.getByText('Hello')).toBeInTheDocument()
  })

  it('applies custom style', () => {
    render(<Card style={{ maxWidth: '400px' }}><span data-testid="inner">Content</span></Card>)
    const card = screen.getByTestId('inner').closest('div')!
    expect(card.style.maxWidth).toBe('400px')
  })
})
