const { test, expect, beforeEach, describe } = require('@playwright/test')

const baseUrl = 'http://localhost:3003/api'
const testUsername = 'TESTUSER'
const testPassword = 'TESTPASSWORD'

const logInHelper = async (page, userName, password) => {
  const textboxes = await page.getByRole('textbox').all()
  await textboxes[0].fill(userName)
  await textboxes[1].fill(password)
  await page.getByRole('button', { name: 'Login' }).click()
}

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    // Reset database.
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
    await expect(page.getByRole('button', { name: 'Login' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Log Out' })).not.toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      const textboxes = await page.getByRole('textbox').all()
      await textboxes[0].fill(testUsername)
      await textboxes[1].fill(testPassword)
      await page.getByRole('button', { name: 'Login' }).click()
      // Afterwards, it should no longer be on the login form.
      await expect(page.getByRole('button', { name: 'Login' })).not.toBeVisible()
      await expect(page.getByRole('button', { name: 'Log Out' })).toBeVisible()
    })

    test('fails with incorrect credentials', async ({ page }) => {
      const textboxes = await page.getByRole('textbox').all()
      await textboxes[0].fill(testUsername)
      await textboxes[1].fill('incorrect password dummy')
      await page.getByRole('button', { name: 'Login' }).click()
      // Afterwards, it should still be in the login form.
      await expect(page.getByText('Failed to log in!')).toBeVisible()
      await expect(page.getByRole('button', { name: 'Login' })).toBeVisible()
      await expect(page.getByRole('button', { name: 'Log Out' })).not.toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await logInHelper(page, testUsername, testPassword)
      // TODO: in a real test suite, I feel like this should be conditional on "succeeds with correct credentials"
    })

    test('you can log out', async ({ page }) => {
      await expect(page.getByRole('button', { name: 'Log Out' })).not.toBeVisible()
      await expect(page.getByRole('button', { name: 'Login' })).toBeVisible()
      await expect(page.getByRole('button', { name: 'Log Out' })).not.toBeVisible()
    })

    test('there are no blogs at first', async ({ page }) => {
      await expect(page.getByRole('button', { name: 'View' })).not.toBeVisible()
    })

    test('a new blog can be created', async ({ page }) => {
      await page.getByRole('button', { name: 'Create New Blog' }).click()
      const textboxes = await page.getByRole('textbox').all()
      await textboxes[0].fill('NEWTITLE')
      await textboxes[1].fill('NEWAUTHOR')
      await textboxes[2].fill('NEWURL')
      await page.getByRole('button', { name: 'Create Blog' }).click()
      // Give it some time.
      await page.getByRole('button', { name: 'View' }).waitFor()
      // There should now be a blog.
      await expect(page.getByText('NEWTITLE')).toBeVisible()
      await expect(page.getByText('NEWAUTHOR')).toBeVisible()
      await expect(page.getByRole('button', { name: 'View' })).toBeVisible()
    })

    describe('And there is a blog', () => {
      beforeEach(async ({ page }) => {
        await page.getByRole('button', { name: 'Create New Blog' }).click()
        const textboxes = await page.getByRole('textbox').all()
        await textboxes[0].fill('NEWTITLE')
        await textboxes[1].fill('NEWAUTHOR')
        await textboxes[2].fill('NEWURL')
        await page.getByRole('button', { name: 'Create Blog' }).click()
        await page.getByRole('button', { name: 'View' }).waitFor()
        await page.getByRole('button', { name: 'View' }).click()
        // TODO: same story here
      })

      test('it can be liked', async ({ page }) => {
        await expect(page.getByText('likes 0')).toBeVisible()
        await page.getByRole('button', { name: 'Like' }).click()
        await page.getByText('likes 1').waitFor()
        await expect(page.getByText('likes 1')).toBeVisible()
      })

      test('it can be deleted', async ({ page }) => {
        page.on('dialog', dialog => dialog.accept())
        await page.getByRole('button', { name: 'Delete' }).click()
        // TODO: this "wait for detached" seems very flakey...
        // it's suppoedly "bad practice" but I think a static wait time would be better in this case
        await page.getByText('NEWTITLE').waitFor({ state: 'detached' })
        await expect(page.getByText('NEWTITLE')).not.toBeVisible()
      })

      test('it cannot be deleted if you are not the owner', async ({ page, request }) => {
        // Register a second user to the DB.
        const testUsername2 = testUsername + '2'
        const testPassword2 = testPassword + '2'
        await request.post(`${baseUrl}/users`, {
          data: {
            name: 'Name2',
            userName: testUsername2,
            password: testPassword2
          }
        })
        // Log out, and login to the second user.
        await page.getByRole('button', { name: 'Log Out' }).click()
        await logInHelper(page, testUsername2, testPassword2)
        // Open the blog.
        await page.getByRole('button', { name: 'View' }).waitFor()
        await page.getByRole('button', { name: 'View' }).click()
        // It should open ,but there should not be a delete button.
        await expect(page.getByText('likes 0')).toBeVisible()
        await expect(page.getByRole('button', { name: 'Delete' })).not.toBeVisible()
      })
    })
  })
})