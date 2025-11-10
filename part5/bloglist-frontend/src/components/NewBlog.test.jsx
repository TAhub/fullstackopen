import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import NewBlog from './NewBlog'

test('creates blogs', async () => {
  const mockHandler = vi.fn()
  render(<NewBlog createNewBlog={mockHandler} />)
  const user = userEvent.setup()
  await user.type(screen.getByLabelText('title'), 'TITLE')
  await user.type(screen.getByLabelText('author'), 'AUTHOR')
  await user.type(screen.getByLabelText('url'), 'URL')
  await user.click(screen.getByText('Create Blog'))
  expect(mockHandler.mock.calls).toHaveLength(1)
  expect(mockHandler.mock.calls[0][0]).toBe('TITLE')
  expect(mockHandler.mock.calls[0][1]).toBe('AUTHOR')
  expect(mockHandler.mock.calls[0][2]).toBe('URL')
})
