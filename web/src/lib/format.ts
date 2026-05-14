export function formatSalaryRange(
  min?: number | null,
  max?: number | null,
  currency?: string | null,
): string {
  const c = currency || 'EGP';
  if (min != null && max != null) return `${min.toLocaleString()} – ${max.toLocaleString()} ${c}`;
  if (min != null) return `From ${min.toLocaleString()} ${c}`;
  if (max != null) return `Up to ${max.toLocaleString()} ${c}`;
  return 'Competitive';
}

export function formatJobType(work: string, employment: string): string {
  const w = work.replace(/_/g, ' ');
  const e = employment.replace(/_/g, ' ');
  return `${e} · ${w}`;
}

export function relativeTime(iso: string | undefined): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  const diff = Date.now() - d.getTime();
  const days = Math.floor(diff / (86400 * 1000));
  if (days <= 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 14) return `${days} days ago`;
  return d.toLocaleDateString();
}
