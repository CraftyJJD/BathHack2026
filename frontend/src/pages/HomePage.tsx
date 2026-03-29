import { useState, type FormEvent } from 'react'
import { fetchLeavePreview } from '../api'
import { PreGoBusLane } from '../components/PreGoBusLane'
import { TripPreview } from '../components/TripPreview'
import {
  AlertIcon,
  DestinationPinIcon,
  LocationIcon,
  TimeIcon,
} from '../components/icons'

type RepeatSchedule = 'no' | 'week' | 'custom'

export function HomePage() {
  const [destination, setDestination] = useState('University of Bath')
  const [arrivalTime, setArrivalTime] = useState('10:00')
  const [leaveAt, setLeaveAt] = useState('')
  const [campusTraffic, setCampusTraffic] = useState(0)
  const [campusTrafficAdjustment, setCampusTrafficAdjustment] = useState(0)
  const [estimatedDelay, setEstimatedDelay] = useState(0)
  const [submitError, setSubmitError] = useState('')
  const [repeatSchedule, setRepeatSchedule] = useState<RepeatSchedule>('week')
  const [isLoadingPreview, setIsLoadingPreview] = useState(false)
  const [showTripPreview, setShowTripPreview] = useState(false)
  const [isUsingExampleLocation, setIsUsingExampleLocation] = useState(true)
  const delayMessage = `There is expected to be ${estimatedDelay} minute${
    estimatedDelay === 1 ? '' : 's'
  } of delay.`

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoadingPreview(true)
    setSubmitError('')

    try {
      const response = await fetchLeavePreview({
        destination,
        arrivalTime,
      })
      setLeaveAt(response.leaveAt)
      setCampusTraffic(response.campusTraffic)
      setCampusTrafficAdjustment(response.campusTrafficAdjustment)
      setEstimatedDelay(response.estimatedDelay)
      setShowTripPreview(true)
    } catch {
      setShowTripPreview(false)
      setSubmitError(
        'Trip planning failed. Check that the ngrok backend is reachable.',
      )
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
            <div className="home-input form-field">
              <span className="form-field__label">Where are you?</span>
              <span className="form-field__icon" aria-hidden="true">
                <LocationIcon />
              </span>
              <button
                type="button"
                className="form-field__input"
                aria-label="Use my location"
                onClick={() => setIsUsingExampleLocation(true)}
              >
                {isUsingExampleLocation ? 'Oldfield Park' : 'Use my location'}
              </button>
            </div>
            <label className="home-input form-field">
              <span className="form-field__label">Destination</span>
              <span className="form-field__icon" aria-hidden="true">
                <DestinationPinIcon />
              </span>
              <input
                type="text"
                className="form-field__input"
                placeholder="University of Bath"
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
        {submitError ? <p role="alert">{submitError}</p> : null}
      </form>

      <PreGoBusLane
        reverse
        progress={isLoadingPreview ? 0.5 : showTripPreview ? 0.22 : 0.82}
        intent={showTripPreview ? 'complete' : isLoadingPreview ? 'active' : 'idle'}
      />
      {showTripPreview ? (
        <>
          <div className="trip-popups" aria-live="polite">
            {campusTraffic > 0.6 ? (
              <div className="trip-popup trip-popup--warning" role="status">
                <span className="trip-popup__icon" aria-hidden="true">
                  <AlertIcon />
                </span>
                <span className="trip-popup__content">
                  <strong>Campus is very busy at this time.</strong>{' '}
                  <span>
                    {campusTrafficAdjustment} extra minutes have been added to your
                    journey.
                  </span>
                </span>
              </div>
            ) : null}
            <div className="trip-popup trip-popup--info" role="status">
              <span className="trip-popup__icon" aria-hidden="true">
                <AlertIcon />
              </span>
              <span>{delayMessage}</span>
            </div>
          </div>
          <TripPreview leaveAt={leaveAt} />
        </>
      ) : null}
    </div>
  )
}
