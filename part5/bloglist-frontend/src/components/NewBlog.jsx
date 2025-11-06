const Login = ({ onCreateBlogButton, newBlogTitle, onNewBlogTitleChanged, newBlogAuthor, onNewBlogAuthorChanged, newBlogUrl, onNewBlogUrlChanged }) => (
  <form>
    <div>
      title <input value={newBlogTitle} onChange={onNewBlogTitleChanged} />
    </div>
    <div>
      author <input value={newBlogAuthor} onChange={onNewBlogAuthorChanged} />
    </div>
    <div>
      url <input value={newBlogUrl} onChange={onNewBlogUrlChanged} />
    </div>
    <button onClick={onCreateBlogButton}>Create Blog</button>
  </form>
)

export default Login