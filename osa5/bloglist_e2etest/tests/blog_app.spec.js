const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith } = require('./helper')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3003/api/testing/reset')
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'testi',
        username: 'testi',
        password: 'salainentesti'
      }
    })

    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {
    const locator = await page.getByText('Log in to application')
    await expect(locator).toBeVisible()
    const usernameBox = await page.getByTestId('username')
    await expect(usernameBox).toBeVisible
    const passwordBox = await page.getByTestId('username')
    await expect(passwordBox).toBeVisible
    const loginButton = await page.getByTestId('login')
    await expect(loginButton).toBeVisible
  })

describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'testi', 'salainentesti')

      await expect(page.getByText('testi logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
        await loginWith(page, 'testi', 'testi')

        const errorDiv = await page.locator('.error')
        await expect(errorDiv).toContainText('wrong username or password')
        await expect(errorDiv).toHaveCSS('border-style', 'solid')
        await expect(errorDiv).toHaveCSS('color', 'rgb(255, 0, 0)')
        await expect(page.getByText('testi logged in')).not.toBeVisible()
    })
  })

describe('When logged in', () => {
    beforeEach(async ({ page }) => {
        await loginWith(page, 'testi', 'salainentesti')
    })

    test('a new blog can be created', async ({ page }) => {
        await page.getByRole('button', { name: 'create new' }).click()
        await page.getByPlaceholder('write title here').fill('testiblogi')
        await page.getByPlaceholder('write author here').fill('testi')
        await page.getByPlaceholder('write url here').fill('testi.com')
        await page.getByRole('button', { name: 'create' }).click()
        await expect(page.getByText('testiblogi ')).toBeVisible()
    })
    })
})