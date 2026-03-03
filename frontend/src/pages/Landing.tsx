import { useEffect, useState } from 'react'
import Button3D from '../components/Button3D'
import Card from '../components/Card'
import WaitlistForm from '../components/WaitlistForm'
import { getWaitlistCount, getDonationStats } from '../api/client'

const ZEFFY_URLS = {
  founding_member: import.meta.env.VITE_ZEFFY_FOUNDING_MEMBER_URL || '#support',
  patron: import.meta.env.VITE_ZEFFY_PATRON_URL || '#support',
  champion: import.meta.env.VITE_ZEFFY_CHAMPION_URL || '#support',
  builder: import.meta.env.VITE_ZEFFY_BUILDER_URL || '#support',
}

const tiers = [
  {
    key: 'founding_member',
    name: 'Founding Member',
    amount: 25,
    perks: 'First year free when we launch',
    icon: '🌱',
  },
  {
    key: 'patron',
    name: 'Village Patron',
    amount: 50,
    perks: 'Name on our website + free first year',
    icon: '🤝',
  },
  {
    key: 'champion',
    name: 'Village Champion',
    amount: 100,
    perks: 'Early access + input on features',
    icon: '⭐',
    highlighted: true,
  },
  {
    key: 'builder',
    name: 'Village Builder',
    amount: 250,
    perks: 'Lifetime membership + founding team access',
    icon: '🏗️',
  },
]

const steps = [
  {
    number: '01',
    title: 'Sign Up & Tell Us Your Needs',
    description: 'Share what kind of help you need and what you can offer. We match based on proximity, kids\' ages, and compatibility.',
    icon: '📝',
  },
  {
    number: '02',
    title: 'Get Matched Locally',
    description: 'We connect you with nearby single parents who complement your needs. Meet up, vibe check, build trust.',
    icon: '🔗',
  },
  {
    number: '03',
    title: 'Support Each Other',
    description: 'Swap childcare, help with chores, study together. Give time, get time back. That\'s the village.',
    icon: '💛',
  },
]

export default function Landing() {
  const [waitlistCount, setWaitlistCount] = useState<number | null>(null)
  const [donationStats, setDonationStats] = useState<{ total_raised: number; donor_count: number } | null>(null)

  useEffect(() => {
    getWaitlistCount().then(res => setWaitlistCount(res.data.count)).catch(() => {})
    getDonationStats().then(res => setDonationStats(res.data)).catch(() => {})
  }, [])

  return (
    <>
      {/* ===================== HERO ===================== */}
      <section
        style={{
          padding: 'var(--space-3xl) var(--space-lg)',
          textAlign: 'center',
          background: 'linear-gradient(180deg, var(--bg-surface) 0%, var(--bg) 100%)',
        }}
      >
        <div className="container" style={{ maxWidth: '800px' }}>
          <p
            style={{
              display: 'inline-block',
              padding: '6px 16px',
              background: 'var(--orange-dim)',
              color: 'var(--orange-border)',
              borderRadius: 'var(--radius-full)',
              fontSize: '13px',
              fontWeight: 600,
              marginBottom: 'var(--space-lg)',
              border: '1px solid rgba(235, 157, 42, 0.25)',
            }}
          >
            Launching in Houston, TX
          </p>

          <h1 style={{ marginBottom: 'var(--space-lg)' }}>
            Bring the Village Back
          </h1>

          <p
            style={{
              fontSize: 'clamp(1.1rem, 2.5vw, 1.35rem)',
              color: 'var(--text)',
              maxWidth: '600px',
              margin: '0 auto var(--space-xl)',
              lineHeight: 1.6,
            }}
          >
            A community where single parents match with each other to share childcare,
            household help, and mutual support. Because no one should have to do it alone.
          </p>

          <div style={{ display: 'flex', gap: 'var(--space-md)', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button3D href="#waitlist" size="lg">
              Join the Waitlist
            </Button3D>
            <Button3D href="#support" size="lg" variant="secondary">
              Become a Founding Supporter
            </Button3D>
          </div>

          {(waitlistCount !== null || donationStats !== null) && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                gap: 'var(--space-xl)',
                marginTop: 'var(--space-xl)',
                flexWrap: 'wrap',
              }}
            >
              {waitlistCount !== null && (
                <div>
                  <p className="mono" style={{ fontSize: '32px', fontWeight: 800, color: 'var(--text-strong)' }}>
                    {waitlistCount}
                  </p>
                  <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Parents waiting</p>
                </div>
              )}
              {donationStats !== null && (
                <div>
                  <p className="mono" style={{ fontSize: '32px', fontWeight: 800, color: 'var(--text-strong)' }}>
                    ${donationStats.total_raised.toLocaleString()}
                  </p>
                  <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Raised by {donationStats.donor_count} supporters</p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* ===================== THE PROBLEM ===================== */}
      <section style={{ padding: 'var(--space-3xl) var(--space-lg)', background: 'var(--bg)' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <h2 style={{ textAlign: 'center', marginBottom: 'var(--space-xl)' }}>
            The Problem We're Solving
          </h2>

          <Card style={{ marginBottom: 'var(--space-lg)', padding: 'var(--space-xl)' }}>
            <p style={{ fontSize: '18px', lineHeight: 1.8, color: 'var(--text)', fontStyle: 'italic', marginBottom: 'var(--space-md)' }}>
              "A mother was called to interview at McDonald's. She was jobless, barely making it.
              She couldn't find a single person to watch her child — so she left her kid in the car.
              She got arrested."
            </p>
            <p style={{ fontSize: '15px', color: 'var(--text-muted)' }}>
              She didn't need a nanny service. She needed <strong style={{ color: 'var(--text-strong)' }}>one person</strong> to
              watch her child for 30 minutes. That's a village problem — and we're building the solution.
            </p>
          </Card>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-md)' }}>
            <Card>
              <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                <strong style={{ color: 'var(--text-strong)', display: 'block', marginBottom: '4px' }}>
                  They can't afford childcare
                </strong>
                "Just pay for a nanny" — but that costs $15-25/hr. Single parents working hourly jobs
                don't have that margin.
              </p>
            </Card>

            <Card>
              <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                <strong style={{ color: 'var(--text-strong)', display: 'block', marginBottom: '4px' }}>
                  They don't have family nearby
                </strong>
                Mom's still working. She can't retire. Grandparents are in another state.
                There's no built-in support system.
              </p>
            </Card>

            <Card>
              <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                <strong style={{ color: 'var(--text-strong)', display: 'block', marginBottom: '4px' }}>
                  They're isolated
                </strong>
                Everyone's in their own stage of life. Finding friends who understand the single-parent
                grind feels impossible.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* ===================== HOW IT WORKS ===================== */}
      <section id="how-it-works" style={{ padding: 'var(--space-3xl) var(--space-lg)', background: 'var(--bg-surface)' }}>
        <div className="container" style={{ maxWidth: '900px' }}>
          <h2 style={{ textAlign: 'center', marginBottom: 'var(--space-sm)' }}>
            How It Works
          </h2>
          <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: 'var(--space-xl)', maxWidth: '500px', margin: '0 auto var(--space-xl)' }}>
            Mutual support, locally matched. Give time, get time back.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 'var(--space-lg)' }}>
            {steps.map(step => (
              <div key={step.number} style={{ textAlign: 'center' }}>
                <div
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: 'var(--radius-full)',
                    background: 'var(--orange-dim)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto var(--space-md)',
                    fontSize: '28px',
                  }}
                >
                  {step.icon}
                </div>
                <p
                  className="mono"
                  style={{
                    fontSize: '12px',
                    fontWeight: 600,
                    color: 'var(--orange)',
                    marginBottom: '4px',
                  }}
                >
                  STEP {step.number}
                </p>
                <h3 style={{ marginBottom: 'var(--space-sm)' }}>{step.title}</h3>
                <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== USE CASES ===================== */}
      <section style={{ padding: 'var(--space-3xl) var(--space-lg)', background: 'var(--bg)' }}>
        <div className="container" style={{ maxWidth: '900px' }}>
          <h2 style={{ textAlign: 'center', marginBottom: 'var(--space-sm)' }}>
            What the Village Looks Like
          </h2>
          <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: 'var(--space-xl)', maxWidth: '500px', margin: '0 auto var(--space-xl)' }}>
            Real scenarios. Real help. Real community.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-md)' }}>
            <Card>
              <p style={{ fontSize: '20px', marginBottom: 'var(--space-sm)' }}>📚</p>
              <h3 style={{ fontSize: '16px', marginBottom: 'var(--space-sm)' }}>Study Time Swap</h3>
              <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                "I'm finishing my online degree. Maria watches my kids Tuesday nights
                while I study. I watch hers on Saturday mornings so she can meal prep."
              </p>
            </Card>

            <Card>
              <p style={{ fontSize: '20px', marginBottom: 'var(--space-sm)' }}>🏠</p>
              <h3 style={{ fontSize: '16px', marginBottom: 'var(--space-sm)' }}>Mother's Helper</h3>
              <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                "After work I'm exhausted. James comes over and handles dishes and laundry
                while I do bedtime with the kids. Next week, I help him the same way."
              </p>
            </Card>

            <Card>
              <p style={{ fontSize: '20px', marginBottom: 'var(--space-sm)' }}>🎪</p>
              <h3 style={{ fontSize: '16px', marginBottom: 'var(--space-sm)' }}>Group Playdates</h3>
              <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                "Our village chapter does zoo days, park meetups, and potlucks.
                The kids have friends. We have community. Nobody's alone."
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* ===================== FOUNDING SUPPORTER TIERS ===================== */}
      <section id="support" style={{ padding: 'var(--space-3xl) var(--space-lg)', background: 'var(--bg-surface)' }}>
        <div className="container" style={{ maxWidth: '1000px' }}>
          <h2 style={{ textAlign: 'center', marginBottom: 'var(--space-sm)' }}>
            Become a Founding Supporter
          </h2>
          <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: 'var(--space-xl)', maxWidth: '550px', margin: '0 auto var(--space-xl)' }}>
            100% of donations go to building this platform and sponsoring parents who can't afford membership.
            Powered by Zeffy — zero processing fees.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-md)' }}>
            {tiers.map(tier => (
              <Card key={tier.key} highlighted={tier.highlighted} style={{ textAlign: 'center', display: 'flex', flexDirection: 'column' }}>
                <p style={{ fontSize: '32px', marginBottom: 'var(--space-sm)' }}>{tier.icon}</p>
                <h3 style={{ fontSize: '16px', marginBottom: '4px' }}>{tier.name}</h3>
                <p className="mono" style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-strong)', margin: 'var(--space-sm) 0' }}>
                  ${tier.amount}
                </p>
                <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: 'var(--space-md)', flex: 1 }}>
                  {tier.perks}
                </p>
                <Button3D
                  href={ZEFFY_URLS[tier.key as keyof typeof ZEFFY_URLS]}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant={tier.highlighted ? 'primary' : 'secondary'}
                  size="md"
                  style={{ width: '100%' }}
                >
                  Support — ${tier.amount}
                </Button3D>
              </Card>
            ))}
          </div>

          <div
            style={{
              textAlign: 'center',
              marginTop: 'var(--space-xl)',
              padding: 'var(--space-lg)',
              background: 'var(--bg-accent)',
              borderRadius: 'var(--radius-lg)',
            }}
          >
            <h3 style={{ fontSize: '16px', marginBottom: 'var(--space-sm)' }}>
              Where Your Money Goes
            </h3>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                gap: 'var(--space-xl)',
                flexWrap: 'wrap',
                fontSize: '14px',
                color: 'var(--text-muted)',
              }}
            >
              <span><strong>40%</strong> Platform Operations</span>
              <span><strong>30%</strong> Sponsorship Pool</span>
              <span><strong>20%</strong> Community Events</span>
              <span><strong>10%</strong> Reserve Fund</span>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== WAITLIST FORM ===================== */}
      <section id="waitlist" style={{ padding: 'var(--space-3xl) var(--space-lg)', background: 'var(--bg)' }}>
        <div className="container" style={{ maxWidth: '700px' }}>
          <h2 style={{ textAlign: 'center', marginBottom: 'var(--space-sm)' }}>
            Join the Village
          </h2>
          <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: 'var(--space-xl)', maxWidth: '500px', margin: '0 auto var(--space-xl)' }}>
            Sign up to be matched with local parents when we launch.
            It's free. No spam. Just community.
          </p>

          <Card style={{ padding: 'var(--space-xl)' }}>
            <WaitlistForm />
          </Card>
        </div>
      </section>

      {/* ===================== FINAL CTA ===================== */}
      <section
        style={{
          padding: 'var(--space-3xl) var(--space-lg)',
          background: 'var(--bg-dark)',
          textAlign: 'center',
        }}
      >
        <div className="container" style={{ maxWidth: '600px' }}>
          <h2 style={{ color: 'var(--bg-surface)', marginBottom: 'var(--space-md)' }}>
            It takes a village to raise a child.
          </h2>
          <p style={{ color: 'var(--text-faint)', fontSize: '18px', marginBottom: 'var(--space-xl)', lineHeight: 1.6 }}>
            Let's build that village — together.
          </p>
          <div style={{ display: 'flex', gap: 'var(--space-md)', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button3D href="#waitlist" size="lg">
              Join the Waitlist
            </Button3D>
            <Button3D href="#support" size="lg" variant="secondary">
              Support the Mission
            </Button3D>
          </div>
        </div>
      </section>
    </>
  )
}
