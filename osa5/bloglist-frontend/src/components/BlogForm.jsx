import { useState } from 'react'

const BlogForm = ({ createBlog }) => {
    const [title, setTitle] = useState('')
    const [author, setAuthor] = useState('')
    const [url, setUrl] = useState('')

    const addBlog = (event) => {
        event.preventDefault()
        createBlog({
            title: title,
            author: author,
            url: url,
      })

        setTitle('')
        setAuthor('')
        setUrl('')
    }

    return (
        <div>
            <h2>create a new blog</h2>
            <form onSubmit={addBlog}>
            <div>
            Title:
            <input
                type="text"
                value={title}
                onChange={({ target }) => setTitle(target.value)}
            />
            </div>
            <div>
            Author:
            <input
                type="text"
                value={author}
                onChange={({ target }) => setAuthor(target.value)}
            />
            </div>
            <div>
            Url:
            <input
                type="text"
                value={url}
                onChange={({ target }) => setUrl(target.value)}
            />
            </div>
            <button type="submit">create</button>
            </form>
        </div>
    )
} 

export default BlogForm