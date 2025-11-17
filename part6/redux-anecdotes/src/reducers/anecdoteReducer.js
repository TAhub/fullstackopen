import { createSlice } from '@reduxjs/toolkit'

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    addNew(state, action) {
      state.push(action.payload)
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