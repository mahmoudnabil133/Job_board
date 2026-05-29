import { useCallback, useEffect, useState, type FormEvent } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { getPublicJobs } from '../services/jobBoardApi';
import { isFetchJsonFailure } from '../lib/api';
import { GlassCard } from '../components/GlassCard';
import type { ApiJobListItem } from '../types/api';
import { formatJobType, formatSalaryRange, relativeTime } from '../lib/format';

export default function LandingPage() {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(() => searchParams.get('q') ?? '');
  const [items, setItems] = useState<ApiJobListItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);

  const runSearch = useCallback(async (q: string) => {
    const trimmed = q.trim();
    if (!trimmed) {
      setItems([]);
      setError(null);
      setSearched(false);
      setLoading(false);
      return;
    }
    setLoading(true);
    setSearched(true);
    const res = await getPublicJobs({ q: trimmed, per_page: 20, page: 1 });
    setLoading(false);
    if (isFetchJsonFailure(res)) {
      setError('We could not load jobs right now. Please try again in a moment.');
      setItems([]);
      return;
    }
    setError(null);
    setItems(res.items);
  }, []);

  useEffect(() => {
    const raw = searchParams.get('q') ?? '';
    const trimmed = raw.trim();
    setQuery(raw);
    if (trimmed) void runSearch(trimmed);
    else void runSearch('');
  }, [searchParams, runSearch]);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) {
      setSearchParams({});
      void runSearch('');
      return;
    }
    setSearchParams({ q: trimmed });
    void runSearch(trimmed);
  }

  return (
    <div className="min-h-screen bg-transparent">
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.16),_transparent_35%),linear-gradient(180deg,_#ffffff_0%,_#eef2ff_100%)]">
        <div className="absolute inset-0 z-0 opacity-30">
          <div className="absolute top-10 -left-8 w-72 h-72 bg-indigo-200 rounded-full mix-blend-screen filter blur-3xl animate-float"></div>
          <div className="absolute top-24 right-10 w-80 h-80 bg-violet-300 rounded-full mix-blend-screen filter blur-3xl animate-float [animation-delay:1s]"></div>
          <div className="absolute -bottom-12 left-16 w-72 h-72 bg-sky-200 rounded-full mix-blend-screen filter blur-3xl animate-float [animation-delay:2s]"></div>
        </div>

        <div className="container mx-auto px-4 z-10 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-bold text-slate-950 leading-[1.02] mb-6"
          >
            Your Career Gateway at <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">JW</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto mb-10"
          >
            Connecting Egypt's finest ITI graduates with leading technology employers across the region.
          </motion.p>

          <motion.form
            onSubmit={onSubmit}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <GlassCard className="flex flex-col sm:flex-row gap-4 justify-between items-center max-w-4xl mx-auto bg-white/90 px-4 py-4 sm:px-5 sm:py-5 rounded-[2rem] shadow-[0_45px_120px_-70px_rgba(79,70,229,0.8)] border border-slate-200/70">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search jobs, skills, or companies..."
                className="flex-1 min-w-0 px-4 py-4 bg-white/90 rounded-2xl border border-slate-200 text-slate-900 text-sm shadow-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              />
              <button
                type="submit"
                className="w-full sm:w-auto rounded-2xl bg-indigo-600 px-8 py-4 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 hover:bg-indigo-700 transition-colors"
              >
                Search jobs
              </button>
            </GlassCard>
          </motion.form>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {[
              { label: '1000+ Jobs', value: 'Verified roles' },
              { label: '300+ Employers', value: 'Hiring now' },
              { label: '97% Match', value: 'Fast applications' },
            ].map((stat) => (
              <GlassCard key={stat.label} className="p-6 text-left">
                <p className="text-sm uppercase tracking-[0.24em] text-indigo-600 font-semibold mb-3">{stat.value}</p>
                <p className="text-3xl font-bold text-slate-950">{stat.label}</p>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {(searched || loading) && (
        <section className="py-12 container mx-auto px-4 max-w-3xl">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            {loading ? 'Searching…' : `${items.length} matching role${items.length === 1 ? '' : 's'}`}
          </h2>
          {error && (
            <div className="rounded-3xl border border-red-200/60 bg-red-50/90 text-red-800 px-4 py-4 text-sm mb-4">
              {error}
            </div>
          )}
          {loading && (
            <div className="flex justify-center py-12">
              <div className="h-12 w-12 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin" />
            </div>
          )}
          {!loading &&
            items.map((job) => (
              <Link to={`/jobs/${job.slug}`} key={job.id}>
                <GlassCard className="block p-6 rounded-[1.75rem] shadow-2xl border border-slate-200/60 hover:border-indigo-300/60 hover:shadow-2xl transform hover:-translate-y-1 transition-all mb-3 text-left">
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-3">
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-950 text-lg truncate">{job.title}</p>
                      <p className="text-slate-500 text-sm truncate">{job.company?.name} · {job.location}</p>
                    </div>
                    <span className="text-indigo-600 font-semibold text-sm shrink-0">
                      {formatSalaryRange(job.salary_min, job.salary_max, job.salary_currency)}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2 text-xs">
                    <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full">{formatJobType(job.work_type, job.employment_type)}</span>
                    {job.category?.name && (
                      <span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full">{job.category.name}</span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mt-3">Posted {relativeTime(job.created_at)}</p>
                </GlassCard>
              </Link>
            ))}
          {!loading && searched && !error && items.length === 0 && (
            <GlassCard className="bg-white/90 border border-slate-200 p-10 rounded-[1.75rem] text-center text-slate-500 text-sm">
              No jobs matched that search. Try different keywords or browse companies.
            </GlassCard>
          )}
          {!loading && items.length > 0 && user?.role !== 'candidate' && (
            <p className="text-center text-sm text-gray-500 mt-6">
              <Link to="/register/employee" className="text-brand-red font-semibold hover:underline">
                Create a candidate account
              </Link>{' '}
              to apply and save jobs.
            </p>
          )}
        </section>
      )}

      <section className="py-20 container mx-auto px-4">
        <div className="flex flex-wrap justify-center gap-12 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-500">
          <div className="text-2xl font-bold">IBM</div>
          <div className="text-2xl font-bold">VOIS</div>
          <div className="text-2xl font-bold">VALEO</div>
          <div className="text-2xl font-bold">DELL</div>
          <div className="text-2xl font-bold">ORANGE</div>
        </div>
      </section>
    </div>
  );
}
