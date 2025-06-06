const { test, after, beforeEach } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const assert = require('assert')
const app = require('../app')
const helper = require('./test_helper')
const Blog = require('../models/blog')

const api = supertest(app)

beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('blogs are identified by id', async () => {
    const response = await api.get('/api/blogs')
    const ids = response.body.map(blog => blog.id)
    console.log(ids)

    ids.forEach(id => { 
        assert.ok(id, 'Blogilla ei id:tä')
    })
})

test('a valid blog can be added', async () => {
    const newBlog = {
        title: "blogi",
        author: 'matti',
        url: 'osoite',
        likes: 0
    }
    await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

  const titles = blogsAtEnd.map(n => n.title)
  assert(titles.includes('blogi'))
})

test('likes is zero when no value is given', async () => {
    const newBlog = {
        title: "blogi",
        author: 'matti',
        url: 'osoite'
    }
    await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

    const lastBlog = blogsAtEnd[blogsAtEnd.length - 1]
    assert(lastBlog.likes === 0)
})

test('blog without title or url is not added', async () => {
    const newBlog = {
        author: 'matti',
        likes: 11
    }

    await api.post('/api/blogs').send(newBlog).expect(400)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
})

test('blog can be deleted', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204)

    const blogsAtEnd = await helper.blogsInDb()

    const authors = blogsAtEnd.map(n => n.author)
    assert(!authors.includes(blogToDelete.author))

    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)
})

test.only('blog can be updated', async () => {
    const updatedVersion = {
        title: "React patterns",
        author: "Michael Chan",
        url: "https://reactpatterns.com/",
        likes: 100
    }
    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = blogsAtStart[0]

    await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .send(updatedVersion)
    .expect(200)
    .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()

    const updatedBlog = blogsAtEnd[0]
    assert(updatedBlog.likes === 100)
})

after(async () => {
  await mongoose.connection.close()
})