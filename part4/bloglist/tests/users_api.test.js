const assert = require('node:assert')
const {
  test,
  describe,
  after,
  beforeEach,
} = require('node:test')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const supertest = require('supertest')

const app = require('../app')
const User = require('../models/user')

const api = supertest(app)

const usersInDb = async () => {
  const users = await User.find({})

  return users.map(user => user.toJSON())
}

beforeEach(async () => {
  await User.deleteMany({})

  const passwordHash = await bcrypt.hash('salainen', 10)

  const user = new User({
    username: 'root',
    name: 'Pääkäyttäjä',
    passwordHash,
  })

  await user.save()
})

describe('creating a user', () => {
  test('fails if username already exists', async () => {
    const usersAtStart = await usersInDb()

    const newUser = {
      username: 'root',
      name: 'Toinen käyttäjä',
      password: 'salainen',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await usersInDb()

    assert(
      result.body.error.includes(
        'expected `username` to be unique'
      )
    )

    assert.strictEqual(
      usersAtEnd.length,
      usersAtStart.length
    )
  })

  test('fails if username is shorter than 3 characters', async () => {
    const usersAtStart = await usersInDb()

    const result = await api
      .post('/api/users')
      .send({
        username: 'ab',
        name: 'Lyhyt käyttäjänimi',
        password: 'salainen',
      })
      .expect(400)

    const usersAtEnd = await usersInDb()

    assert(result.body.error.includes('username'))
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test('fails if username is missing', async () => {
    const usersAtStart = await usersInDb()

    const result = await api
      .post('/api/users')
      .send({
        name: 'Ei käyttäjänimeä',
        password: 'salainen',
      })
      .expect(400)

    const usersAtEnd = await usersInDb()

    assert(result.body.error.includes('username'))
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test('fails if password is shorter than 3 characters', async () => {
    const usersAtStart = await usersInDb()

    const result = await api
      .post('/api/users')
      .send({
        username: 'matti',
        name: 'Matti Meikäläinen',
        password: 'ab',
      })
      .expect(400)

    const usersAtEnd = await usersInDb()

    assert(result.body.error.includes('password'))
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test('fails if password is missing', async () => {
    const usersAtStart = await usersInDb()

    const result = await api
      .post('/api/users')
      .send({
        username: 'maija',
        name: 'Maija Mäkinen',
      })
      .expect(400)

    const usersAtEnd = await usersInDb()

    assert(result.body.error.includes('password'))
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })
})

after(async () => {
  await mongoose.connection.close()
})