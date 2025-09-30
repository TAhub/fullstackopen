import { useState } from 'react'

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  
  const handleClickButton = (value, setter) => () => setter(value + 1);

  if (good > 0 || neutral > 0 || bad > 0) {
    return (
      <>
        <h1>give feedback</h1>
        <Button onClick={handleClickButton(good, setGood)} name="good" />
        <Button onClick={handleClickButton(neutral, setNeutral)} name="neutral" />
        <Button onClick={handleClickButton(bad, setBad)} name="bad" />
        <h1>statistics</h1>
        <Statistics good={good} neutral={neutral} bad={bad} />
      </>
    )
  } else {
    return (
      <>
        <h1>give feedback</h1>
        <Button onClick={handleClickButton(good, setGood)} name="good" />
        <Button onClick={handleClickButton(neutral, setNeutral)} name="neutral" />
        <Button onClick={handleClickButton(bad, setBad)} name="bad" />
        <h1>statistics</h1>
        <p>No feedback given</p>
      </>
    )
  }
}

const Button = ({onClick, name}) => {
  return (
    <button onClick={onClick}>{name}</button>
  )
}

const Statistics = ({good, neutral, bad}) => {
  const total = good + neutral + bad
  return (
    <table>
      <StatisticLine name="good" value={good} />
      <StatisticLine name="neutral" value={neutral} />
      <StatisticLine name="bad" value={bad} />
      <StatisticLine name="all" value={total} />
      <StatisticLine name="average" value={(good - bad) / total} />
      <StatisticLine name="positive" value={100 * good / total} isPercent={true} />
    </table>
  )
}

const StatisticLine = ({value, name, isPercent}) => {
  return (
    <tr>
      <td>{name}</td>
      <td>{value}</td>
      <td>{isPercent ? '%' : ''}</td>
    </tr>
  )
}

export default App