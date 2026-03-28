import { PREVIOUS_TRIPS } from '../data/trips'

export function TripsPage() {
  return (
    <div className="trips-page">
      <h2 className="trips-page__title">Previous trips</h2>

      <div className="trips-list" aria-label="Previous trips">
        {PREVIOUS_TRIPS.map((trip) => (
          <button key={`${trip.day}-${trip.left}`} type="button" className="trip-history-card">
            <span className="trip-history-card__day">{trip.day}</span>
            <span className="trip-history-card__time">Left {trip.left}</span>
            <span className="trip-history-card__time">Arrived {trip.arrived}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
