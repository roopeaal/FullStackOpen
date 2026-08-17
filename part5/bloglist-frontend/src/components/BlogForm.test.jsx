import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

test('form calls createBlog with correct details', async () => {
  const createBlog = vi.fn()
  const testUser = userEvent.setup()

  render(<BlogForm createBlog={createBlog} />)

  const inputs = screen.getAllByRole('textbox')

  await testUser.type(inputs[0], 'React Testing')
  await testUser.type(inputs[1], 'Roope Aaltonen')
  await testUser.type(inputs[2], 'https://example.com/react-testing')

  await testUser.click(
    screen.getByRole('button', { name: 'create' })
  )

  expect(createBlog.mock.calls).toHaveLength(1)

  expect(createBlog.mock.calls[0][0]).toEqual({
    title: 'React Testing',
    author: 'Roope Aaltonen',
    url: 'https://example.com/react-testing',
  })
})