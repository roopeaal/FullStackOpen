import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
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

const user = {
  username: 'roope',
}

test('renders title and author but not url or likes by default', () => {
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

test('shows url and likes after view button is clicked', async () => {
  const testUser = userEvent.setup()

  render(
    <Blog
      blog={blog}
      updateBlog={() => {}}
      removeBlog={() => {}}
      user={user}
    />
  )

  const button = screen.getByText('view')
  await testUser.click(button)

  expect(
    screen.getByText('https://fullstackopen.com')
  ).toBeDefined()

  expect(
    screen.getByText(/likes 7/)
  ).toBeDefined()

  expect(
    screen.getByText('Roope Aaltonen')
  ).toBeDefined()
})

test('clicking like button twice calls event handler twice', async () => {
  const mockHandler = vi.fn()
  const testUser = userEvent.setup()

  render(
    <Blog
      blog={blog}
      updateBlog={mockHandler}
      removeBlog={() => {}}
      user={user}
    />
  )

  await testUser.click(screen.getByText('view'))

  const likeButton = screen.getByText('like')

  await testUser.click(likeButton)
  await testUser.click(likeButton)

  expect(mockHandler.mock.calls).toHaveLength(2)
})