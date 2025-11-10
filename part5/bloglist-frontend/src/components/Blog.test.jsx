import { render, screen } from '@testing-library/react'
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
