import { useSelector, useDispatch } from 'react-redux'
import { filterChange } from '../reducers/filterReducer'

const Filter = () => {
  const dispatch = useDispatch()
  const filter = useSelector(state => state.filter)

  const handleChange = event => {
    dispatch(filterChange(event.target.value))
  }
  const style = {
    marginBottom: 10
  }

  return (
    <div style={style}>
      filter <input value={filter} onChange={handleChange} />
    </div>
  )
}

export default Filter
