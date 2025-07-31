const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog } = require('./helper')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset')
    await request.post('/api/users', {
      data: {
        name: 'testi',
        username: 'testi',
        password: 'salainentesti'
      }
    })

    await page.goto('/')
  })

  test('Login form is shown', async ({ page }) => {
    const locator = await page.getByText('Log in to application')
    await expect(locator).toBeVisible()
    const usernameBox = await page.getByTestId('username')
    await expect(usernameBox).toBeVisible
    const passwordBox = await page.getByTestId('password')
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
        await createBlog(page, 'testiblogi', 'testi', 'testi.com')
        const infoDiv = await page.locator('.info')
        await expect(infoDiv).toContainText('a new blog testiblogi by testi added')
        const blogDiv = await page.locator('.blog')
        await expect(blogDiv.getByText('testiblogi')).toBeVisible()
    })

    test('a blog can be liked', async ({ page }) => {
        await createBlog(page, 'newblog', 'newtest', 'newtest.com')

        const blogDiv = await page.locator('.blog')
        const blogTitle = await blogDiv.getByText('newblog')
        const blogTitleElement = await blogTitle.locator('..')

        await blogTitleElement.getByRole('button', { name: 'show' }).click()

        const blogLikes = await page.getByText('likes 0')
        const blogLikesElemenet = await blogLikes.locator('..')

        await blogLikesElemenet.getByRole('button', { name: 'like' }).click()
        await expect(page.getByText('likes 1')).toBeVisible()
    })

    test('a blog can be deleted by its creator', async ({ page }) => {
        await createBlog(page, 'deleteTest', 'deleter', 'delete.com')

        const blogDiv = await page.locator('.blog')
        const blogTitle = await blogDiv.getByText('deleteTest')
        const blogTitleElement = await blogTitle.locator('..')

        await blogTitleElement.getByRole('button', { name: 'show' }).click()

        await expect(page.getByText('testi', { exact: true })).toBeVisible()

        const blogAuthor = await page.getByText('testi', { exact: true })
        const blogAuthorElemenet = await blogAuthor.locator('..')

        page.on('dialog', dialog => dialog.accept())

        await blogAuthorElemenet.getByRole('button', { name: 'remove' }).click()

        await expect(blogDiv.getByText('deleteTest')).not.toBeVisible()

    })
    })
})