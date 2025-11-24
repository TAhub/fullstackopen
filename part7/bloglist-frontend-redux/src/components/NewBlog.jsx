import { useState } from 'react'

const NewBlog = ({ createNewBlog }) => {
  const [newBlogTitle, setNewBlogTitle] = useState('')
  const [newBlogAuthor, setNewBlogAuthor] = useState('')
  const [newBlogUrl, setNewBlogUrl] = useState('')

  const handleNewBlogTitleChanged = (event) => {
    setNewBlogTitle(event.target.value)
  }
  const handleNewBlogAuthorChanged = (event) => {
    setNewBlogAuthor(event.target.value)
  }
  const handleNewBlogUrlChanged = (event) => {
    setNewBlogUrl(event.target.value)
  }
  const handleCreateBlogButton = (event) => {
    event.preventDefault()
    // Start the process of creating a new blog. This doesn't have to wait for it to finish.
    createNewBlog(newBlogTitle, newBlogAuthor, newBlogUrl)
    // Clear the old values.
    setNewBlogTitle('')
    setNewBlogAuthor('')
    setNewBlogUrl('')
  }

  return (<form>
    <div>
      <label>
        title <input type="text" value={newBlogTitle} onChange={handleNewBlogTitleChanged} />
      </label>
    </div>
    <div>
      <label>
        author <input type="text" value={newBlogAuthor} onChange={handleNewBlogAuthorChanged} />
      </label>
    </div>
    <div>
      <label>
        url <input type="text" value={newBlogUrl} onChange={handleNewBlogUrlChanged} />
      </label>
    </div>
    <button onClick={handleCreateBlogButton}>Create Blog</button>
  </form>)
}

export default NewBlog