import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import WaitlistForm from '../components/WaitlistForm'

describe('WaitlistForm', () => {
  it('renders all form fields', () => {
    render(<WaitlistForm />)
    expect(screen.getByLabelText('Full Name')).toBeInTheDocument()
    expect(screen.getByLabelText('Email')).toBeInTheDocument()
    expect(screen.getByLabelText('Zip Code')).toBeInTheDocument()
    expect(screen.getByLabelText("Kids' Ages")).toBeInTheDocument()
    expect(screen.getByLabelText('Chapter')).toBeInTheDocument()
    expect(screen.getByLabelText('What help do you need?')).toBeInTheDocument()
    expect(screen.getByLabelText('What can you offer?')).toBeInTheDocument()
  })

  it('renders submit button', () => {
    render(<WaitlistForm />)
    expect(screen.getByRole('button', { name: 'Join the Waitlist' })).toBeInTheDocument()
  })

  it('has Houston as default chapter', () => {
    render(<WaitlistForm />)
    const select = screen.getByLabelText('Chapter') as HTMLSelectElement
    expect(select.value).toBe('houston')
  })
})
