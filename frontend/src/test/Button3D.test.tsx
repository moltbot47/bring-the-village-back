import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Button3D from '../components/Button3D'

describe('Button3D', () => {
  it('renders as a button by default', () => {
    render(<Button3D>Click Me</Button3D>)
    const btn = screen.getByRole('button', { name: 'Click Me' })
    expect(btn).toBeInTheDocument()
  })

  it('renders as a link when href is provided', () => {
    render(<Button3D href="https://example.com">Visit</Button3D>)
    const link = screen.getByRole('link', { name: 'Visit' })
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', 'https://example.com')
  })

  it('passes disabled prop', () => {
    render(<Button3D disabled>Disabled</Button3D>)
    const btn = screen.getByRole('button', { name: 'Disabled' })
    expect(btn).toBeDisabled()
  })

  it('applies type="submit"', () => {
    render(<Button3D type="submit">Submit</Button3D>)
    const btn = screen.getByRole('button', { name: 'Submit' })
    expect(btn).toHaveAttribute('type', 'submit')
  })
})
