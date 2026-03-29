import { FeatureChip } from '../../components/FeatureChip'

type WelcomePageProps = {
  onBack: () => void
  onEnterApp: () => void
}

export function WelcomePage({ onBack, onEnterApp }: WelcomePageProps) {
  return (
    <div className="auth-page">
      <div className="auth-panel auth-panel--welcome">
        <img src="/logo.svg" alt="Bussin logo" className="brand-logo" />
        <p className="eyebrow">Welcome</p>
        <h1>Your morning starts here.</h1>
        <p className="auth-copy">
          Set up smarter alarms, plan ahead for delays, and stay on top of your
          journey with one simple routine.
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
    </div>
  )
}
