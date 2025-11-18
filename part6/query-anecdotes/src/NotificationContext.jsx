import { createContext, useReducer } from 'react'

const notificationReducer = (state, action) => {
  switch (action.type) {
    case 'SHOW':
      return action.payload
    case 'CLEAR':
      return ''
    default:
      return state
  }
}

const NotificationContext = createContext()

export const NotificationContextProvider = ({ children }) => {
  const [notification, notificationDispatch] = useReducer(notificationReducer, 0)
  const showNotificationAction = (payload) => {
    notificationDispatch({ type: 'SHOW', payload })
    setTimeout(() => notificationDispatch({ type: 'CLEAR' }), 5000)
  }

  return (
    <NotificationContext.Provider value={{ notification, showNotificationAction }}>
      {children}
    </NotificationContext.Provider>
  )
}

export default NotificationContext
