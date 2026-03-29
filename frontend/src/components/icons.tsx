import type { ReactNode } from 'react'

function IconFrame({ children }: { children: ReactNode }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      {children}
    </svg>
  )
}

export function LocationIcon() {
  return (
    <IconFrame>
      <path
        d="M12 20s5-5.2 5-9a5 5 0 1 0-10 0c0 3.8 5 9 5 9Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="11" r="1.9" fill="currentColor" />
    </IconFrame>
  )
}

export function DestinationPinIcon() {
  return (
    <IconFrame>
      <path
        d="M12 4.5a4.5 4.5 0 0 1 4.5 4.5c0 3.3-4.5 8.5-4.5 8.5S7.5 12.3 7.5 9A4.5 4.5 0 0 1 12 4.5Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M10 9.8h4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </IconFrame>
  )
}

export function TimeIcon() {
  return (
    <IconFrame>
      <circle
        cx="12"
        cy="12"
        r="7"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M12 8.7v3.6l2.5 1.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </IconFrame>
  )
}

export function AlertIcon() {
  return (
    <IconFrame>
      <circle cx="12" cy="12" r="8" fill="currentColor" />
      <path
        d="M12 7.5v5"
        fill="none"
        stroke="#F4F8FF"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="12" cy="16.4" r="1.1" fill="#F4F8FF" />
    </IconFrame>
  )
}

export function FlameIcon() {
  return (
    <IconFrame>
      <path
        d="M12.1 3.8c.2 2.2-.8 3.4-1.9 4.5-1 1-1.9 2-1.9 3.7 0 2.1 1.6 3.9 3.8 3.9 2.4 0 4.2-1.8 4.2-4.3 0-2.6-1.7-4-2.8-5.4-.6-.8-1.2-1.5-1.4-2.4Z"
        fill="currentColor"
      />
      <path
        d="M12.2 10.1c.1 1-.3 1.6-.8 2.1-.4.4-.8.9-.8 1.6 0 .9.7 1.7 1.8 1.7 1.1 0 2-.9 2-2.1 0-1.2-.8-1.9-1.4-2.5-.4-.4-.7-.8-.8-1.3Z"
        fill="#fff5d6"
      />
    </IconFrame>
  )
}

export function BusIcon({ variant = 'default' }: { variant?: 'default' | 'streak' }) {
  const isStreak = variant === 'streak'

  return (
    <svg viewBox="0 0 72 48" aria-hidden="true">
      <rect x="8" y="10" width={isStreak ? '54' : '40'} height="21" rx="7" fill="currentColor" />
      {isStreak ? null : (
        <>
          <rect
            x="13"
            y="14"
            width="13"
            height="8"
            rx="2"
            fill="#F4F8FF"
            opacity="0.95"
          />
          <rect
            x="29"
            y="14"
            width="15"
            height="8"
            rx="2"
            fill="#F4F8FF"
            opacity="0.95"
          />
        </>
      )}
      <path d={`M${isStreak ? '62' : '48'} 17h7c2.8 0 5 2.2 5 5v9H${isStreak ? '62' : '48'}Z`} fill="currentColor" />
      <circle cx="20" cy="34.5" r="4" fill="#090446" />
      <circle cx={isStreak ? '61' : '47'} cy="34.5" r="4" fill="#090446" />
      <path
        d={`M12 26h${isStreak ? '59' : '45'}`}
        stroke="#FEB95F"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function AlarmIcon() {
  return (
    <IconFrame>
      <circle
        cx="12"
        cy="13"
        r="6.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M12 10v3.5l2 1.2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M7 4.5 5 6.5M17 4.5l2 2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </IconFrame>
  )
}

export function SunIcon() {
  return (
    <IconFrame>
      <circle
        cx="12"
        cy="12"
        r="4.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M12 3.5v2.2M12 18.3v2.2M20.5 12h-2.2M5.7 12H3.5M18.3 5.7l-1.6 1.6M7.3 16.7l-1.6 1.6M18.3 18.3l-1.6-1.6M7.3 7.3 5.7 5.7"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </IconFrame>
  )
}

export function HomeIcon() {
  return (
    <IconFrame>
      <path
        d="M5 10.5 12 5l7 5.5V19a1 1 0 0 1-1 1h-4.5v-5h-3v5H6a1 1 0 0 1-1-1z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </IconFrame>
  )
}

export function TripsIcon() {
  return (
    <IconFrame>
      <path
        d="M7 5.5h10a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M8.5 18h0M15.5 18h0M8 10.5h8"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </IconFrame>
  )
}

export function SettingsIcon() {
  return (
    <IconFrame>
      <path
        d="M12 8.3a3.7 3.7 0 1 0 0 7.4 3.7 3.7 0 0 0 0-7.4Zm8 3.7-1.8.6a6.6 6.6 0 0 1-.5 1.3l.9 1.7-1.9 1.9-1.7-.9c-.4.2-.8.4-1.3.5L12 20l-1.2-1.8a6.6 6.6 0 0 1-1.3-.5l-1.7.9-1.9-1.9.9-1.7c-.2-.4-.4-.8-.5-1.3L4 12l1.8-1.2c.1-.4.3-.9.5-1.3l-.9-1.7 1.9-1.9 1.7.9c.4-.2.8-.4 1.3-.5L12 4l1.2 1.8c.5.1.9.3 1.3.5l1.7-.9 1.9 1.9-.9 1.7c.2.4.4.9.5 1.3Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </IconFrame>
  )
}
