type AlarmPreviewRequest = {
  arrivalTime: string
  morningDuration: string
}

type AlarmPreviewResponse = {
  alarmTime: string
}

type LeavePreviewRequest = {
  destination: string
  arrivalTime: string
}

type LeavePreviewResponse = {
  leaveAt: string
  walkingTimeSeconds: number
  busDepartureTime: string
  boardingTimeMins: number
  campusTraffic: number
  campusTrafficAdjustment: number
  estimatedDelay: number
}

const API_BASE = 'https://hot-solid-stingray.ngrok-free.app'
const DEMO_DESTINATION = 'University of Bath'
const DEMO_ARRIVAL_DATE = '20260310'
const DEMO_BUS_STOP_ID = '0180BAC30305'
const DEMO_BUS_ROUTE_ID = '120687'
const DEMO_START_LAT = 51.376551
const DEMO_START_LON = -2.384699

export async function fetchAlarmPreview(
  payload: AlarmPreviewRequest,
): Promise<AlarmPreviewResponse> {
  const leavePreview = await fetchLeavePreview({
    destination: DEMO_DESTINATION,
    arrivalTime: payload.arrivalTime,
  })

  return {
    alarmTime: subtractTimes(leavePreview.leaveAt, payload.morningDuration),
  }
}

export async function fetchLeavePreview(
  payload: LeavePreviewRequest,
): Promise<LeavePreviewResponse> {
  const arrivalDateTime = toBackendArrivalTime(payload.arrivalTime)
  const searchParams = new URLSearchParams({
    arrival_time: arrivalDateTime,
    bus_stop_id: DEMO_BUS_STOP_ID,
    bus_route_id: DEMO_BUS_ROUTE_ID,
    start_lat: String(DEMO_START_LAT),
    start_lon: String(DEMO_START_LON),
  })

  const response = await fetch(
    `${API_BASE}/departure-time?${searchParams.toString()}`,
    {
      headers: {
        'ngrok-skip-browser-warning': 'true',
      },
    },
  )

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`)
  }

  const data = (await response.json()) as {
    boarding_time_mins?: number
    bus_departure_time?: string
    campus_traffic?: number
    campus_traffic_adjustment?: number
    departure_time?: string
    dep_time?: string
    estimated_delay?: number
    walking_time?: number
  }

  const departureTime = data.departure_time ?? data.dep_time

  if (!departureTime) {
    throw new Error('Backend response did not include a departure time')
  }

  return {
    leaveAt: formatDisplayTime(departureTime),
    walkingTimeSeconds: Number(data.walking_time ?? 0),
    busDepartureTime: data.bus_departure_time ?? '',
    boardingTimeMins: Number(data.boarding_time_mins ?? 0),
    campusTraffic: Number(data.campus_traffic ?? 0),
    campusTrafficAdjustment: Number(data.campus_traffic_adjustment ?? 0),
    estimatedDelay: Number(data.estimated_delay ?? 0),
  }
}

function toBackendArrivalTime(arrivalTime: string) {
  return `${DEMO_ARRIVAL_DATE}T${arrivalTime}`
}

function formatDisplayTime(dateTime: string) {
  const date = new Date(dateTime)

  if (!Number.isNaN(date.getTime())) {
    return date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const timeMatch = dateTime.match(/(\d{2}):(\d{2})/)

  if (timeMatch) {
    return `${timeMatch[1]}:${timeMatch[2]}`
  }

  return dateTime
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
