import { useState } from 'react'
import PropTypes from 'prop-types'

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
            placeholder='write title here'
          />
        </div>
        <div>
            Author:
          <input
            type="text"
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
            placeholder='write author here'
          />
        </div>
        <div>
            Url:
          <input
            type="text"
            value={url}
            onChange={({ target }) => setUrl(target.value)}
            placeholder='write url here'
          />
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  )
}

BlogForm.propTypes = {
  createBlog: PropTypes.func.isRequired
}

export default BlogForm