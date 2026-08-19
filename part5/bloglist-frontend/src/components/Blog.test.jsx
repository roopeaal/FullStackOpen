import { render, screen } from '@testing-library/react'
import Blog from './Blog'

const blog = {
  title: 'Full Stack Open',
  author: 'Roope Aaltonen',
  url: 'https://fullstackopen.com',
  likes: 7,
  user: {
    username: 'roope',
    name: 'Roope Aaltonen',
  },
}

test('shows blog information but no buttons to unauthenticated user', () => {
  render(
    <Blog
      blog={blog}
      updateBlog={() => {}}
      removeBlog={() => {}}
      user={null}
      detailed
    />
  )

  expect(
    screen.getByText(/Full Stack Open Roope Aaltonen/)
  ).toBeDefined()

  expect(
    screen.getByText('https://fullstackopen.com')
  ).toBeDefined()

  expect(
    screen.getByText(/likes 7/)
  ).toBeDefined()

  expect(
    screen.getByText('Roope Aaltonen')
  ).toBeDefined()

  expect(
    screen.queryAllByRole('button')
  ).toHaveLength(0)
})

test('shows only like button to logged in user who is not creator', () => {
  const user = {
    username: 'pekka',
  }

  render(
    <Blog
      blog={blog}
      updateBlog={() => {}}
      removeBlog={() => {}}
      user={user}
      detailed
    />
  )

  expect(
    screen.getByRole('button', { name: 'like' })
  ).toBeDefined()

  expect(
    screen.queryByRole('button', { name: 'remove' })
  ).toBeNull()
})

test('shows like and remove buttons to blog creator', () => {
  const user = {
    username: 'roope',
  }

  render(
    <Blog
      blog={blog}
      updateBlog={() => {}}
      removeBlog={() => {}}
      user={user}
      detailed
    />
  )

  expect(
    screen.getByRole('button', { name: 'like' })
  ).toBeDefined()

  expect(
    screen.getByRole('button', { name: 'remove' })
  ).toBeDefined()
})