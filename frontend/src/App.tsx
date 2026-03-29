import { useState, type ReactNode } from 'react'
import './App.css'
import { AppShell } from './components/AppShell'
import { AlarmIcon, HomeIcon, SettingsIcon, SunIcon, TripsIcon } from './components/icons'
import { DEFAULT_MORNING_ANSWERS } from './data/morningQuestions'
import { SignUpPage } from './pages/auth/SignUpPage'
import { WelcomePage } from './pages/auth/WelcomePage'
import { AlarmPage } from './pages/AlarmPage'
import { HomePage } from './pages/HomePage'
import { MorningPage } from './pages/MorningPage'
import { SettingsPage } from './pages/SettingsPage'
import { TripsPage } from './pages/TripsPage'
import type { NavItem, PageId } from './types/navigation'
import type { MorningAnswer } from './types/morning'
import { formatMinutes, getMorningRoutineMinutes } from './utils/time'

function App() {
  const [currentPage, setCurrentPage] = useState<PageId>('signup')
  const [morningAnswers, setMorningAnswers] =
    useState<Record<string, MorningAnswer>>(DEFAULT_MORNING_ANSWERS)
  const [username, setUsername] = useState('Bus the Builder')
  const [password, setPassword] = useState('password123')
  const [bufferTime, setBufferTime] = useState('00:10')

  const mainNavItems: NavItem[] = [
    { id: 'alarm', label: 'Alarm', icon: <AlarmIcon /> },
    { id: 'morning', label: 'Morning', icon: <SunIcon /> },
    { id: 'home', label: 'Home', icon: <HomeIcon /> },
    { id: 'trips', label: 'Trips', icon: <TripsIcon /> },
    { id: 'settings', label: 'Settings', icon: <SettingsIcon /> },
  ]

  return (
    <AppShell
      currentPage={currentPage}
      navItems={mainNavItems}
      onNavigate={setCurrentPage}
    >
      {renderPage({
        page: currentPage,
        onNavigate: setCurrentPage,
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

function renderPage({
  page,
  onNavigate,
  morningAnswers,
  onMorningAnswersChange,
  settings,
  onSettingsChange,
}: {
  page: PageId
  onNavigate: (page: PageId) => void
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
}): ReactNode {
  switch (page) {
    case 'signup':
      return <SignUpPage onContinue={() => onNavigate('welcome')} />
    case 'welcome':
      return (
        <WelcomePage
          onBack={() => onNavigate('signup')}
          onEnterApp={() => onNavigate('home')}
        />
      )
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
      return <HomePage />
  }
}

export default App
