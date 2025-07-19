import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

test('renders title but does not render url or likes', () => {
    const blog = {
        title: 'Test',
        author: 'matti',
        url: 'test.com',
        likes: 0,
        user: { username: 'matti', name: 'matti' },
    }

    const user = { username: 'matti' }

    render(
        <Blog 
        blog={blog} 
        user={user}
        updateLikes={() => {}}
        handleDelete={() => {}} />)
    
    const titleElement = screen.getByText('Test')
    expect(titleElement).toBeDefined()
    const urlElement = screen.queryByText('test.com')
    expect(urlElement).toBeNull()
    const likesElement = screen.queryByText('likes 0')
    expect(likesElement).toBeNull()
})

test('renders all information after clicking show-button', async () => {
    const blog = {
        title: 'Test',
        author: 'matti',
        url: 'test.com',
        likes: 0,
        user: { username: 'matti', name: 'matti' },
    }

    const user = { username: 'matti' }

    render(
        <Blog 
        blog={blog}
        user={user} 
        updateLikes={() => {}}
        handleDelete={() => {}} />
    )

    const userEventTest = userEvent.setup()
    const button = screen.getByText('show')
    await userEventTest.click(button)

    expect(screen.queryByText('test.com'))
    expect(screen.queryByText('likes 0'))
    expect(screen.queryByText('matti'))
})

test('clicking the like button twice calls event handler twice', async () => {
    const blog = {
        title: 'Test',
        author: 'matti',
        url: 'test.com',
        likes: 0,
        user: { username: 'matti', name: 'matti' },
    }

    const user = { username: 'matti' }

    const mockHandler = vi.fn()

    render(
        <Blog 
        blog={blog}
        user={user} 
        updateLikes={mockHandler}
        handleDelete={() => {}} />
    )

    const userEventTest = userEvent.setup()
    const showButton = screen.getByText('show')
    await userEventTest.click(showButton)
    const likeButton = screen.getByText('like')
    await userEventTest.click(likeButton)
    await userEventTest.click(likeButton)

    expect(mockHandler.mock.calls).toHaveLength(2)
})