import { useSelector } from 'react-redux'

const Notification = () => {
  const notification = useSelector(store => store.notification)
  if (!notification) {
    return null
  }

  const style = {
    color: notification.error ? 'red' : 'green',
    background: 'lightgrey',
    fontSize: '20px',
    borderStyle: 'solid',
    borderRadius: '5px',
    padding: '10px',
    marginBottom: '10px'
  }

  return (
    <div style={style}>{notification.text}</div>
  )
}

export default Notification