import type { MorningAnswer, MorningQuestion } from '../types/morning'

export const MORNING_QUESTIONS: MorningQuestion[] = [
  { id: 'breakfast', label: 'Breakfast?', yesMinutes: 20, noMinutes: 5 },
  { id: 'night-out', label: 'Night out last night?', yesMinutes: 18, noMinutes: 0 },
  { id: 'shower', label: 'Shower this morning?', yesMinutes: 12, noMinutes: 0 },
  { id: 'pack-bag', label: 'Need to pack your bag?', yesMinutes: 8, noMinutes: 2 },
  { id: 'hair-makeup', label: 'Hair and makeup?', yesMinutes: 15, noMinutes: 3 },
  { id: 'coffee-stop', label: 'Making coffee before you go?', yesMinutes: 7, noMinutes: 0 },
]

export const DEFAULT_MORNING_ANSWERS: Record<string, MorningAnswer> = {
  breakfast: 'yes',
  'night-out': 'no',
  shower: 'yes',
  'pack-bag': 'yes',
  'hair-makeup': 'no',
  'coffee-stop': 'yes',
}
