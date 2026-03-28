import { useState, type FormEvent } from 'react'
import { fetchLeavePreview } from '../api'
import { PreGoBusLane } from '../components/PreGoBusLane'
import { TripPreview } from '../components/TripPreview'
import {
  DestinationPinIcon,
  LocationIcon,
  TimeIcon,
} from '../components/icons'

type RepeatSchedule = 'no' | 'week' | 'custom'

export function HomePage() {
  const [origin, setOrigin] = useState('')
  const [destination, setDestination] = useState('')
  const [arrivalTime, setArrivalTime] = useState('08:45')
  const [leaveAt, setLeaveAt] = useState('')
  const [repeatSchedule, setRepeatSchedule] = useState<RepeatSchedule>('week')
  const [isLoadingPreview, setIsLoadingPreview] = useState(false)
  const [showTripPreview, setShowTripPreview] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoadingPreview(true)

    try {
      const response = await fetchLeavePreview({
        origin,
        destination,
        arrivalTime,
      })
      setLeaveAt(response.leaveAt)
      setShowTripPreview(true)
    } finally {
      setIsLoadingPreview(false)
    }
  }

  return (
    <div className="home-page">
      <PreGoBusLane
        streak="12"
        progress={isLoadingPreview ? 0.5 : showTripPreview ? 0.78 : 0.18}
        intent={showTripPreview ? 'complete' : isLoadingPreview ? 'active' : 'idle'}
      />

      <form className="home-actions" aria-label="Trip setup" onSubmit={handleSubmit}>
        {showTripPreview ? null : (
          <>
            <label className="home-input form-field">
              <span className="form-field__label">Where are you?</span>
              <span className="form-field__icon" aria-hidden="true">
                <LocationIcon />
              </span>
              <input
                type="text"
                className="form-field__input"
                placeholder="Home"
                aria-label="Where are you?"
                value={origin}
                onChange={(event) => setOrigin(event.target.value)}
              />
            </label>
            <label className="home-input form-field">
              <span className="form-field__label">Destination</span>
              <span className="form-field__icon" aria-hidden="true">
                <DestinationPinIcon />
              </span>
              <input
                type="text"
                className="form-field__input"
                placeholder="Campus"
                aria-label="Destination"
                value={destination}
                onChange={(event) => setDestination(event.target.value)}
              />
            </label>
          </>
        )}
        <label className="home-input home-time-field form-field form-field--time">
          <span>Arrival time</span>
          <span className="form-field__icon" aria-hidden="true">
            <TimeIcon />
          </span>
          <input
            type="time"
            value={arrivalTime}
            onChange={(event) => setArrivalTime(event.target.value)}
            aria-label="Arrival time"
          />
        </label>
        <div className="home-regular-times">
          <div className="home-regular-times__button" role="group" aria-label="Repeat">
            <div className="home-regular-times__summary">
              <span className="home-regular-times__title">Repeat</span>
            </div>

            <div className="home-regular-times__options">
              {[
                { value: 'no', label: 'No' },
                { value: 'week', label: 'Weekly' },
                { value: 'custom', label: 'Custom' },
              ].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className={`home-regular-times__choice${
                    repeatSchedule === option.value
                      ? ' home-regular-times__choice--active'
                      : ''
                  }`}
                  onClick={() => setRepeatSchedule(option.value as RepeatSchedule)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <button type="submit" className="home-go-button" disabled={isLoadingPreview}>
          {isLoadingPreview ? 'Finding leave time...' : 'Plan trip'}
        </button>
      </form>

      <PreGoBusLane
        reverse
        progress={isLoadingPreview ? 0.5 : showTripPreview ? 0.22 : 0.82}
        intent={showTripPreview ? 'complete' : isLoadingPreview ? 'active' : 'idle'}
      />
      {showTripPreview ? <TripPreview leaveAt={leaveAt} /> : null}
    </div>
  )
}
