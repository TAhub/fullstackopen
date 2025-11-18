import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query' 
import { getAnecdotes, updateAnecdote } from './requests'
import { useContext } from 'react'
import NotificationContext from './NotificationContext'

const App = () => {
  const { showNotificationAction } = useContext(NotificationContext)
  const anecdoteResult = useQuery({
    queryKey: ['anecdotes'],
    queryFn: getAnecdotes
  })
  const changeAnecdoteMutation = useMutation({
    mutationFn: updateAnecdote,
    onSuccess: (updatedAnecdote) => {
      showNotificationAction('Voted on anecdote: ' + updatedAnecdote.content)
      queryClient.setQueryData(['anecdotes'], anecdotes.map(a => a.id === updatedAnecdote.id ? updatedAnecdote : a))
    },
    onError: (error) => {
      showNotificationAction('Failed to vote on anecdote: ' + error.message)
    }
  })
  const queryClient = useQueryClient()

  if (anecdoteResult.isLoading) {
    return <div>Loading data...</div>
  }
  if (anecdoteResult.error) {
    return <div>Error loading data: {anecdoteResult.error.message}</div>
  }
  const anecdotes = anecdoteResult.data

  const handleVote = (anecdote) => {
    changeAnecdoteMutation.mutate({ ...anecdote, votes: anecdote.votes + 1 })
  }

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
