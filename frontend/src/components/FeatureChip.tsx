type FeatureChipProps = {
  label: string
}

export function FeatureChip({ label }: FeatureChipProps) {
  return <span className="feature-chip">{label}</span>
}
