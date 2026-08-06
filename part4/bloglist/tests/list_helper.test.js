const { test, describe } = require('node:test')
const assert = require('node:assert')

const listHelper = require('../utils/list_helper')

test('dummy returns one', () => {
  const blogs = []

  assert.strictEqual(listHelper.dummy(blogs), 1)
})

describe('total likes', () => {
  test('of empty list is zero', () => {
    assert.strictEqual(listHelper.totalLikes([]), 0)
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

describe('favorite blog', () => {
  test('of empty list is null', () => {
    assert.strictEqual(listHelper.favoriteBlog([]), null)
  })

  test('when list has only one blog, returns that blog', () => {
    const blog = {
      title: 'Ensimmäinen blogi',
      author: 'Matti Meikäläinen',
      url: 'https://example.com/1',
      likes: 5,
    }

    assert.deepStrictEqual(
      listHelper.favoriteBlog([blog]),
      blog
    )
  })

  test('of a larger list is the blog with most likes', () => {
    const blogs = [
      {
        title: 'Ensimmäinen blogi',
        author: 'Matti Meikäläinen',
        url: 'https://example.com/1',
        likes: 5,
      },
      {
        title: 'Suosituin blogi',
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

    assert.deepStrictEqual(
      listHelper.favoriteBlog(blogs),
      blogs[1]
    )
  })
})

describe('author with most blogs', () => {
  test('of empty list is null', () => {
    assert.strictEqual(listHelper.mostBlogs([]), null)
  })

  test('when list has one blog, returns its author', () => {
    const blogs = [
      {
        title: 'Ensimmäinen blogi',
        author: 'Matti Meikäläinen',
        url: 'https://example.com/1',
        likes: 5,
      },
    ]

    assert.deepStrictEqual(
      listHelper.mostBlogs(blogs),
      {
        author: 'Matti Meikäläinen',
        blogs: 1,
      }
    )
  })

  test('returns author with the largest number of blogs', () => {
    const blogs = [
      {
        title: 'Blogi yksi',
        author: 'Maija Mäkinen',
        url: 'https://example.com/1',
        likes: 5,
      },
      {
        title: 'Blogi kaksi',
        author: 'Matti Meikäläinen',
        url: 'https://example.com/2',
        likes: 2,
      },
      {
        title: 'Blogi kolme',
        author: 'Maija Mäkinen',
        url: 'https://example.com/3',
        likes: 8,
      },
      {
        title: 'Blogi neljä',
        author: 'Maija Mäkinen',
        url: 'https://example.com/4',
        likes: 1,
      },
    ]

    assert.deepStrictEqual(
      listHelper.mostBlogs(blogs),
      {
        author: 'Maija Mäkinen',
        blogs: 3,
      }
    )
  })
})