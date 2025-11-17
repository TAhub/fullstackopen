import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
  name: 'notification',
  initialState: '',
  reducers: {
    notificationChange(state, action) {
      return action.payload
    },
    notificationClear(state, action) {
      return ''
    }
  },
})

export const setNotification = (text, seconds) => {
  return async (dispatch) => {
    dispatch(notificationChange(text))
    await new Promise(resolve => setTimeout(resolve, seconds * 1000))
    dispatch(notificationClear())
  }
}

export const { notificationChange, notificationClear } = notificationSlice.actions
export default notificationSlice.reducer