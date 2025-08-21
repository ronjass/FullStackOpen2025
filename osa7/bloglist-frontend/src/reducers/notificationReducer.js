import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
  name: 'notification',
  initialState: '',
  reducers: {
    showNotification(state, action) {
      return action.payload
    },
    clearNotification() {
      return ''
    },
  },
})

export const { showNotification, clearNotification } = notificationSlice.actions

export const setNotificationTimeout = (message, sec) => {
  return async (dispatch) => {
    dispatch(showNotification(message))
    setTimeout(() => {
      dispatch(clearNotification())
    }, sec * 1000)
  }
}
export default notificationSlice.reducer
