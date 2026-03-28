type SignUpPageProps = {
  onContinue: () => void
}

export function SignUpPage({ onContinue }: SignUpPageProps) {
  return (
    <div className="auth-page">
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
    </div>
  )
}
