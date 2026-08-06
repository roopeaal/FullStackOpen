const { test, describe } = require('node:test')
const assert = require('node:assert')

const listHelper = require('../utils/list_helper')

describe('author with most likes', () => {
  test('of empty list is null', () => {
    assert.strictEqual(listHelper.mostLikes([]), null)
  })

  test('when list has one blog, returns its author and likes', () => {
    const blogs = [
      {
        title: 'Ensimmäinen blogi',
        author: 'Matti Meikäläinen',
        url: 'https://example.com/1',
        likes: 5,
      },
    ]

    assert.deepStrictEqual(
      listHelper.mostLikes(blogs),
      {
        author: 'Matti Meikäläinen',
        likes: 5,
      }
    )
  })

  test('returns author whose blogs have most total likes', () => {
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
        likes: 12,
      },
      {
        title: 'Blogi kolme',
        author: 'Maija Mäkinen',
        url: 'https://example.com/3',
        likes: 8,
      },
      {
        title: 'Blogi neljä',
        author: 'Teemu Testaaja',
        url: 'https://example.com/4',
        likes: 3,
      },
    ]

    assert.deepStrictEqual(
      listHelper.mostLikes(blogs),
      {
        author: 'Maija Mäkinen',
        likes: 13,
      }
    )
  })
})