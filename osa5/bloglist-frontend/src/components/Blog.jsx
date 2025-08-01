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
    if (!blog.user || !blog.user.id) {
      console.error('Blog has no user.id', blog)
      return
    }
  
    const updatedBlog = {
      ...blog,
      likes: blog.likes + 1,
      user: blog.user.id
    }
    updateLikes(blog.id, updatedBlog)
  }

  return (
    <div className="blog">
      {visible ? (
        <div style={blogStyle}>
          <span>{blog.title}</span> <button onClick={toggleVisibility}>hide</button> <br />
          <span>{blog.url}</span><br />
          <span>likes {blog.likes}</span> <button onClick={like}>like</button> <br />
          <span>{blog.user.name}</span>
          {deleteButton && (
            <button onClick={() => handleDelete(blog)}>remove</button>
          )}
        </div>
      ) : (
        <div style={blogStyle}>
          <span>{blog.title}</span>
          <button onClick={toggleVisibility}>show</button>
        </div>
      )}
    </div>
  )
}

export default Blog