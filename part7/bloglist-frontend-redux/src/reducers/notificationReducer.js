import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
  name: 'notifications',
  initialState: null,
  reducers: {
    setNotification(state, action) {
      return action.payload
    },
    clearNotification(state, action) {
      return null
    },
  },
})

export const showNotification = (text, error = null) => {
  return async (dispatch) => {
    dispatch(setNotification({ text, error }))
    await new Promise(resolve => setTimeout(resolve, 4000))
    dispatch(clearNotification())
  }
}

export const { setNotification, clearNotification } = notificationSlice.actions
export default notificationSlice.reducer