const assert = require('node:assert')
const {
  test,
  after,
  beforeEach,
} = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt')

const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')

const api = supertest(app)

const initialBlogs = [
  {
    title: 'Ensimmäinen testiblogi',
    author: 'Maija Mäkinen',
    url: 'https://example.com/ensimmainen',
    likes: 5,
  },
  {
    title: 'Toinen testiblogi',
    author: 'Matti Meikäläinen',
    url: 'https://example.com/toinen',
    likes: 8,
  },
]

let token

beforeEach(async () => {
  await Blog.deleteMany({})
  await User.deleteMany({})

  const passwordHash = await bcrypt.hash(
    'salasana123',
    10
  )

  const user = new User({
    username: 'testuser',
    name: 'Testi Käyttäjä',
    passwordHash,
  })

  await user.save()

  const blogs = await Blog.insertMany(
    initialBlogs.map(blog => ({
      ...blog,
      user: user._id,
    }))
  )

  user.blogs = blogs.map(blog => blog._id)
  await user.save()

  const loginResponse = await api
    .post('/api/login')
    .send({
      username: 'testuser',
      password: 'salasana123',
    })
    .expect(200)

  token = loginResponse.body.token
})

test('blogs are returned as json and correct amount', async () => {
  const response = await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)

  assert.strictEqual(
    response.body.length,
    initialBlogs.length
  )
})

test('unique identifier is named id', async () => {
  const response = await api.get('/api/blogs')

  const firstBlog = response.body[0]

  assert.ok(firstBlog.id)
  assert.strictEqual(firstBlog._id, undefined)
})

test('blogs contain creator information', async () => {
  const response = await api.get('/api/blogs')

  assert.strictEqual(
    response.body[0].user.username,
    'testuser'
  )

  assert.strictEqual(
    response.body[0].user.name,
    'Testi Käyttäjä'
  )
})

test('users contain their blogs', async () => {
  const response = await api
    .get('/api/users')
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const user = response.body.find(
    user => user.username === 'testuser'
  )

  assert.strictEqual(
    user.blogs.length,
    initialBlogs.length
  )

  const titles = user.blogs.map(blog => blog.title)

  assert(titles.includes('Ensimmäinen testiblogi'))
})

test('a valid blog can be added', async () => {
  const newBlog = {
    title: 'Uusi testiblogi',
    author: 'Liisa Lahtinen',
    url: 'https://example.com/uusi',
    likes: 10,
  }

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')

  assert.strictEqual(
    response.body.length,
    initialBlogs.length + 1
  )

  const titles = response.body.map(blog => blog.title)

  assert(titles.includes('Uusi testiblogi'))
})

test('adding a blog without token fails with 401', async () => {
  const newBlog = {
    title: 'Blogi ilman tokenia',
    author: 'Pekka Virtanen',
    url: 'https://example.com/ilman-tokenia',
    likes: 3,
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(401)

  const blogsAtEnd = await Blog.find({})

  assert.strictEqual(
    blogsAtEnd.length,
    initialBlogs.length
  )
})

test('missing likes property defaults to zero', async () => {
  const newBlog = {
    title: 'Blogi ilman tykkäyksiä',
    author: 'Antti Aaltonen',
    url: 'https://example.com/ilman-tykkayksia',
  }

  const response = await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  assert.strictEqual(response.body.likes, 0)
})

test('blog without title is not added', async () => {
  const newBlog = {
    author: 'Liisa Lahtinen',
    url: 'https://example.com/ilman-otsikkoa',
    likes: 4,
  }

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(400)

  const response = await api.get('/api/blogs')

  assert.strictEqual(
    response.body.length,
    initialBlogs.length
  )
})

test('blog without url is not added', async () => {
  const newBlog = {
    title: 'Blogi ilman osoitetta',
    author: 'Liisa Lahtinen',
    likes: 4,
  }

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(400)

  const response = await api.get('/api/blogs')

  assert.strictEqual(
    response.body.length,
    initialBlogs.length
  )
})

test('a blog can be deleted', async () => {
  const blogsAtStart = await Blog.find({})

  const blogToDelete = blogsAtStart[0]

  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .set('Authorization', `Bearer ${token}`)
    .expect(204)

  const blogsAtEnd = await Blog.find({})

  assert.strictEqual(
    blogsAtEnd.length,
    initialBlogs.length - 1
  )

  const titles = blogsAtEnd.map(blog => blog.title)

  assert(!titles.includes(blogToDelete.title))
})

test('likes of a blog can be updated', async () => {
  const blogsAtStart = await Blog.find({})

  const blogToUpdate = blogsAtStart[0]

  const response = await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .send({
      likes: 20,
    })
    .expect(200)
    .expect('Content-Type', /application\/json/)

  assert.strictEqual(response.body.likes, 20)

  const updatedBlog = await Blog.findById(blogToUpdate.id)

  assert.strictEqual(updatedBlog.likes, 20)
})

after(async () => {
  await mongoose.connection.close()
})