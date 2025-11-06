const Login = ({ onCreateBlogButton, newBlogTitle, onNewBlogTitleChanged, newBlogAuthor, onNewBlogAuthorChanged, newBlogUrl, onNewBlogUrlChanged }) => (
  <form>
    <div>
      <label>
        title <input type="text" value={newBlogTitle} onChange={onNewBlogTitleChanged} />
      </label>
    </div>
    <div>
      <label>
        author <input type="text" value={newBlogAuthor} onChange={onNewBlogAuthorChanged} />
      </label>
    </div>
    <div>
      <label>
        url <input type="text" value={newBlogUrl} onChange={onNewBlogUrlChanged} />
      </label>
    </div>
    <button onClick={onCreateBlogButton}>Create Blog</button>
  </form>
)

export default Login