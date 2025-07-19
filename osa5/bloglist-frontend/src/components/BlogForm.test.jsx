import { render, screen } from '@testing-library/react'
import BlogForm from './BlogForm'
import userEvent from '@testing-library/user-event'

test('<BlogForm /> updates parent state and calls onSubmit', async () => {
    const userTest = userEvent.setup()
    const createBlog = vi.fn()

    render(<BlogForm createBlog={createBlog} />)

    const titleInput = screen.getByPlaceholderText('write title here')
    const authorInput = screen.getByPlaceholderText('write author here')
    const urlInput = screen.getByPlaceholderText('write url here')
    const sendButton = screen.getByText('create')

    await userTest.type(titleInput, 'Test')
    await userTest.type(authorInput, 'matti')
    await userTest.type(urlInput, 'test.com')
    await userTest.click(sendButton)

    expect(createBlog.mock.calls).toHaveLength(1)
    expect(createBlog.mock.calls[0][0].title).toBe('Test')
    expect(createBlog.mock.calls[0][0].author).toBe('matti')
    expect(createBlog.mock.calls[0][0].url).toBe('test.com')
})