import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'
import { useQuery } from '@tanstack/react-query' 
import { getAnecdotes } from './requests'

const App = () => {
  const handleVote = (anecdote) => {
    console.log('vote')
  }

  const anecdoteResult = useQuery({
    queryKey: ['anecdotes'],
    queryFn: getAnecdotes
  })
  if (anecdoteResult.isLoading) {
    return <div>Loading data...</div>
  }
  if (anecdoteResult.error) {
    return <div>Error loading data: {anecdoteResult.error.message}</div>
  }
  const anecdotes = anecdoteResult.data

  return (
    <div>
      <h3>Anecdote app</h3>

      <Notification />
      <AnecdoteForm />

      {anecdotes.map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default App
