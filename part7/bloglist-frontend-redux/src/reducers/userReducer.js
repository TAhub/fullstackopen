import { createSlice } from '@reduxjs/toolkit'

import { showNotification } from './notificationReducer'
import loginService from '../services/login'

const userSlice = createSlice({
  name: 'user',
  initialState: null,
  reducers: {
    setUser(state, action) {
      return action.payload
    },
    clearUser(state, action) {
      return null
    }
  },
})

export const login = (username, password) => {
  return async (dispatch) => {
    try {
      const newUser = await loginService.login(username, password)
      dispatch(showNotification('Successfully logged in!'))
      dispatch(setUser(newUser))
    } catch(error) {
      dispatch(showNotification('Failed to log in!', error))
    }
  }
}

export const logout = () => {
  return (dispatch) => {
    dispatch(showNotification('Successfully logged out!'))
    dispatch(clearUser())
  }
}

export const { setUser, clearUser } = userSlice.actions
export default userSlice.reducer