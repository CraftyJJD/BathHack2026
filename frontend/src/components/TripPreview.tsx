type TripPreviewProps = {
  leaveAt: string
}

export function TripPreview({ leaveAt }: TripPreviewProps) {
  return (
    <section className="trip-preview">
      <div className="fake-map" aria-hidden="true">
        <img src="/map.svg" alt="" className="fake-map__image" />
      </div>

      <button type="button" className="leave-at-button">
        Leave at {leaveAt}
      </button>
    </section>
  )
}
