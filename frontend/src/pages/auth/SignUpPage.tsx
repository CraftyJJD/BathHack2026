type SignUpPageProps = {
  onContinue: () => void
}

export function SignUpPage({ onContinue }: SignUpPageProps) {
  return (
    <div className="auth-page">
      <div className="auth-panel">
        <img src="/logo.svg" alt="Bussin logo" className="brand-logo" />
        <h1>Sign up to build your commute routine.</h1>
        <p className="auth-copy">
          Create your account to personalise alarms, travel timing, and your
          daily journey to campus.
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
    </div>
  )
}
