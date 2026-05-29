import { useCallback, useEffect, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { GlassCard } from '../components/GlassCard';
import { getPublicJobs } from '../services/jobBoardApi';

import { isFetchJsonFailure } from '../lib/api';
import type { ApiJobListItem, JobsListQuery } from '../types/api';
import { formatJobType, formatSalaryRange, relativeTime } from '../lib/format';

const WORK_TYPES: { value: string; label: string }[] = [
  { value: '', label: 'Any workplace' },
  { value: 'remote', label: 'Remote' },
  { value: 'onsite', label: 'On-site' },
  { value: 'hybrid', label: 'Hybrid' },
];

const EMP_TYPES: { value: string; label: string }[] = [
  { value: '', label: 'Any employment type' },
  { value: 'full_time', label: 'Full-time' },
  { value: 'part_time', label: 'Part-time' },
  { value: 'contract', label: 'Contract' },
  { value: 'freelance', label: 'Freelance' },
  { value: 'internship', label: 'Internship' },
];

const EXP_LEVELS: { value: string; label: string }[] = [
  { value: '', label: 'Any experience' },
  { value: 'entry', label: 'Entry' },
  { value: 'mid', label: 'Mid' },
  { value: 'senior', label: 'Senior' },
  { value: 'lead', label: 'Lead' },
];

export default function JobsPage() {
  const [items, setItems] = useState<ApiJobListItem[]>([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [q, setQ] = useState(() => {
    if (typeof window === 'undefined') return '';
    return new URLSearchParams(window.location.search).get('q') ?? '';
  });
  const [workType, setWorkType] = useState('');
  const [employmentType, setEmploymentType] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('');
  const [location, setLocation] = useState('');
  const [salaryMin, setSalaryMin] = useState('');
  const [salaryMax, setSalaryMax] = useState('');
  const [searchNonce, setSearchNonce] = useState(0);

  const load = useCallback(async () => {
    setLoading(true);
    const query: JobsListQuery = {
      page,
      per_page: 12,
      q: q.trim() || undefined,
      work_type: workType || undefined,
      employment_type: employmentType || undefined,
      experience_level: experienceLevel || undefined,
      location: location.trim() || undefined,
      salary_min: salaryMin ? Number(salaryMin) : undefined,
      salary_max: salaryMax ? Number(salaryMax) : undefined,
    };
    const res = await getPublicJobs(query);
    setLoading(false);
    if (isFetchJsonFailure(res)) {
      setError('We could not reach the job board service. Please try again in a moment.');
      setItems([]);
      return;
    }
    setError(null);
    setItems(res.items);
    const m = res.meta ?? {};
    setLastPage(typeof m.last_page === 'number' ? m.last_page : 1);
    setTotal(typeof m.total === 'number' ? m.total : res.items.length);
  }, [page, q, workType, employmentType, experienceLevel, location, salaryMin, salaryMax]);

  useEffect(() => {
    void load();
  }, [load, searchNonce]);

  function applyFilters(e: FormEvent) {
    e.preventDefault();
    setPage(1);
    setSearchNonce((n) => n + 1);
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-16">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col xl:flex-row gap-8">
          <aside className="w-full xl:w-80 shrink-0 space-y-6">
            <form onSubmit={applyFilters} className="glass-card p-6 space-y-5">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-indigo-600 font-semibold mb-2">Search & filters</p>
                <p className="text-sm text-slate-500">Refine job matches with location, salary and experience.</p>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Keywords</label>
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-brand-red"
                  placeholder="Title or role"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Location</label>
                <input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-brand-red"
                  placeholder="City or region"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Workplace</label>
                <select
                  value={workType}
                  onChange={(e) => setWorkType(e.target.value)}
                  className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-brand-red bg-white"
                >
                  {WORK_TYPES.map((o) => (
                    <option key={o.value || 'any'} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Employment</label>
                <select
                  value={employmentType}
                  onChange={(e) => setEmploymentType(e.target.value)}
                  className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-brand-red bg-white"
                >
                  {EMP_TYPES.map((o) => (
                    <option key={o.value || 'any-e'} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Experience</label>
                <select
                  value={experienceLevel}
                  onChange={(e) => setExperienceLevel(e.target.value)}
                  className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-brand-red bg-white"
                >
                  {EXP_LEVELS.map((o) => (
                    <option key={o.value || 'any-x'} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Min salary</label>
                  <input
                    type="number"
                    min={0}
                    value={salaryMin}
                    onChange={(e) => setSalaryMin(e.target.value)}
                    className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-brand-red"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Max salary</label>
                  <input
                    type="number"
                    min={0}
                    value={salaryMax}
                    onChange={(e) => setSalaryMax(e.target.value)}
                    className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-brand-red"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full rounded-2xl bg-indigo-600 text-white py-3 text-sm font-semibold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-500/20"
              >
                Apply filters
              </button>
            </form>
          </aside>

          <main className="flex-1 min-w-0 space-y-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4">
              <div>
                <h1 className="text-3xl font-bold text-slate-950">
                  {loading ? 'Searching…' : `${total} role${total === 1 ? '' : 's'} found`}
                </h1>
                <p className="text-sm text-slate-500 mt-1">Showing approved listings on ITI Careers.</p>
              </div>
              <div className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600 shadow-sm">
                Page {page} of {lastPage}
              </div>
            </div>

            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 text-red-800 px-4 py-3 text-sm">{error}</div>
            )}

            {loading && (
              <div className="flex justify-center py-20">
                <div className="h-12 w-12 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin" />
              </div>
            )}

            {!loading &&
              items.map((job) => (
                <Link to={`/jobs/${job.slug}`} key={job.id}>
                  <GlassCard className="block p-6 rounded-[1.75rem] shadow-2xl border border-slate-200/60 hover:border-indigo-300/60 hover:shadow-2xl transform hover:-translate-y-1 transition-all mb-4 text-left">
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
                      <div className="min-w-0">
                        <p className="font-semibold text-slate-950 text-lg truncate">{job.title}</p>
                        <p className="text-slate-500 text-sm truncate">{job.company?.name} · {job.location}</p>
                      </div>
                      <span className="text-indigo-600 font-semibold text-sm shrink-0">{formatSalaryRange(job.salary_min, job.salary_max, job.salary_currency)}</span>
                    </div>
                    <div className="flex flex-wrap gap-2 text-xs">
                      <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full">{formatJobType(job.work_type, job.employment_type)}</span>
                      {job.category?.name && (
                        <span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full">{job.category.name}</span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 mt-4">Posted {relativeTime(job.created_at)}</p>
                  </GlassCard>
                </Link>
              ))}

            {!loading && items.length === 0 && !error && (
              <GlassCard className="bg-white/90 border border-slate-200 p-10 rounded-[1.75rem] text-center text-slate-500 text-sm">
                No jobs matched your filters. Try broadening workplace or location.
              </GlassCard>
            )}

            {!loading && lastPage > 1 && (
              <div className="flex justify-center gap-3 pt-4">
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 disabled:opacity-40 hover:bg-white bg-gray-50"
                >
                  Previous
                </button>
                <span className="self-center text-sm text-gray-500">
                  Page {page} of {lastPage}
                </span>
                <button
                  type="button"
                  disabled={page >= lastPage}
                  onClick={() => setPage((p) => p + 1)}
                  className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 disabled:opacity-40 hover:bg-white bg-gray-50"
                >
                  Next
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
