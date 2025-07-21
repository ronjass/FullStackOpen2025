const { test, expect, beforeEach, describe } = require('@playwright/test')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3003/api/testing/reset')
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'matti',
        username: 'matti',
        password: 'salainen'
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
    const loginButton = await page.getByTestId('button')
    await expect(loginButton).toBeVisible
  })
})