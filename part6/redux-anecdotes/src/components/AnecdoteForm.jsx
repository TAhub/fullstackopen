import { useDispatch } from 'react-redux'
import { addNew } from '../reducers/anecdoteReducer'
import { notificationChange, notificationClear } from '../reducers/notificationReducer'
import anecdoteService from '../services/anecdotes'

const AnecdoteForm = () => {
  const dispatch = useDispatch()
  const handleAddNewButton = async (e) => {
    event.preventDefault()
    const content = e.target.anecdote.value
    e.target.anecdote.value = ''
    const newAnecdote = await anecdoteService.createNew(content)
    dispatch(addNew(newAnecdote))
    dispatch(notificationChange(content))
    setTimeout(() => dispatch(notificationClear()), 5000)
  }

  return (
    <form onSubmit={handleAddNewButton}>
      <div>
        <input name="anecdote" />
      </div>
      <button type="submit">create</button>
    </form>
  )
}

export default AnecdoteForm
