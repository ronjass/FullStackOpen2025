import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import Error from './components/Error'
import blogService from './services/blogs'
import loginService from './services/login'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'
import './index.css'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [infoMessage, setInfoMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  const blogFormRef = useRef()

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const getSortedBlogs = async () => {
    const blogs =  await blogService.getAll()
    blogs.sort((a,b) => b.likes - a.likes)
    setBlogs( blogs )
  }

  useEffect(() => {
    getSortedBlogs()
  }, [])

  const addBlog = (blogObject) => {
    if (!blogObject.title || !blogObject.author || !blogObject.url) {
      setErrorMessage('Please fill in all the fields')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
      return
    }

    blogFormRef.current.toggleVisibility()

    blogService
      .create(blogObject)
      .then(returnedBlog => {
        setBlogs(blogs.concat(returnedBlog))
        setInfoMessage(
          `a new blog ${returnedBlog.title} by ${returnedBlog.author} added`
        )
        setTimeout(() => {
          setInfoMessage(null)
        }, 5000)
      })
      .catch(error => {
        setErrorMessage(
          'Failed to add blog'
        )
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
      })
  }

  const deleteBlog = (blog) => {
    const confirmDeletion = window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)
    if (!confirmDeletion)
      return

    blogService
      .remove(blog.id)
      .then(() => {
        setBlogs(blogs.filter(b => b.id !== blog.id))
        setInfoMessage(`Succesfully deleted blog ${blog.title}`)
        setTimeout(() => {
          setInfoMessage(null)
        }, 5000)
      })
      .catch(error => {
        setErrorMessage('Failed to delete blog')
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
      })
  }

  const updateLikes = (id, updatedBlog) => {
    blogService
      .update(id, updatedBlog)
      .then(returnedBlog => {
        returnedBlog.user = blogs.find(b => b.id === id).user
        const updatedBlogs = (blogs.map(blog => blog.id !== id ? blog : returnedBlog))
        updatedBlogs.sort((a, b) => b. likes - a.likes)
        setBlogs( updatedBlogs )
      })
      .catch(error => {
        setErrorMessage('Failed to update likes')
        setTimeout(() => setErrorMessage(null), 5000)
      })
  }

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password,
      })
      window.localStorage.setItem(
        'loggedBlogAppUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setErrorMessage('wrong username or password')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        username
        <input
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
        <input
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">login</button>
    </form>

  )

  const logout  = () => {
    window.localStorage.clear()
    setUser(null)
  }

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification info={infoMessage}/>
        <Error message={errorMessage}/>
        {loginForm()}
      </div>
    )
  }
  return (
    <div>
      <h2>blogs</h2>
      <Notification info={infoMessage}/>
      <Error message={errorMessage}/>
      <p>{user.name} logged in
        <button onClick={() => logout()}>logout</button>
      </p>
      <Togglable buttonLabel="create new" ref={blogFormRef}>
        <BlogForm createBlog={addBlog} />
      </Togglable>

      <div>
        {blogs.map(blog =>
          <Blog
            key={blog.id}
            blog={blog}
            user={user}
            updateLikes={updateLikes}
            handleDelete={deleteBlog}/>
        )}
      </div>
    </div>
  )
}

export default App
