import { createSlice } from '@reduxjs/toolkit'

const anecdoteToObject = anecdote => {
  const id = (100000 * Math.random()).toFixed(0)
  return {
    content: anecdote,
    id,
    votes: 0
  }
}

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    addNew(state, action) {
      state.push(anecdoteToObject(action.payload))
    },
    vote(state, action) {
      for (const anecdote of state) {
        if (anecdote.id === action.payload) {
          anecdote.votes += 1
          break
        }
      }
    },
    setAnecdotes(state, action) {
      return action.payload
    },
  },
})

export const { addNew, vote, setAnecdotes } = anecdoteSlice.actions
export default anecdoteSlice.reducer