const baseUrl = 'http://localhost:3001/anecdotes'

export const getAnecdotes = async () => {
  const response = await fetch(baseUrl)
  if (!response.ok) {
    throw new Error('Failed to fetch anecdotes')
  }
  return await response.json()
}

export const createAnecdote = async (newAnecdote) => {
  const response = await fetch(baseUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newAnecdote)
  })
  if (!response.ok) {
    throw new Error('Failed to create anecdotes')
  }
  return await response.json()
}

export const updateAnecdote = async (modifiedAnecdote) => {
  const response = await fetch(baseUrl + '/' + modifiedAnecdote.id, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(modifiedAnecdote)
  })
  if (!response.ok) {
    throw new Error('Failed to update anecdotes')
  }
  return await response.json()
}
