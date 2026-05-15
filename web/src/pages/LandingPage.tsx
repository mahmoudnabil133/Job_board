import { useCallback, useEffect, useState, type FormEvent } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { getPublicJobs } from '../services/jobBoardApi';
import { isFetchJsonFailure } from '../lib/api';
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
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden bg-[linear-gradient(168deg,var(--color-brand-surface-tint)_0%,#ffffff_40%,var(--color-brand-gradient-from)_100%)]">
        <div className="absolute inset-0 z-0 opacity-[0.14]">
          <div className="absolute top-0 -left-4 w-72 h-72 bg-brand-red-light rounded-full mix-blend-multiply filter blur-xl animate-float"></div>
          <div className="absolute top-0 -right-4 w-72 h-72 bg-brand-red rounded-full mix-blend-multiply filter blur-xl animate-float [animation-delay:1s]"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-brand-red-dark rounded-full mix-blend-multiply filter blur-xl animate-float [animation-delay:2s]"></div>
        </div>

        <div className="container mx-auto px-4 z-10 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-bold text-gray-900 mb-6"
          >
            Your Career Gateway at <span className="text-brand-red">JW</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-600 max-w-2xl mx-auto mb-10"
          >
            Connecting Egypt's finest ITI graduates with leading technology employers across the region.
          </motion.p>

          <motion.form
            onSubmit={onSubmit}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-lg mx-auto bg-white p-2 rounded-xl shadow-lg border border-gray-100"
          >
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search jobs, skills, or companies..."
              className="flex-1 px-4 py-3 bg-transparent border-none focus:ring-0 outline-none w-full"
            />
            <button
              type="submit"
              className="bg-brand-red hover:bg-brand-red-dark active:bg-brand-red-active text-white px-8 py-3 rounded-lg font-medium transition-colors w-full sm:w-auto"
            >
              Search jobs
            </button>
          </motion.form>
        </div>
      </section>

      {(searched || loading) && (
        <section className="py-12 container mx-auto px-4 max-w-3xl">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            {loading ? 'Searching…' : `${items.length} matching role${items.length === 1 ? '' : 's'}`}
          </h2>
          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 text-red-800 px-4 py-3 text-sm mb-4">{error}</div>
          )}
          {loading && (
            <div className="flex justify-center py-12">
              <div className="h-10 w-10 rounded-full border-2 border-brand-red border-t-transparent animate-spin" />
            </div>
          )}
          {!loading &&
            items.map((job) => (
              <Link
                to={`/jobs/${job.slug}`}
                key={job.id}
                className="block bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:border-brand-red/50 hover:shadow-md transition-all mb-3 text-left"
              >
                <div className="flex justify-between items-start gap-3 mb-2">
                  <div className="min-w-0">
                    <p className="font-bold text-gray-900 truncate">{job.title}</p>
                    <p className="text-gray-500 text-sm truncate">
                      {job.company?.name} · {job.location}
                    </p>
                  </div>
                  <span className="text-brand-red font-semibold text-sm shrink-0">
                    {formatSalaryRange(job.salary_min, job.salary_max, job.salary_currency)}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2 text-xs text-gray-600">
                  <span className="bg-gray-100 px-2 py-1 rounded">{formatJobType(job.work_type, job.employment_type)}</span>
                  {job.category?.name && (
                    <span className="bg-sky-50 text-sky-800 px-2 py-1 rounded">{job.category.name}</span>
                  )}
                </div>
                <p className="text-xs text-gray-400 mt-2">Posted {relativeTime(job.created_at)}</p>
              </Link>
            ))}
          {!loading && searched && !error && items.length === 0 && (
            <p className="text-gray-500 text-sm text-center py-8 bg-white rounded-xl border border-gray-100">
              No jobs matched that search. Try different keywords or browse companies.
            </p>
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
