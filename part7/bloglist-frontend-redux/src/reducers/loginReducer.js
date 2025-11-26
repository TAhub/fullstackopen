import { createSlice } from '@reduxjs/toolkit'

import { showNotification } from './notificationReducer'
import loginService from '../services/login'

const loginSlice = createSlice({
  name: 'login',
  initialState: null,
  reducers: {
    setLogin(state, action) {
      return action.payload
    },
    clearLogin(state, action) {
      return null
    }
  },
})

export const login = (username, password) => {
  return async (dispatch) => {
    try {
      const newUser = await loginService.login(username, password)
      dispatch(showNotification('Successfully logged in!'))
      dispatch(setLogin(newUser))
    } catch(error) {
      dispatch(showNotification('Failed to log in!', error))
    }
  }
}

export const logout = () => {
  return (dispatch) => {
    dispatch(showNotification('Successfully logged out!'))
    dispatch(clearLogin())
  }
}

export const { setLogin, clearLogin } = loginSlice.actions
export default loginSlice.reducer