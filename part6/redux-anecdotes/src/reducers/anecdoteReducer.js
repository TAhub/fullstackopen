import { createSlice } from '@reduxjs/toolkit'

import anecdoteService from '../services/anecdotes'

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    addNew(state, action) {
      state.push(action.payload)
    },
    updateAnecdote(state, action) {
      for (let i = 0; i < state.length; i++) {
        if (state[i].id === action.payload.id) {
          state[i] = action.payload
          break
        }
      }
    },
    setAnecdotes(state, action) {
      return action.payload
    },
  },
})

export const initializeAnecdotes = () => {
  return async (dispatch) => {
    const anecdotes = await anecdoteService.getAll()
    dispatch(setAnecdotes(anecdotes))
  }
}

export const vote = (id) => {
  return async (dispatch, getState) => {
    const state = getState().anecdotes
    for (const anecdote of state) {
      if (anecdote.id === id) {
        const modifiedAnecdote = { ...anecdote, votes: anecdote.votes + 1 }
        dispatch(updateAnecdote(modifiedAnecdote))
        await anecdoteService.update(modifiedAnecdote)
        return
      }
    }
  }
}

export const createAnecdote = (content) => {
  return async (dispatch) => {
    const newAnecdote = await anecdoteService.createNew(content)
    dispatch(addNew(newAnecdote))
  }
}

export const { addNew, updateAnecdote, setAnecdotes } = anecdoteSlice.actions
export default anecdoteSlice.reducer