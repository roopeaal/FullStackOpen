const { test, describe } = require('node:test')
const assert = require('node:assert')

const listHelper = require('../utils/list_helper')

test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)

  assert.strictEqual(result, 1)
})

describe('total likes', () => {
  test('of empty list is zero', () => {
    const blogs = []

    assert.strictEqual(listHelper.totalLikes(blogs), 0)
  })

  test('when list has only one blog, equals its likes', () => {
    const blogs = [
      {
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'https://example.com/dijkstra',
        likes: 5,
      },
    ]

    assert.strictEqual(listHelper.totalLikes(blogs), 5)
  })

  test('of a larger list is calculated correctly', () => {
    const blogs = [
      {
        title: 'Ensimmäinen blogi',
        author: 'Matti Meikäläinen',
        url: 'https://example.com/1',
        likes: 5,
      },
      {
        title: 'Toinen blogi',
        author: 'Maija Mäkinen',
        url: 'https://example.com/2',
        likes: 12,
      },
      {
        title: 'Kolmas blogi',
        author: 'Teemu Testaaja',
        url: 'https://example.com/3',
        likes: 3,
      },
    ]

    assert.strictEqual(listHelper.totalLikes(blogs), 20)
  })
})