const { test, expect, beforeEach, describe } = require('@playwright/test')

const testUsername = 'TESTUSER'
const testPassword = 'TESTPASSWORD'

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    // Reset database.
    const baseUrl = 'http://localhost:3003/api'
    await request.post(`${baseUrl}/testing/reset`)
    await request.post(`${baseUrl}/users`, {
      data: {
        name: 'Name',
        userName: testUsername,
        password: testPassword
      }
    })
    // Navigate to page.
    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {
    await expect(page.getByText('Login')).toBeVisible()
    await expect(page.getByText('Log Out')).not.toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      const textboxes = await page.getByRole('textbox').all()
      await textboxes[0].fill(testUsername)
      await textboxes[1].fill(testPassword)
      await page.getByText('Login').click()
      // Afterwards, it should no longer be on the login form.
      await expect(page.getByText('Login')).not.toBeVisible()
      await expect(page.getByText('Log Out')).toBeVisible()
    })

    test('fails with incorrect credentials', async ({ page }) => {
      const textboxes = await page.getByRole('textbox').all()
      await textboxes[0].fill(testUsername)
      await textboxes[1].fill('incorrect password dummy')
      await page.getByText('Login').click()
      // Afterwards, it should still be in the login form.
      await expect(page.getByText('Login')).toBeVisible()
      await expect(page.getByText('Log Out')).not.toBeVisible()
    })
  })
})