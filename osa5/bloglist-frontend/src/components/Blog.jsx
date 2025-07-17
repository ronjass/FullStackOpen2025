import { useState } from 'react'

const Blog = ({ blog, updateLikes, handleDelete, user }) => {
  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const deleteButton = blog.user.username === user.username

  const like = () => {
    const updatedBlog = {
      ...blog,
      likes: blog.likes + 1,
      user: blog.user.id
    }
    updateLikes(blog.id, updatedBlog)
  }

  if (visible)
    return (
      <div style={showWhenVisible}>
        <div style={blogStyle}>
          {blog.title} <button onClick={toggleVisibility}>hide</button> <br />
          {blog.url} <br />
        likes {blog.likes} <button onClick={like}>like</button> <br />
          {blog.user.name}
          {deleteButton && (
            <button onClick={() => handleDelete(blog)}>remove</button>
          )}
        </div>
      </div>

    )
  else
    return (
      <li className='blog'>
      <div style={hideWhenVisible}>
        <div style={blogStyle}>
          {blog.title}
          <button onClick={toggleVisibility}>show</button>
        </div>
      </div>
      </li>
    )
}

export default Blog