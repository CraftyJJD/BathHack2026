type PreGoBusLaneProps = {
  reverse?: boolean
  streak?: string
  progress?: number
  intent?: 'idle' | 'active' | 'complete'
}

export function PreGoBusLane({
  reverse = false,
  streak,
  progress = reverse ? 0.82 : 0.18,
  intent = 'idle',
}: PreGoBusLaneProps) {
  const isStreakBus = Boolean(streak) && !reverse

  return (
    <div
      className={`pre-go-bus-lane pre-go-bus-lane--${intent}${
        isStreakBus ? ' pre-go-bus-lane--streak' : ''
      }`}
      style={{ ['--bus-progress' as string]: String(progress) }}
    >
      <div className="pre-go-road">
        <div className="pre-go-road__line" />
        <div className="pre-go-road__line pre-go-road__line--trail" />
      </div>
      <div
        className={`pre-go-bus${reverse ? ' pre-go-bus--reverse' : ''}${
          isStreakBus ? ' pre-go-bus--streak' : ''
        }`}
        aria-hidden="true"
      >
        {isStreakBus ? (
          <img src="/streak_bus.svg" alt="" className="pre-go-bus__image" />
        ) : (
          <img src="/bus.svg" alt="" className="pre-go-bus__image" />
        )}
      </div>
    </div>
  )
}
