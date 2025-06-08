const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const supertest = require('supertest')
const assert = require('assert')
const app = require('../app')
const helper = require('./test_helper')
const Blog = require('../models/blog')
const User = require('../models/user')

const api = supertest(app)

describe('when there is initially some notes saved', () => {
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

    test('blog can be updated', async () => {
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
    })

describe('when there is initially one user at db', () => {
    beforeEach(async () => {
      await User.deleteMany({})
  
      const passwordHash = await bcrypt.hash('sekret', 10)
      const user = new User({ username: 'root', passwordHash })
  
      await user.save()
    })
  
    test('creation succeeds with a fresh username', async () => {
      const usersAtStart = await helper.usersInDb()
  
      const newUser = {
        username: 'mluukkai',
        name: 'Matti Luukkainen',
        password: 'salainen'
      }
  
      await api
        .post('/api/users')
        .send(newUser)
        .expect(201)
        .expect('Content-Type', /application\/json/)
  
      const usersAtEnd = await helper.usersInDb()
      assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)
  
      const usernames = usersAtEnd.map(u => u.username)
      assert(usernames.includes(newUser.username))
    })
  
    test('creation fails with proper statuscode and message if username already taken', async () => {
      const usersAtStart = await helper.usersInDb()
  
      const newUser = {
        username: 'root',
        name: 'Superuser',
        password: 'salainen'
      }
  
      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)
  
      const usersAtEnd = await helper.usersInDb()
      assert(result.body.error.includes('expected `username` to be unique'))
  
      assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    })
  })

  test('creation fails with proper statuscode and message if username is missing', async () => {
    const usersAtStart = await helper.usersInDb()
  
      const newUser = {
        username: '',
        name: 'Superuser',
        password: 'salainen'
      }
  
      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)
  
      const usersAtEnd = await helper.usersInDb()
      assert(result.body.error.includes('User validation failed: username: Path `username` is required.'))
  
      assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test('creation fails with proper statuscode and message if username too short', async () => {
    const usersAtStart = await helper.usersInDb()
  
      const newUser = {
        username: 'sa',
        name: 'Superuser',
        password: 'salainen'
      }
  
      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)
  
      const usersAtEnd = await helper.usersInDb()
      assert(result.body.error.includes('User validation failed: username: Path `username` (`sa`) is shorter than the minimum allowed length (3).'))
  
      assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test('creation fails with proper statuscode and message if password is missing or too short', async () => {
    const usersAtStart = await helper.usersInDb()
  
      const newUser = {
        username: 'testi',
        name: 'Superuser',
        password: ''
      }
  
      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)
  
      const usersAtEnd = await helper.usersInDb()
      assert(result.body.error.includes('password is too short'))
  
      assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })
  

after(async () => {
  await mongoose.connection.close()
})