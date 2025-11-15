import { useSelector, useDispatch } from 'react-redux'
import { vote } from '../reducers/anecdoteReducer'

const AnecdoteList = () => {
  const dispatch = useDispatch()
  let anecdotes = useSelector(state => state.anecdotes)
  const filter = useSelector(state => state.filter)

  const handleVoteButton = id => {
    dispatch(vote(id))
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
            <button onClick={() => handleVoteButton(anecdote.id)}>vote</button>
          </div>
        </div>
      ))}
    </>
  )
}

export default AnecdoteList
