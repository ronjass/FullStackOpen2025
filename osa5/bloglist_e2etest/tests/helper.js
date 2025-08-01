const { expect} = require('@playwright/test')

const loginWith = async (page, username, password) => {
    await page.getByTestId('username').fill(username)
    await page.getByTestId('password').fill(password)
    await page.getByTestId('login').click()
}

const createBlog = async (page, title, author, url) => {
    await page.getByRole('button', { name: 'create new' }).click()
    await page.getByPlaceholder('write title here').fill(title)
    await page.getByPlaceholder('write author here').fill(author)
    await page.getByPlaceholder('write url here').fill(url)
    await page.getByRole('button', { name: 'create' }).click()

    const blogDiv = await page.locator('.blog')
    await expect(blogDiv.getByText(title)).toBeVisible()
}

const likeBlog = async (page, title, expectedLikes) => {
  const blog = page.locator('.blog').filter({ hasText: title })

  await blog.getByRole('button', { name: 'show' }).click()

  await blog.getByRole('button', { name: 'like' }).click()

  await expect(blog.getByText(`likes ${expectedLikes}`)).toBeVisible()

  await blog.getByRole('button', { name: 'hide' }).click()
}

export { loginWith, createBlog, likeBlog  }