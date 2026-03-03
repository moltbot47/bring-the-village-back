import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import FeedbackWidget from '../components/FeedbackWidget'

describe('FeedbackWidget', () => {
  it('renders the floating button', () => {
    render(<FeedbackWidget />)
    const btn = screen.getByLabelText('Give feedback')
    expect(btn).toBeInTheDocument()
  })

  it('opens and closes the feedback panel', () => {
    render(<FeedbackWidget />)
    const btn = screen.getByLabelText('Give feedback')

    // Open
    fireEvent.click(btn)
    expect(screen.getByText('Share Feedback')).toBeInTheDocument()

    // Close
    fireEvent.click(btn)
    expect(screen.queryByText('Share Feedback')).not.toBeInTheDocument()
  })

  it('shows category selector and textarea when open', () => {
    render(<FeedbackWidget />)
    fireEvent.click(screen.getByLabelText('Give feedback'))

    expect(screen.getByRole('combobox')).toBeInTheDocument()
    expect(screen.getByPlaceholderText("Tell us what's on your mind...")).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Send Feedback' })).toBeInTheDocument()
  })
})
