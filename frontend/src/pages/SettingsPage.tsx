type SettingsPageProps = {
  username: string
  password: string
  bufferTime: string
  morningTime: string
  onUsernameChange: (value: string) => void
  onPasswordChange: (value: string) => void
  onBufferTimeChange: (value: string) => void
}

export function SettingsPage({
  username,
  password,
  bufferTime,
  morningTime,
  onUsernameChange,
  onPasswordChange,
  onBufferTimeChange,
}: SettingsPageProps) {
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
