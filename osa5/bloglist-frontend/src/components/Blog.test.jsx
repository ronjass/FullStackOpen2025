import { render, screen } from '@testing-library/react'
import Blog from './Blog'

test('renders title but does not render url or likes', () => {
    const blog = {
        title: 'Test',
        author: 'matti',
        url: 'test.com',
        likes: 0,

    }

    render(<Blog blog={blog} />)
    
    const titleElement = screen.getByText('Test')
    expect(titleElement).toBeDefined()
    const urlElement = screen.queryByText('test.com')
    expect(urlElement).toBeNull()
    const likesElement = screen.queryByText(0)
    expect(likesElement).toBeNull()
})