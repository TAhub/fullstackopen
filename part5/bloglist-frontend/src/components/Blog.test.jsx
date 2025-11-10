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
  const button = screen.getByText('View')
  await user.click(button)
  expect(screen.queryByText('URL')).toBeVisible()
  expect(screen.queryByText('likes 10')).toBeVisible()
  expect(screen.queryByText('NAME')).toBeVisible()
})
