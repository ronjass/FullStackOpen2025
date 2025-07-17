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