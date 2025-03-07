import { useState } from 'react'

const Button = ({ onClick, text }) => {
  return (
    <button onClick={onClick}>{text}</button>
  )
}

const StatisticLine = ({ text, value }) => <p>{text} {value}</p>

const Statistics = (props) => {
  const { good, neutral, bad } = props
  const total = good + neutral + bad
  const average = (good - bad) / total
  const positive = (good / total) * 100

  if (total === 0) {
    return (
      <div>
        <h1>statistics</h1>
        <p>No feedback given</p>
      </div>
    )
  }

  return (
    <div>
      <h1>statistics</h1>
      <table style={{ borderCollapse: 'collapse', borderSpacing: '0' }}>
        <tbody>
          <tr><td style={{ padding: '3px' }}><StatisticLine text="good"/></td><td style={{ padding: '3px' }}><StatisticLine value={good} /></td></tr>
          <tr><td style={{ padding: '3px' }}><StatisticLine text="neutral"/></td><td style={{ padding: '3px' }}><StatisticLine value={neutral} /></td></tr>
          <tr><td style={{ padding: '3px' }}><StatisticLine text="bad"/></td><td style={{ padding: '3px' }}><StatisticLine value={bad} /></td></tr>
          <tr><td style={{ padding: '3px' }}><StatisticLine text="all"/></td><td style={{ padding: '3px' }}><StatisticLine value={total} /></td></tr>
          <tr><td style={{ padding: '3px' }}><StatisticLine text="average"/></td><td style={{ padding: '3px' }}><StatisticLine value={average} /></td></tr>
          <tr><td style={{ padding: '3px' }}><StatisticLine text="positive"/></td><td style={{ padding: '3px' }}><StatisticLine value={positive + ' %'} /></td></tr>
        </tbody>
      </table>
    </div>
  )
}

const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <div>
      <h1>give feedback</h1>
      <Button onClick={() => setGood(good + 1)} text='good' />
      <Button onClick={() => setNeutral(neutral + 1)} text='neutral' />
      <Button onClick={() => setBad(bad + 1)} text='bad' />
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  )
}

export default App