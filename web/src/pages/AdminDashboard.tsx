import { useCallback, useEffect, useState, type FormEvent } from 'react';
import {
  approveAdminJob,
  createAdminCategory,
  createAdminSkill,
  deleteAdminCategory,
  deleteAdminSkill,
  getAdminActivityLogs,
  getAdminCategories,
  getAdminPendingJobs,
  getAdminSkills,
  rejectAdminJob,
  updateAdminCategory,
  updateAdminSkill,
} from '../services/jobBoardApi';
import { useAuth } from '../context/AuthContext';
import { GlassCard } from '../components/GlassCard';
import { flattenApiErrors, isFetchJsonFailure } from '../lib/api';
import type { ApiActivityLog, ApiCategory, ApiJobDetail, ApiSkill } from '../types/api';

type Tab = 'jobs' | 'categories' | 'skills' | 'logs';

export default function AdminDashboard() {
  const { token } = useAuth();
  const [tab, setTab] = useState<Tab>('jobs');
  const [pending, setPending] = useState<ApiJobDetail[]>([]);
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [skills, setSkills] = useState<ApiSkill[]>([]);
  const [logs, setLogs] = useState<ApiActivityLog[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [catName, setCatName] = useState('');
  const [skillName, setSkillName] = useState('');
  const [busy, setBusy] = useState(false);

  const loadPending = useCallback(async () => {
    if (!token) return;
    const res = await getAdminPendingJobs(token, 1);
    if (!isFetchJsonFailure(res)) setPending(res.items);
  }, [token]);

  const loadCategories = useCallback(async () => {
    if (!token) return;
    const res = await getAdminCategories(token, 1);
    if (!isFetchJsonFailure(res)) setCategories(res.items);
  }, [token]);

  const loadSkills = useCallback(async () => {
    if (!token) return;
    const res = await getAdminSkills(token, 1);
    if (!isFetchJsonFailure(res)) setSkills(res.items);
  }, [token]);

  const loadLogs = useCallback(async () => {
    if (!token) return;
    const res = await getAdminActivityLogs(token, 1);
    if (!isFetchJsonFailure(res)) setLogs(res.items);
  }, [token]);

  useEffect(() => {
    let cancelled = false;
    async function boot() {
      if (!token) return;
      setLoading(true);
      setError(null);
      await Promise.all([loadPending(), loadCategories(), loadSkills(), loadLogs()]);
      if (!cancelled) setLoading(false);
    }
    void boot();
    return () => {
      cancelled = true;
    };
  }, [token, loadPending, loadCategories, loadSkills, loadLogs]);

  async function onApprove(jobId: number) {
    if (!token) return;
    setBusy(true);
    setError(null);
    const res = await approveAdminJob(token, jobId);
    setBusy(false);
    if (isFetchJsonFailure(res)) setError(flattenApiErrors(res.data).join(' ') || 'Approve failed.');
    await loadPending();
  }

  async function onReject(jobId: number) {
    if (!token) return;
    setBusy(true);
    setError(null);
    const res = await rejectAdminJob(token, jobId);
    setBusy(false);
    if (isFetchJsonFailure(res)) setError(flattenApiErrors(res.data).join(' ') || 'Reject failed.');
    await loadPending();
  }

  async function onAddCategory(e: FormEvent) {
    e.preventDefault();
    if (!token || !catName.trim()) return;
    const res = await createAdminCategory(token, catName.trim());
    if (isFetchJsonFailure(res)) {
      setError(flattenApiErrors(res.data).join(' ') || 'Category not created.');
      return;
    }
    setCatName('');
    await loadCategories();
  }

  async function onAddSkill(e: FormEvent) {
    e.preventDefault();
    if (!token || !skillName.trim()) return;
    const res = await createAdminSkill(token, skillName.trim());
    if (isFetchJsonFailure(res)) {
      setError(flattenApiErrors(res.data).join(' ') || 'Skill not created.');
      return;
    }
    setSkillName('');
    await loadSkills();
  }

  const tabBtn = (id: Tab, label: string) => (
    <button
      key={id}
      type="button"
      onClick={() => setTab(id)}
      className={`px-4 py-2 rounded-lg text-sm font-semibold ${
        tab === id ? 'bg-brand-red text-white' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-16">
      <div className="container mx-auto px-4 py-8 space-y-6 max-w-5xl">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Administration</h1>
          <p className="text-gray-600 text-sm mt-1">Moderate jobs, manage categories and skills, and review platform activity.</p>
        </div>

        <div className="flex flex-wrap gap-2">
          {tabBtn('jobs', 'Pending jobs')}
          {tabBtn('categories', 'Categories')}
          {tabBtn('skills', 'Skills')}
          {tabBtn('logs', 'Activity logs')}
        </div>

        {error && <div className="rounded-xl border border-red-200 bg-red-50 text-red-800 px-4 py-3 text-sm">{error}</div>}

        {loading && (
          <div className="flex justify-center py-16">
            <div className="h-10 w-10 rounded-full border-2 border-brand-red border-t-transparent animate-spin" />
          </div>
        )}

        {!loading && tab === 'jobs' && (
          <section className="space-y-4">
            {pending.map((job) => (
              <GlassCard className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
                <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                  <div>
                    <h2 className="font-bold text-lg text-gray-900">{job.title}</h2>
                    <p className="text-sm text-gray-500 mt-1">{job.company?.name} · {job.location} · Employer #{job.employer_id}</p>
                    <p className="text-xs text-gray-400 mt-2 line-clamp-3">{job.description}</p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => void onApprove(job.id)}
                      className="px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 disabled:opacity-50"
                    >
                      Approve
                    </button>
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => void onReject(job.id)}
                      className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-semibold hover:bg-red-700 disabled:opacity-50"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              </GlassCard>
            ))}
            {pending.length === 0 && <p className="text-sm text-gray-500">No jobs awaiting approval.</p>}
          </section>
        )}

        {!loading && tab === 'categories' && (
          <section className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm space-y-4">
            <form onSubmit={(e) => void onAddCategory(e)} className="flex gap-2 max-w-md">
              <input
                value={catName}
                onChange={(e) => setCatName(e.target.value)}
                placeholder="New category name"
                className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-brand-red"
              />
              <button type="submit" className="bg-brand-red text-white px-4 py-2 rounded-lg text-sm font-semibold">
                Add
              </button>
            </form>
            <ul className="divide-y divide-gray-100 border border-gray-100 rounded-lg">
              {categories.map((c) => (
                <GlassCard className="bg-white border border-gray-100 rounded-xl p-5 mb-3">
                  <span className="font-medium text-gray-900">{c.name}</span>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      className="text-xs text-brand-red font-semibold"
                      onClick={async () => {
                        const n = window.prompt('Rename category', c.name);
                        if (!n || !token) return;
                        const res = await updateAdminCategory(token, c.id, n.trim());
                        if (!isFetchJsonFailure(res)) await loadCategories();
                        else setError(flattenApiErrors(res.data).join(' '));
                      }}
                    >
                      Rename
                    </button>
                    <button
                      type="button"
                      className="text-xs text-red-600 font-semibold"
                      onClick={async () => {
                        if (!token || !window.confirm(`Delete category “${c.name}”?`)) return;
                        const res = await deleteAdminCategory(token, c.id);
                        if (!isFetchJsonFailure(res)) await loadCategories();
                        else setError(flattenApiErrors(res.data).join(' '));
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </GlassCard>
              ))}
            </ul>
          </section>
        )}

        {!loading && tab === 'skills' && (
          <section className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm space-y-4">
            <form onSubmit={(e) => void onAddSkill(e)} className="flex gap-2 max-w-md">
              <input
                value={skillName}
                onChange={(e) => setSkillName(e.target.value)}
                placeholder="New skill name"
                className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-brand-red"
              />
              <button type="submit" className="bg-brand-red text-white px-4 py-2 rounded-lg text-sm font-semibold">
                Add
              </button>
            </form>
            <ul className="divide-y divide-gray-100 border border-gray-100 rounded-lg">
              {skills.map((s) => (
                <GlassCard className="bg-white border border-gray-100 rounded-xl p-5 mb-3">
                  <span className="font-medium text-gray-900">{s.name}</span>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      className="text-xs text-brand-red font-semibold"
                      onClick={async () => {
                        const n = window.prompt('Rename skill', s.name);
                        if (!n || !token) return;
                        const res = await updateAdminSkill(token, s.id, n.trim());
                        if (!isFetchJsonFailure(res)) await loadSkills();
                        else setError(flattenApiErrors(res.data).join(' '));
                      }}
                    >
                      Rename
                    </button>
                    <button
                      type="button"
                      className="text-xs text-red-600 font-semibold"
                      onClick={async () => {
                        if (!token || !window.confirm(`Delete skill “${s.name}”?`)) return;
                        const res = await deleteAdminSkill(token, s.id);
                        if (!isFetchJsonFailure(res)) await loadSkills();
                        else setError(flattenApiErrors(res.data).join(' '));
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </GlassCard>
              ))}
            </ul>
          </section>
        )}

        {!loading && tab === 'logs' && (
          <section className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-100 font-bold text-sm">Platform activity</div>
            <ul className="divide-y divide-gray-100 max-h-[480px] overflow-y-auto">
              {logs.map((row) => (
                <GlassCard key={row.id} className="px-4 py-3 text-sm">
                  <p className="font-semibold text-gray-900">{row.action}</p>
                  <p className="text-gray-600">{row.description}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {row.user?.name} ({row.user?.role}) · {new Date(row.created_at).toLocaleString()}
                  </p>
                </GlassCard>
              ))}
              {logs.length === 0 && <GlassCard className="p-8 text-center text-gray-500 text-sm">No log entries.</GlassCard>}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
}
