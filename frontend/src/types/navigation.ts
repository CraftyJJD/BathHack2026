import type { ReactNode } from 'react'

export type AuthPageId = 'signup' | 'welcome'

export type MainPageId =
  | 'home'
  | 'alarm'
  | 'morning'
  | 'trips'
  | 'settings'

export type PageId = AuthPageId | MainPageId

export type NavItem = {
  id: MainPageId
  label: string
  icon: ReactNode
}
