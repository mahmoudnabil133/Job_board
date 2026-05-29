import { useEffect, useMemo, useState } from 'react';
import { GlassCard } from '../components/GlassCard';
import { Link } from 'react-router-dom';
import { getPublicJobs } from '../services/jobBoardApi';
import { isFetchJsonFailure } from '../lib/api';
import type { ApiJobListItem } from '../types/api';

function aggregateCompanies(jobs: ApiJobListItem[]) {
  const map = new Map<number, { id: number; name: string; count: number }>();
  for (const j of jobs) {
    const c = j.company;
    if (!c?.id) continue;
    const prev = map.get(c.id);
    if (prev) {
      prev.count += 1;
    } else {
      map.set(c.id, { id: c.id, name: c.name, count: 1 });
    }
  }
  return [...map.values()].sort((a, b) => a.name.localeCompare(b.name));
}

export default function CompaniesPage() {
  const [jobs, setJobs] = useState<ApiJobListItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function run() {
      setLoading(true);
      const res = await getPublicJobs({ per_page: 100 });
      if (cancelled) return;
      if (isFetchJsonFailure(res)) {
        setError('Could not load employers from the job board.');
        setJobs([]);
      } else {
        setError(null);
        setJobs(res.items);
      }
      setLoading(false);
    }
    void run();
    return () => {
      cancelled = true;
    };
  }, []);

  const companies = useMemo(() => aggregateCompanies(jobs), [jobs]);

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-16">
      <div className="container mx-auto px-4 py-10 max-w-4xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Companies hiring</h1>
        <p className="text-gray-600 mb-8">
          Organizations with approved roles on ITI Careers. Open a company to browse its live postings.
        </p>

        {loading && (
          <div className="flex justify-center py-16">
            <div className="h-10 w-10 rounded-full border-2 border-brand-red border-t-transparent animate-spin" />
          </div>
        )}

        {error && !loading && (
          <div className="rounded-xl border border-red-200 bg-red-50 text-red-800 px-4 py-3 text-sm">{error}</div>
        )}

        {!loading && !error && (
          <ul className="space-y-3">
            {companies.map((c) => (
              <li key={c.id}>
                <Link to={`/?q=${encodeURIComponent(c.name)}`}>
                  <GlassCard className="flex items-center justify-between p-5">
                    <span className="font-semibold text-gray-900">{c.name}</span>
                    <span className="text-sm text-gray-500">
                      {c.count} open role{c.count === 1 ? '' : 's'}
                    </span>
                  </GlassCard>
                </Link>
              </li>
            ))}
            {companies.length === 0 && (
              <p className="text-gray-500 text-sm">No companies with active listings yet.</p>
            )}
          </ul>
        )}
      </div>
    </div>
  );
}
