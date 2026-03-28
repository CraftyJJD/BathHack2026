type TripPreviewProps = {
  leaveAt: string
}

export function TripPreview({ leaveAt }: TripPreviewProps) {
  return (
    <section className="trip-preview">
      <div className="fake-map" aria-hidden="true">
        <div className="fake-map__grid" />
        <div className="fake-map__route" />
        <div className="fake-map__stop fake-map__stop--start">
          <span>Start</span>
        </div>
        <div className="fake-map__stop fake-map__stop--mid">
          <span>Bus U1</span>
        </div>
        <div className="fake-map__stop fake-map__stop--end">
          <span>Destination</span>
        </div>
        <div className="fake-map__step fake-map__step--walk-start">
          Walk 4 min to stop
        </div>
        <div className="fake-map__step fake-map__step--bus">
          Take U1 bus
        </div>
        <div className="fake-map__step fake-map__step--walk-end">
          Walk 3 min to campus
        </div>
      </div>

      <button type="button" className="leave-at-button">
        Leave at {leaveAt}
      </button>
    </section>
  )
}
