import type { ReactNode } from 'react'
import type { MainPageId, NavItem, PageId } from '../types/navigation'

type AppShellProps = {
  currentPage: PageId
  navItems: NavItem[]
  onNavigate: (page: MainPageId) => void
  children: ReactNode
}

export function AppShell({
  currentPage,
  navItems,
  onNavigate,
  children,
}: AppShellProps) {
  const showHeader = currentPage !== 'signup' && currentPage !== 'welcome'

  return (
    <main className="app-shell">
      {showHeader ? (
        <header className="top-bar">
          <img
            src="/logo.svg"
            alt="Bussin logo"
            className="brand-logo brand-logo--small"
          />
        </header>
      ) : null}

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
