import { useState } from 'react'

export const useField = (type, message) => {
  const [value, setValue] = useState('')
  const onChange = (event) => setValue(event.target.value)
  const reset = () => setValue('')
  return { type, value, message, reset, inputValues: { type, value, onChange } }
}
