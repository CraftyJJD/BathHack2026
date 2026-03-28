type AlarmPreviewRequest = {
  arrivalTime: string
  morningDuration: string
}

type AlarmPreviewResponse = {
  alarmTime: string
}

type LeavePreviewRequest = {
  origin: string
  destination: string
  arrivalTime: string
}

type LeavePreviewResponse = {
  leaveAt: string
}

const API_BASE = '/api'
const MOCK_NETWORK_DELAY_MS = 400

export async function fetchAlarmPreview(
  payload: AlarmPreviewRequest,
): Promise<AlarmPreviewResponse> {
  return fetchWithFallback<AlarmPreviewResponse>(
    `${API_BASE}/alarm/preview`,
    payload,
    () => ({
      alarmTime: subtractTimes(payload.arrivalTime, payload.morningDuration),
    }),
  )
}

export async function fetchLeavePreview(
  payload: LeavePreviewRequest,
): Promise<LeavePreviewResponse> {
  return fetchWithFallback<LeavePreviewResponse>(
    `${API_BASE}/trips/leave-preview`,
    payload,
    () => ({
      leaveAt: subtractTimes(payload.arrivalTime, '00:33'),
    }),
  )
}

async function fetchWithFallback<T>(
  url: string,
  payload: object,
  fallback: () => T,
): Promise<T> {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`)
    }

    return (await response.json()) as T
  } catch {
    return new Promise((resolve) => {
      window.setTimeout(() => resolve(fallback()), MOCK_NETWORK_DELAY_MS)
    })
  }
}

function subtractTimes(baseTime: string, offsetTime: string) {
  const [baseHours, baseMinutes] = baseTime.split(':').map(Number)
  const [offsetHours, offsetMinutes] = offsetTime.split(':').map(Number)
  const minutesInDay = 24 * 60
  const totalBaseMinutes = baseHours * 60 + baseMinutes
  const totalOffsetMinutes = offsetHours * 60 + offsetMinutes
  const resultMinutes =
    (totalBaseMinutes - totalOffsetMinutes + minutesInDay) % minutesInDay
  const hours = Math.floor(resultMinutes / 60)
  const minutes = resultMinutes % 60

  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
}
