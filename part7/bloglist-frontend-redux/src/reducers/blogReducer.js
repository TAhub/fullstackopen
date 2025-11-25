import { createSlice } from '@reduxjs/toolkit'

import { showNotification } from './notificationReducer'
import blogService from '../services/blogs'

const blogSlice = createSlice({
  name: 'blogs',
  initialState: [],
  reducers: {
    setBlogs(state, action) {
      return action.payload
    },
  },
})

export const initializeBlogs = () => {
  return async (dispatch) => {
    const blogs = await blogService.getAll()
    dispatch(setBlogs(blogs))
  }
}

export const likeBlog = (blog, token) => {
  return async (dispatch, getState) => {
    try {
      const newBlog = await blogService.put(blog.title, blog.author, blog.url, blog.likes + 1, blog.id, token)
      dispatch(showNotification('Successfully liked the blog!'))
      const blogs = getState().blogs
      dispatch(setBlogs(blogs.map(b => b.id !== newBlog.id ? b : newBlog)))
    } catch (error) {
      dispatch(showNotification('Failed to like blog!', error))
    }
  }
}

export const addNewBlog = (newBlogTitle, newBlogAuthor, newBlogUrl, token) => {
  return async (dispatch, getState) => {
    try {
      const newBlog = await blogService.post(newBlogTitle, newBlogAuthor, newBlogUrl, token)
      dispatch(showNotification('Successfully posted a blog!'))
      const blogs = getState().blogs
      dispatch(setBlogs(blogs.concat(newBlog)))
    } catch (error) {
      dispatch(showNotification('Failed to post blog!', error))
    }
  }
}

export const deleteBlog = (blog, token) => {
  return async (dispatch, getState) => {
    try {
      await blogService.remove(blog.id, token)
      dispatch(showNotification('Successfully deleted the blog!'))
      const blogs = getState().blogs
      dispatch(setBlogs(blogs.filter(b => b.id !== blog.id)))
    } catch (error) {
      dispatch(showNotification('Failed to delete blog!', error))
    }
  }
}

export const { setBlogs } = blogSlice.actions
export default blogSlice.reducer