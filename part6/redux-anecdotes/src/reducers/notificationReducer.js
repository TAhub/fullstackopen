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

export const { notificationChange, notificationClear } = notificationSlice.actions
export default notificationSlice.reducer