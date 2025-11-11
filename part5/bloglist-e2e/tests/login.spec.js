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
      await expect(page.getByText('Failed to log in!')).toBeVisible()
      await expect(page.getByText('Login')).toBeVisible()
      await expect(page.getByText('Log Out')).not.toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      const textboxes = await page.getByRole('textbox').all()
      await textboxes[0].fill(testUsername)
      await textboxes[1].fill(testPassword)
      await page.getByText('Login').click()
      // TODO: in a real test suite, I feel like this should be conditional on "succeeds with correct credentials"
    })
    
    test('there are no blogs at first', async ({ page }) => {
      await expect(page.getByText('View')).not.toBeVisible()
    })

    test('a new blog can be created', async ({ page }) => {
      await page.getByText('Create New Blog').click()
      const textboxes = await page.getByRole('textbox').all()
      await textboxes[0].fill('NEWTITLE')
      await textboxes[1].fill('NEWAUTHOR')
      await textboxes[2].fill('NEWURL')
      await page.getByText('Create Blog').click()
      // Give it some time.
      await page.getByText('View').waitFor()
      // There should now be a blog.
      await expect(page.getByText('NEWTITLE')).toBeVisible()
      await expect(page.getByText('NEWAUTHOR')).toBeVisible()
      await expect(page.getByText('View')).toBeVisible()
    })
  })
})