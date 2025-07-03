import { useState } from 'react'

const Blog = ({ blog }) => {
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

  const testi = () => {
    console.log(testi)
  }

  if (visible)
    return (
    <div style={showWhenVisible}>
      <div style={blogStyle}>
        {blog.title} <button onClick={toggleVisibility}>hide</button> <br />
        {blog.url} <br />
        likes {blog.likes} <button onClick={testi}>like</button> <br />
        {blog.user.name}
      </div>
    </div>

    )
    else 
    return (
      <div style={hideWhenVisible}>
        <div style={blogStyle}>
          {blog.title}
          <button onClick={toggleVisibility}>show</button>
        </div>
      </div> 
    )
}

export default Blog