import { useState, type FormEvent } from 'react'
import { fetchAlarmPreview } from '../api'
import { PreGoBusLane } from '../components/PreGoBusLane'
import { TimeIcon } from '../components/icons'

export function AlarmPage() {
  const [arrivalTime, setArrivalTime] = useState('08:45')
  const [morningTime, setMorningTime] = useState('00:45')
  const [alarmTime, setAlarmTime] = useState('')
  const [isLoadingAlarm, setIsLoadingAlarm] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoadingAlarm(true)

    try {
      const response = await fetchAlarmPreview({
        arrivalTime,
        morningDuration: morningTime,
      })
      setAlarmTime(response.alarmTime)
    } finally {
      setIsLoadingAlarm(false)
    }
  }

  return (
    <div className="alarm-page">
      <PreGoBusLane
        streak="12"
        progress={isLoadingAlarm ? 0.5 : alarmTime ? 0.76 : 0.2}
        intent={alarmTime ? 'complete' : isLoadingAlarm ? 'active' : 'idle'}
      />

      <form
        className="home-actions alarm-actions"
        aria-label="Alarm setup"
        onSubmit={handleSubmit}
      >
        <label className="home-input home-time-field form-field form-field--time">
          <span>Arrive</span>
          <span className="form-field__icon" aria-hidden="true">
            <TimeIcon />
          </span>
          <input
            type="time"
            value={arrivalTime}
            onChange={(event) => setArrivalTime(event.target.value)}
            aria-label="Arrive time"
          />
        </label>

        <label className="home-input home-time-field form-field form-field--time">
          <span>Allocated time in the morning</span>
          <span className="form-field__icon" aria-hidden="true">
            <TimeIcon />
          </span>
          <input
            type="time"
            value={morningTime}
            onChange={(event) => setMorningTime(event.target.value)}
            aria-label="Morning routine duration"
          />
        </label>

        <button type="submit" className="home-go-button" disabled={isLoadingAlarm}>
          {isLoadingAlarm ? 'Setting alarm...' : 'Set alarm'}
        </button>

        {alarmTime ? (
          <button type="button" className="alarm-set-button">
            Alarm set to : {alarmTime}
          </button>
        ) : null}
      </form>

      <PreGoBusLane
        reverse
        progress={isLoadingAlarm ? 0.5 : alarmTime ? 0.24 : 0.8}
        intent={alarmTime ? 'complete' : isLoadingAlarm ? 'active' : 'idle'}
      />
    </div>
  )
}
