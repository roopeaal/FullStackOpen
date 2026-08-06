const assert = require('node:assert')
const {
  test,
  after,
  beforeEach,
} = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')

const app = require('../app')
const Blog = require('../models/blog')

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

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(initialBlogs)
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

test('a valid blog can be added', async () => {
  const newBlog = {
    title: 'Uusi testiblogi',
    author: 'Liisa Lahtinen',
    url: 'https://example.com/uusi',
    likes: 10,
  }

  await api
    .post('/api/blogs')
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

test('missing likes property defaults to zero', async () => {
  const newBlog = {
    title: 'Blogi ilman tykkäyksiä',
    author: 'Antti Aaltonen',
    url: 'https://example.com/ilman-tykkayksia',
  }

  const response = await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  assert.strictEqual(response.body.likes, 0)
})

after(async () => {
  await mongoose.connection.close()
})