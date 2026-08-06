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

after(async () => {
  await mongoose.connection.close()
})