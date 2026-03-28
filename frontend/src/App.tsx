import { useState, type FormEvent, type ReactNode } from 'react'
import { fetchAlarmPreview, fetchLeavePreview } from './api'
import './App.css'

type AuthPageId = 'signup' | 'welcome'
type MainPageId =
  | 'home'
  | 'alarm'
  | 'morning'
  | 'trips'
  | 'settings'
type PageId = AuthPageId | MainPageId

type NavItem = {
  id: MainPageId
  label: string
  icon: ReactNode
}

type MorningAnswer = 'yes' | 'no'

type MorningQuestion = {
  id: string
  label: string
  yesMinutes: number
  noMinutes: number
}

const MORNING_QUESTIONS: MorningQuestion[] = [
  { id: 'breakfast', label: 'Breakfast?', yesMinutes: 20, noMinutes: 5 },
  { id: 'night-out', label: 'Night out last night?', yesMinutes: 18, noMinutes: 0 },
  { id: 'shower', label: 'Shower this morning?', yesMinutes: 12, noMinutes: 0 },
  { id: 'pack-bag', label: 'Need to pack your bag?', yesMinutes: 8, noMinutes: 2 },
  { id: 'hair-makeup', label: 'Hair and makeup?', yesMinutes: 15, noMinutes: 3 },
  { id: 'coffee-stop', label: 'Making coffee before you go?', yesMinutes: 7, noMinutes: 0 },
]

const DEFAULT_MORNING_ANSWERS: Record<string, MorningAnswer> = {
  breakfast: 'yes',
  'night-out': 'no',
  shower: 'yes',
  'pack-bag': 'yes',
  'hair-makeup': 'no',
  'coffee-stop': 'yes',
}

function App() {
  const [currentPage, setCurrentPage] = useState<PageId>('signup')
  const [morningAnswers, setMorningAnswers] =
    useState<Record<string, MorningAnswer>>(DEFAULT_MORNING_ANSWERS)
  const [username, setUsername] = useState('Alex Morgan')
  const [password, setPassword] = useState('password123')
  const [bufferTime, setBufferTime] = useState('00:10')

  const mainNavItems: NavItem[] = [
    { id: 'alarm', label: 'Alarm', icon: <AlarmIcon /> },
    { id: 'morning', label: 'Morning', icon: <SunIcon /> },
    { id: 'home', label: 'Home', icon: <HomeIcon /> },
    { id: 'trips', label: 'Trips', icon: <TripsIcon /> },
    { id: 'settings', label: 'Settings', icon: <SettingsIcon /> },
  ]

  if (currentPage === 'signup') {
    return <SignUpPage onContinue={() => setCurrentPage('welcome')} />
  }

  if (currentPage === 'welcome') {
    return (
      <WelcomePage
        onBack={() => setCurrentPage('signup')}
        onEnterApp={() => setCurrentPage('home')}
      />
    )
  }

  return (
    <AppShell
      currentPage={currentPage}
      navItems={mainNavItems}
      onNavigate={setCurrentPage}
    >
      {renderMainPage({
        page: currentPage,
        morningAnswers,
        onMorningAnswersChange: setMorningAnswers,
        settings: {
          username,
          password,
          bufferTime,
          morningTime: formatMinutes(getMorningRoutineMinutes(morningAnswers)),
        },
        onSettingsChange: {
          setUsername,
          setPassword,
          setBufferTime,
        },
      })}
    </AppShell>
  )
}

function SignUpPage({ onContinue }: { onContinue: () => void }) {
  return (
    <main className="auth-page">
      <div className="auth-panel">
        <img src="/logo.svg" alt="Bussin logo" className="brand-logo" />
        <p className="eyebrow">Bussin</p>
        <h1>Sign up to build your commute routine.</h1>
        <p className="auth-copy">
          This is a placeholder sign up screen for now. We can connect it to
          your real authentication flow later.
        </p>

        <form className="auth-form">
          <label className="field">
            <span>Name</span>
            <input type="text" placeholder="Alex Morgan" />
          </label>

          <label className="field">
            <span>Email</span>
            <input type="email" placeholder="alex@example.com" />
          </label>

          <label className="field">
            <span>Password</span>
            <input type="password" placeholder="Create a password" />
          </label>

          <button type="button" className="primary-button" onClick={onContinue}>
            Continue
          </button>
        </form>
      </div>
    </main>
  )
}

function WelcomePage({
  onBack,
  onEnterApp,
}: {
  onBack: () => void
  onEnterApp: () => void
}) {
  return (
    <main className="auth-page">
      <div className="auth-panel auth-panel--welcome">
        <img src="/logo.svg" alt="Bussin logo" className="brand-logo" />
        <p className="eyebrow">Welcome</p>
        <h1>Your morning starts here.</h1>
        <p className="auth-copy">
          This page can become your onboarding or app intro. Right now it acts
          as a simple transition into the main experience.
        </p>

        <div className="feature-grid">
          <FeatureChip label="Wake-up timing" />
          <FeatureChip label="Leave reminders" />
          <FeatureChip label="Delay-aware trips" />
        </div>

        <div className="button-row">
          <button type="button" className="secondary-button" onClick={onBack}>
            Back
          </button>
          <button
            type="button"
            className="primary-button"
            onClick={onEnterApp}
          >
            Enter app
          </button>
        </div>
      </div>
    </main>
  )
}

function AppShell({
  currentPage,
  navItems,
  onNavigate,
  children,
}: {
  currentPage: MainPageId
  navItems: NavItem[]
  onNavigate: (page: MainPageId) => void
  children: ReactNode
}) {
  const currentLabel = navItems.find((item) => item.id === currentPage)?.label
  const isImmersivePage =
    currentPage === 'home' ||
    currentPage === 'alarm' ||
    currentPage === 'morning' ||
    currentPage === 'settings' ||
    currentPage === 'trips'

  return (
    <main className="app-shell">
      <header className="top-bar">
        <div>
          <img src="/logo.svg" alt="Bussin logo" className="brand-logo brand-logo--small" />
          {isImmersivePage ? null : (
            <>
              <p className="eyebrow">Bussin</p>
              <h1>{currentLabel}</h1>
            </>
          )}
        </div>
        {isImmersivePage ? null : <span className="status-pill">In progress</span>}
      </header>

      <section className="page-body">{children}</section>

      <nav className="bottom-nav" aria-label="Main navigation">
        {navItems.map((item) => {
          const isActive = item.id === currentPage

          return (
            <button
              key={item.id}
              type="button"
              className={`nav-button${isActive ? ' nav-button--active' : ''}`}
              onClick={() => onNavigate(item.id)}
              aria-current={isActive ? 'page' : undefined}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </button>
          )
        })}
      </nav>
    </main>
  )
}

function renderMainPage({
  page,
  morningAnswers,
  onMorningAnswersChange,
  settings,
  onSettingsChange,
}: {
  page: MainPageId
  morningAnswers: Record<string, MorningAnswer>
  onMorningAnswersChange: (answers: Record<string, MorningAnswer>) => void
  settings: {
    username: string
    password: string
    bufferTime: string
    morningTime: string
  }
  onSettingsChange: {
    setUsername: (value: string) => void
    setPassword: (value: string) => void
    setBufferTime: (value: string) => void
  }
}) {
  switch (page) {
    case 'alarm':
      return <AlarmPage />
    case 'morning':
      return (
        <MorningPage
          answers={morningAnswers}
          onAnswersChange={onMorningAnswersChange}
        />
      )
    case 'trips':
      return <TripsPage />
    case 'settings':
      return (
        <SettingsPage
          username={settings.username}
          password={settings.password}
          bufferTime={settings.bufferTime}
          morningTime={settings.morningTime}
          onUsernameChange={onSettingsChange.setUsername}
          onPasswordChange={onSettingsChange.setPassword}
          onBufferTimeChange={onSettingsChange.setBufferTime}
        />
      )
    case 'home':
      return <HomePage />
    default:
      return (
        <TemplatePage
          title="Home page"
          description="Use this as the main dashboard for live bus timing, next alarms, and commute recommendations."
          cards={[
            {
              title: 'Main snapshot',
              description: 'Placeholder for next bus, delay data, and your recommended leave time.',
            },
            {
              title: 'Quick actions',
              description: 'Placeholder for shortcuts like plan trip, edit alarm, or view route details.',
            },
            {
              title: 'Daily updates',
              description: 'Placeholder for commute alerts, service changes, or smart suggestions.',
            },
          ]}
        />
      )
  }
}

function HomePage() {
  const [origin, setOrigin] = useState('')
  const [destination, setDestination] = useState('')
  const [arrivalTime, setArrivalTime] = useState('08:45')
  const [leaveAt, setLeaveAt] = useState('')
  const [repeatSchedule, setRepeatSchedule] = useState<'no' | 'week' | 'custom'>('week')
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
      {showTripPreview ? null : <PreGoBusLane streak="12" />}

      <form className="home-actions" aria-label="Trip setup" onSubmit={handleSubmit}>
        {showTripPreview ? null : (
          <>
            <input
              type="text"
              className="home-input"
              placeholder="Where are you?"
              aria-label="Where are you?"
              value={origin}
              onChange={(event) => setOrigin(event.target.value)}
            />
            <input
              type="text"
              className="home-input"
              placeholder="Destination"
              aria-label="Destination"
              value={destination}
              onChange={(event) => setDestination(event.target.value)}
            />
          </>
        )}
        <label className="home-input home-time-field">
          <span>Arrival time</span>
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
              { value: 'week', label: 'Week' },
              { value: 'custom', label: 'Custom' },
            ].map((option) => (
              <button
                key={option.value}
                type="button"
                className={`home-regular-times__choice${
                  repeatSchedule === option.value ? ' home-regular-times__choice--active' : ''
                }`}
                onClick={() =>
                  setRepeatSchedule(option.value as 'no' | 'week' | 'custom')
                }
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
        </div>

        <button type="submit" className="home-go-button" disabled={isLoadingPreview}>
          {isLoadingPreview ? 'Loading...' : 'Go'}
        </button>
      </form>

      {showTripPreview ? null : <PreGoBusLane reverse />}
      {showTripPreview ? <TripPreview leaveAt={leaveAt} /> : null}
    </div>
  )
}

function AlarmPage() {
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
      <PreGoBusLane streak="12" />

      <form className="home-actions alarm-actions" aria-label="Alarm setup" onSubmit={handleSubmit}>
        <label className="home-input home-time-field">
          <span>Arrive</span>
          <input
            type="time"
            value={arrivalTime}
            onChange={(event) => setArrivalTime(event.target.value)}
            aria-label="Arrive time"
          />
        </label>

        <label className="home-input home-time-field">
          <span>Allocated time in the morning</span>
          <input
            type="time"
            value={morningTime}
            onChange={(event) => setMorningTime(event.target.value)}
            aria-label="Morning routine duration"
          />
        </label>

        <button type="submit" className="home-go-button" disabled={isLoadingAlarm}>
          {isLoadingAlarm ? 'Loading...' : 'Go'}
        </button>

        {alarmTime ? (
          <button type="button" className="alarm-set-button">
            Alarm set to : {alarmTime}
          </button>
        ) : null}
      </form>

      <PreGoBusLane reverse />
    </div>
  )
}

function MorningPage({
  answers,
  onAnswersChange,
}: {
  answers: Record<string, MorningAnswer>
  onAnswersChange: (answers: Record<string, MorningAnswer>) => void
}) {
  const totalMinutes = getMorningRoutineMinutes(answers)

  return (
    <div className="morning-page">
      <button type="button" className="alarm-set-button">
        Estimated routine: {formatMinutes(totalMinutes)}
      </button>

      <form className="morning-actions" aria-label="Morning routine questions">
        {MORNING_QUESTIONS.map((question) => (
          <section key={question.id} className="morning-question">
            <p className="morning-question__label">{question.label}</p>
            <div className="morning-toggle-group" role="group" aria-label={question.label}>
              <button
                type="button"
                className={`morning-toggle-button${
                  answers[question.id] === 'yes' ? ' morning-toggle-button--active' : ''
                }`}
                onClick={() => onAnswersChange({ ...answers, [question.id]: 'yes' })}
              >
                Yes
              </button>
              <button
                type="button"
                className={`morning-toggle-button${
                  answers[question.id] === 'no' ? ' morning-toggle-button--active' : ''
                }`}
                onClick={() => onAnswersChange({ ...answers, [question.id]: 'no' })}
              >
                No
              </button>
            </div>
          </section>
        ))}
      </form>
    </div>
  )
}

function SettingsPage({
  username,
  password,
  bufferTime,
  morningTime,
  onUsernameChange,
  onPasswordChange,
  onBufferTimeChange,
}: {
  username: string
  password: string
  bufferTime: string
  morningTime: string
  onUsernameChange: (value: string) => void
  onPasswordChange: (value: string) => void
  onBufferTimeChange: (value: string) => void
}) {
  return (
    <div className="settings-page">
      <div className="settings-row">
        <span className="settings-row__label">Username</span>
        <input
          type="text"
          className="home-input settings-input"
          value={username}
          onChange={(event) => onUsernameChange(event.target.value)}
          aria-label="Username"
        />
      </div>

      <div className="settings-row">
        <span className="settings-row__label">Password</span>
        <input
          type="password"
          className="home-input settings-input"
          value={password}
          onChange={(event) => onPasswordChange(event.target.value)}
          aria-label="Password"
        />
      </div>

      <div className="settings-row">
        <span className="settings-row__label">Buffer time</span>
        <label className="home-input home-time-field settings-time-field">
          <span>Default 10 mins</span>
          <input
            type="time"
            value={bufferTime}
            onChange={(event) => onBufferTimeChange(event.target.value)}
            aria-label="Buffer time"
          />
        </label>
      </div>

      <div className="settings-row">
        <span className="settings-row__label">Morning time</span>
        <label className="home-input home-time-field settings-time-field">
          <span>Based on morning page</span>
          <input
            type="time"
            value={morningTime}
            aria-label="Morning time"
            readOnly
          />
        </label>
      </div>
    </div>
  )
}

const PREVIOUS_TRIPS = [
  { day: 'Monday', left: '08:12', arrived: '08:41' },
  { day: 'Tuesday', left: '08:05', arrived: '08:38' },
  { day: 'Wednesday', left: '08:18', arrived: '08:49' },
  { day: 'Thursday', left: '09:02', arrived: '09:33' },
  { day: 'Friday', left: '08:27', arrived: '08:58' },
]

function TripsPage() {
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

function PreGoBusLane({
  reverse = false,
  streak,
}: {
  reverse?: boolean
  streak?: string
}) {
  return (
    <div className="pre-go-bus-lane" aria-hidden="true">
      <div className="pre-go-road" />
      <div className={`pre-go-bus${reverse ? ' pre-go-bus--reverse' : ''}`}>
        <BusIcon />
        {streak ? <span className="pre-go-streak">{streak}</span> : null}
      </div>
    </div>
  )
}

function TripPreview({ leaveAt }: { leaveAt: string }) {
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

function TemplatePage({
  title,
  description,
  cards,
}: {
  title: string
  description: string
  cards: Array<{ title: string; description: string }>
}) {
  return (
    <div className="template-page">
      <section className="hero-card">
        <div>
          <p className="section-label">Bussin</p>
          <h2>{title}</h2>
        </div>
        <p className="page-description">{description}</p>
      </section>

      <section className="card-grid">
        {cards.map((card) => (
          <article key={card.title} className="content-card">
            <p className="section-label">Bussin</p>
            <h3>{card.title}</h3>
            <p>{card.description}</p>
          </article>
        ))}
      </section>
    </div>
  )
}

function FeatureChip({ label }: { label: string }) {
  return <span className="feature-chip">{label}</span>
}

function formatMinutes(totalMinutes: number) {
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60

  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
}

function getMorningRoutineMinutes(answers: Record<string, MorningAnswer>) {
  return MORNING_QUESTIONS.reduce((sum, question) => {
    const answer = answers[question.id]

    return sum + (answer === 'yes' ? question.yesMinutes : question.noMinutes)
  }, 0)
}

function IconFrame({ children }: { children: ReactNode }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      {children}
    </svg>
  )
}

function BusIcon() {
  return (
    <svg viewBox="0 0 72 48" aria-hidden="true">
      <rect x="8" y="10" width="40" height="21" rx="7" fill="currentColor" />
      <rect x="13" y="14" width="13" height="8" rx="2" fill="#F4F8FF" opacity="0.95" />
      <rect x="29" y="14" width="15" height="8" rx="2" fill="#F4F8FF" opacity="0.95" />
      <path d="M48 17h7c2.8 0 5 2.2 5 5v9H48Z" fill="currentColor" />
      <circle cx="20" cy="34.5" r="4" fill="#090446" />
      <circle cx="47" cy="34.5" r="4" fill="#090446" />
      <path d="M12 26h45" stroke="#FEB95F" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  )
}

function AlarmIcon() {
  return (
    <IconFrame>
      <circle cx="12" cy="13" r="6.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path d="M12 10v3.5l2 1.2" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M7 4.5 5 6.5M17 4.5l2 2" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </IconFrame>
  )
}

function SunIcon() {
  return (
    <IconFrame>
      <circle cx="12" cy="12" r="4.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
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

function HomeIcon() {
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

function TripsIcon() {
  return (
    <IconFrame>
      <path
        d="M7 5.5h10a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path d="M8.5 18h0M15.5 18h0M8 10.5h8" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </IconFrame>
  )
}

function SettingsIcon() {
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

export default App
