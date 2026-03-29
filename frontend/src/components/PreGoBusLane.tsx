import { BusIcon, FlameIcon } from './icons'

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
      className={`pre-go-bus-lane pre-go-bus-lane--${intent}`}
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
          <BusIcon variant="streak" />
        ) : (
          <img src="/bus.svg" alt="" className="pre-go-bus__image" />
        )}
        {isStreakBus ? (
          <span className="pre-go-streak-badge">
            <span className="pre-go-streak-badge__icon">
              <FlameIcon />
            </span>
            <span className="pre-go-streak-badge__value">{streak} day</span>
            <span className="pre-go-streak-badge__label">streak</span>
          </span>
        ) : null}
      </div>
    </div>
  )
}
