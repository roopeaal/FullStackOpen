import { render, screen } from '@testing-library/react'
import Blog from './Blog'

test('renders title and author but not url or likes by default', () => {
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

  const user = {
    username: 'roope',
  }

  render(
    <Blog
      blog={blog}
      updateBlog={() => {}}
      removeBlog={() => {}}
      user={user}
    />
  )

  expect(
    screen.getByText(/Full Stack Open Roope Aaltonen/)
  ).toBeDefined()

  expect(
    screen.queryByText('https://fullstackopen.com')
  ).toBeNull()

  expect(
    screen.queryByText(/likes 7/)
  ).toBeNull()
})