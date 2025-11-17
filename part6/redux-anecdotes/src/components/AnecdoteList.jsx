import { useSelector, useDispatch } from 'react-redux'
import { vote } from '../reducers/anecdoteReducer'
import { setNotification } from '../reducers/notificationReducer'

const AnecdoteList = () => {
  const dispatch = useDispatch()
  let anecdotes = [...useSelector(state => state.anecdotes)]
  const filter = useSelector(state => state.filter)

  const handleVoteButton = anecdote => {
    dispatch(vote(anecdote.id))
    dispatch(setNotification(`you voted on '${anecdote.content}'`, 10))
  }

  anecdotes.sort((a, b) => a.votes - b.votes)
  anecdotes = anecdotes.filter((a) => filter.length > 0 ? a.content.includes(filter) : true)

  return (
    <>
      {anecdotes.map(anecdote => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes} votes
            <button onClick={() => handleVoteButton(anecdote)}>vote</button>
          </div>
        </div>
      ))}
    </>
  )
}

export default AnecdoteList
