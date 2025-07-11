const blogsRouter = require('express').Router()
const middleware = require("../utils/middleware")
const User = require('../models/user')
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
      response.json(blogs)
})

blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  if (blog) {
    response.json(blog)
  } else {
    response.status(404).end()
  }
})

blogsRouter.post('/', middleware.userExtractor, async (request, response, next) => {
    const body = request.body
    const user = request.user

    if (!body.title) {
      return response.status(400).json({ error: 'title missing' })
    }
    if (!body.url) {
      return response.status(400).json({ error: 'url missing' })
    } else {
    const blog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes || 0,
        user: user._id
    })
    try {
      const savedBlog = await blog.save()
      user.blogs = user.blogs.concat(savedBlog._id)
      await user.save()
      response.status(201).json(savedBlog)
    } catch (error) {
      next(error)
    }
  }
})

blogsRouter.delete('/:id', middleware.userExtractor, async (request, response, next) => {
  try {
    const user = request.user
    const blog = await Blog.findById(request.params.id)

    if (!blog) {
      return response.status(404).json({ error: 'blog not found' })
    }

    if (blog.user.toString() !== user.id.toString()) {
      return response.status(401).json({ error: 'unauthorized: not the blog owner' })
    }
    await Blog.findByIdAndDelete(request.params.id)
    response.status(204).end()
    } catch (error) {
        next(error)
  }
})

blogsRouter.put('/:id', async (request, response, next) => {
  const { title, author, url, likes, user } = request.body

  const userOfBlog = await User.findById(user)

  const blog = await Blog.findById(request.params.id)
  if (!blog) {
    return response.status(404).end()
  }

  blog.title = title
  blog.author = author
  blog.url = url
  blog.likes = likes
  blog.user = userOfBlog._id

  try {
    const updatedBlog = await blog.save()
    userOfBlog.blogs = userOfBlog.blogs.concat(updatedBlog._id)
    await userOfBlog.save()
    response.json(updatedBlog)
  } catch (error) {
    next(error)
  }
}) 
  
module.exports = blogsRouter