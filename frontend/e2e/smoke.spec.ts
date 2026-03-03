import { test, expect } from '@playwright/test'

test.describe('Landing Page', () => {
  test('loads with hero section', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('h1')).toContainText('Village')
    await expect(page).toHaveTitle(/Village/)
  })

  test('shows navigation links', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('link', { name: /sign in/i })).toBeVisible()
  })

  test('waitlist form is present', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByLabel('Full Name')).toBeVisible()
    await expect(page.getByLabel('Email')).toBeVisible()
    await expect(page.getByRole('button', { name: /join the waitlist/i })).toBeVisible()
  })

  test('feedback widget opens and closes', async ({ page }) => {
    await page.goto('/')
    const feedbackBtn = page.getByLabel('Give feedback')
    await expect(feedbackBtn).toBeVisible()

    await feedbackBtn.click()
    await expect(page.getByText('Share Feedback')).toBeVisible()

    await feedbackBtn.click()
    await expect(page.getByText('Share Feedback')).not.toBeVisible()
  })
})

test.describe('Navigation', () => {
  test('navigates to login page', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('link', { name: /sign in/i }).click()
    await expect(page).toHaveURL('/login')
    await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible()
  })

  test('navigates to register page', async ({ page }) => {
    await page.goto('/login')
    await page.getByRole('link', { name: /sign up/i }).click()
    await expect(page).toHaveURL('/register')
  })

  test('SPA routing works for direct URL access', async ({ page }) => {
    await page.goto('/login')
    await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible()
  })
})
