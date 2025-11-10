import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

const blog = {
  title: 'TITLE',
  author: 'AUTHOR',
  url: 'URL',
  likes: 10,
  user: {
    name: 'NAME',
    userName: 'USERNAME',
  },
}

test('renders blogs', () => {
  render(<Blog blog={blog} likeBlog={()=>{}} deleteBlog={()=>{}} userName="OTHER USERNAME" />)
  expect(screen.queryByText('TITLE')).not.toBeNull()
  expect(screen.queryByText('AUTHOR')).not.toBeNull()
  expect(screen.queryByText('URL')).not.toBeNull()
  expect(screen.queryByText('likes 10')).not.toBeNull()
  expect(screen.queryByText('NAME')).not.toBeNull()
})

test('only shows title and author by default', () => {
  render(<Blog blog={blog} likeBlog={()=>{}} deleteBlog={()=>{}} userName="OTHER USERNAME" />)
  expect(screen.queryByText('TITLE')).toBeVisible()
  expect(screen.queryByText('AUTHOR')).toBeVisible()
  expect(screen.queryByText('URL')).not.toBeVisible()
  expect(screen.queryByText('likes 10')).not.toBeVisible()
  expect(screen.queryByText('NAME')).not.toBeVisible()
})

test('shows other values after show button is pressed', async () => {
  render(<Blog blog={blog} likeBlog={()=>{}} deleteBlog={()=>{}} userName="OTHER USERNAME" />)
  const user = userEvent.setup()
  await user.click(screen.getByText('View'))
  expect(screen.queryByText('URL')).toBeVisible()
  expect(screen.queryByText('likes 10')).toBeVisible()
  expect(screen.queryByText('NAME')).toBeVisible()
})

test('pressing like button increments likes', async () => {
  const mockHandler = vi.fn()
  render(<Blog blog={blog} likeBlog={mockHandler} deleteBlog={()=>{}} userName="OTHER USERNAME" />)
  const user = userEvent.setup()
  await user.click(screen.getByText('View'))
  await user.click(screen.getByText('Like'))
  expect(mockHandler.mock.calls).toHaveLength(1)
  await user.click(screen.getByText('Like'))
  expect(mockHandler.mock.calls).toHaveLength(2)
})
