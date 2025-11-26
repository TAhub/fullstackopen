import { useState } from 'react'
import { useDispatch } from 'react-redux'

import NewBlog from './NewBlog'
import BlogList from './BlogList'
import SortMode from './SortMode'
import { initializeBlogs, addNewBlog } from '../reducers/blogReducer'

const BlogsView = () => {
  const dispatch = useDispatch()
  const [sortMode, setSortMode] = useState('title')
  const [newBlogVisible, setNewBlogVisible] = useState(false)

  const hideWhenNewBlogVisible = { display: newBlogVisible ? 'none' : '' }
  const showWhenNewBlogVisible = { display: newBlogVisible ? '' : 'none' }

  const createNewBlog = async (newBlogTitle, newBlogAuthor, newBlogUrl) => {
    // Hide the add form.
    setNewBlogVisible(false)
    // Then try to create a blog.
    dispatch(addNewBlog(newBlogTitle, newBlogAuthor, newBlogUrl, user.token))
  }

  const sortModes = ['title', 'author', 'likes']

  return (<>
    <h2>Sort</h2>
    <SortMode sortMode={sortMode} setSortMode={setSortMode} sortModes={sortModes} />
    <h2>Blogs</h2>
    <BlogList />
    <button style={hideWhenNewBlogVisible} onClick={() => setNewBlogVisible(true)}>Create New Blog</button>
    <div style={showWhenNewBlogVisible}>
      <h2>New Blog</h2>
      <NewBlog createNewBlog={createNewBlog} />
      <button onClick={() => setNewBlogVisible(false)}>Cancel</button>
    </div>
  </>)
}

export default BlogsView