import { BusIcon } from './icons'

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
  return (
    <div
      className={`pre-go-bus-lane pre-go-bus-lane--${intent}`}
      style={{ ['--bus-progress' as string]: String(progress) }}
      aria-hidden="true"
    >
      <div className="pre-go-road">
        <div className="pre-go-road__line" />
        <div className="pre-go-road__line pre-go-road__line--trail" />
      </div>
      <div className={`pre-go-bus${reverse ? ' pre-go-bus--reverse' : ''}`}>
        <BusIcon />
        {streak ? <span className="pre-go-streak">{streak}</span> : null}
      </div>
    </div>
  )
}
