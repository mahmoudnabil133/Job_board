import { useCallback, useEffect, useMemo, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  createEmployerCompany,
  createEmployerJob,
  deleteEmployerJob,
  getEmployerApplicationStats,
  getEmployerApplications,
  getEmployerCompany,
  getEmployerJobApplications,
  getEmployerJobs,
  getPublicJobs,
  updateEmployerApplicationStatus,
  updateEmployerCompany,
  updateEmployerJob,
} from '../services/jobBoardApi';
import { flattenApiErrors, isFetchJsonFailure } from '../lib/api';
import type { ApiApplicationListItem, ApiCompanyResource, ApiJobListItem } from '../types/api';
import { formatJobType, relativeTime } from '../lib/format';
import AuthAlertModal from '../components/AuthAlertModal';

type Tab = 'overview' | 'company' | 'jobs' | 'applications';

function uniqueCategoriesFromJobs(jobs: ApiJobListItem[]) {
  const m = new Map<number, string>();
  for (const j of jobs) {
    if (j.category?.id) m.set(j.category.id, j.category.name);
  }
  return [...m.entries()].map(([id, name]) => ({ id, name })).sort((a, b) => a.name.localeCompare(b.name));
}

/** Merge categories from approved public listings and this employer's own jobs (any status). */
async function loadCategoryOptionsForEmployer(token: string): Promise<{ id: number; name: string }[]> {
  const merged = new Map<number, string>();
  const ingest = (items: ApiJobListItem[]) => {
    for (const row of uniqueCategoriesFromJobs(items)) merged.set(row.id, row.name);
  };

  const MAX_PUBLIC_PAGES = 8;
  for (let page = 1; page <= MAX_PUBLIC_PAGES; page++) {
    const res = await getPublicJobs({ per_page: 80, page });
    if (isFetchJsonFailure(res)) break;
    ingest(res.items);
    const last = typeof res.meta?.last_page === 'number' ? res.meta.last_page : 1;
    if (page >= last || res.items.length === 0) break;
  }

  for (let page = 1; page <= 40; page++) {
    const res = await getEmployerJobs(token, page);
    if (isFetchJsonFailure(res)) break;
    ingest(res.items);
    const last = typeof res.meta?.last_page === 'number' ? res.meta.last_page : 1;
    if (page >= last || res.items.length === 0) break;
  }

  return [...merged.entries()].map(([id, name]) => ({ id, name })).sort((a, b) => a.name.localeCompare(b.name));
}

export default function EmployerDashboard() {
  const { token } = useAuth();
  const [tab, setTab] = useState<Tab>('overview');
  const [company, setCompany] = useState<ApiCompanyResource | null>(null);
  const [jobs, setJobs] = useState<ApiJobListItem[]>([]);
  const [applications, setApplications] = useState<ApiApplicationListItem[]>([]);
  const [stats, setStats] = useState<{ total: number; pending: number; shortlisted: number; accepted: number; rejected: number } | null>(
    null,
  );
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [cName, setCName] = useState('');
  const [cDesc, setCDesc] = useState('');
  const [cWebsite, setCWebsite] = useState('');
  const [cIndustry, setCIndustry] = useState('');
  const [cLocation, setCLocation] = useState('');
  const [cEmail, setCEmail] = useState('');
  const [cPhone, setCPhone] = useState('');
  const [cBusy, setCBusy] = useState(false);

  const [showJobForm, setShowJobForm] = useState(false);
  const [editingJobId, setEditingJobId] = useState<number | null>(null);
  const [jobTitle, setJobTitle] = useState('');
  const [jobDesc, setJobDesc] = useState('');
  const [jobLocation, setJobLocation] = useState('');
  const [jobWork, setJobWork] = useState('remote');
  const [jobEmployment, setJobEmployment] = useState('full_time');
  const [jobExp, setJobExp] = useState('');
  const [jobCategoryId, setJobCategoryId] = useState<number | ''>('');
  const [jobSalaryMin, setJobSalaryMin] = useState('');
  const [jobSalaryMax, setJobSalaryMax] = useState('');
  const [jobDeadline, setJobDeadline] = useState('');
  const [jobBusy, setJobBusy] = useState(false);

  const [selectedJobId, setSelectedJobId] = useState<number | null>(null);
  const [jobApps, setJobApps] = useState<ApiApplicationListItem[]>([]);
  const [successModal, setSuccessModal] = useState<{ title: string; message: string } | null>(null);

  const loadCompany = useCallback(async () => {
    if (!token) return;
    const res = await getEmployerCompany(token);
    if (isFetchJsonFailure(res)) {
      setCompany(null);
      return;
    }
    setCompany(res.company ?? null);
    if (res.company) {
      setCName(res.company.name);
      setCDesc(res.company.description ?? '');
      setCWebsite(res.company.website ?? '');
      setCIndustry(res.company.industry ?? '');
      setCLocation(res.company.location ?? '');
      setCEmail(res.company.contact_email ?? '');
      setCPhone(res.company.contact_phone ?? '');
    }
  }, [token]);

  const loadJobs = useCallback(async () => {
    if (!token) return;
    const res = await getEmployerJobs(token, 1);
    if (!isFetchJsonFailure(res)) setJobs(res.items);
  }, [token]);

  const loadApplications = useCallback(async () => {
    if (!token) return;
    const res = await getEmployerApplications(token, 1);
    if (!isFetchJsonFailure(res)) setApplications(res.items);
  }, [token]);

  const loadStats = useCallback(async () => {
    if (!token) return;
    const res = await getEmployerApplicationStats(token);
    if (!isFetchJsonFailure(res) && res.stats) setStats(res.stats);
  }, [token]);

  const loadCategoriesHint = useCallback(async () => {
    if (!token) {
      setCategories([]);
      return;
    }
    setCategories(await loadCategoryOptionsForEmployer(token));
  }, [token]);

  useEffect(() => {
    let cancelled = false;
    async function boot() {
      if (!token) return;
      setLoading(true);
      setError(null);
      await loadCompany();
      await loadJobs();
      await loadApplications();
      await loadStats();
      await loadCategoriesHint();
      if (!cancelled) setLoading(false);
    }
    void boot();
    return () => {
      cancelled = true;
    };
  }, [token, loadCompany, loadJobs, loadApplications, loadStats, loadCategoriesHint]);

  async function onSaveCompany(e: FormEvent) {
    e.preventDefault();
    if (!token) return;
    const wasCreate = !company;
    setCBusy(true);
    setError(null);
    const body = {
      name: cName.trim(),
      description: cDesc.trim() || undefined,
      website: cWebsite.trim() || undefined,
      industry: cIndustry.trim() || undefined,
      location: cLocation.trim() || undefined,
      contact_email: cEmail.trim() || undefined,
      contact_phone: cPhone.trim() || undefined,
    };
    const res = company ? await updateEmployerCompany(token, body) : await createEmployerCompany(token, body);
    setCBusy(false);
    if (isFetchJsonFailure(res)) {
      setError(flattenApiErrors(res.data).join(' ') || 'Company not saved.');
      return;
    }
    await loadCompany();
    if (wasCreate) {
      setSuccessModal({
        title: 'Company profile created',
        message:
          'Your company was saved successfully. You can post jobs from the Jobs tab. Each new listing is reviewed by an ITI Careers admin before it appears on the public board.',
      });
    } else {
      setSuccessModal({
        title: 'Company profile updated',
        message: 'Your company details were saved successfully.',
      });
    }
  }

  function openNewJob() {
    setEditingJobId(null);
    setJobTitle('');
    setJobDesc('');
    setJobLocation('');
    setJobWork('remote');
    setJobEmployment('full_time');
    setJobExp('');
    setJobCategoryId(categories[0]?.id ?? '');
    setJobSalaryMin('');
    setJobSalaryMax('');
    setJobDeadline('');
    setShowJobForm(true);
  }

  function openEditJob(j: ApiJobListItem) {
    setEditingJobId(j.id);
    setJobTitle(j.title);
    setJobDesc('');
    setJobLocation(j.location);
    setJobWork(j.work_type);
    setJobEmployment(j.employment_type);
    setJobExp('');
    setJobCategoryId(j.category?.id ?? '');
    setJobSalaryMin(j.salary_min != null ? String(j.salary_min) : '');
    setJobSalaryMax(j.salary_max != null ? String(j.salary_max) : '');
    setJobDeadline('');
    setShowJobForm(true);
  }

  async function onSaveJob(e: FormEvent) {
    e.preventDefault();
    if (!token || !company) {
      setError('Create your company profile before posting a job.');
      return;
    }
    if (!jobCategoryId) {
      setError('Choose a category.');
      return;
    }
    setJobBusy(true);
    setError(null);
    const wasNewJob = !editingJobId;
    const body: Record<string, unknown> = {
      company_id: company.id,
      category_id: jobCategoryId,
      title: jobTitle.trim(),
      location: jobLocation.trim(),
      work_type: jobWork,
      employment_type: jobEmployment,
      experience_level: jobExp || undefined,
      salary_min: jobSalaryMin ? Number(jobSalaryMin) : undefined,
      salary_max: jobSalaryMax ? Number(jobSalaryMax) : undefined,
      salary_currency: 'EGP',
      application_deadline: jobDeadline.trim() || undefined,
    };
    if (editingJobId) {
      if (jobDesc.trim().length >= 50) body.description = jobDesc.trim();
    } else {
      body.description = jobDesc.trim() || '—';
    }
    const res = editingJobId
      ? await updateEmployerJob(token, editingJobId, body)
      : await createEmployerJob(token, body);
    setJobBusy(false);
    if (isFetchJsonFailure(res)) {
      setError(flattenApiErrors(res.data).join(' ') || 'Job was not saved.');
      return;
    }
    setShowJobForm(false);
    await loadJobs();
    if (wasNewJob) {
      setSuccessModal({
        title: 'Job submitted for admin review',
        message:
          'Your posting is pending approval. Admins can accept or reject it from their dashboard. You will receive a notification when a decision is made. If it is approved, the role will appear on the public job listings.',
      });
    } else {
      setSuccessModal({
        title: 'Job updated',
        message:
          'Your changes were saved. If this role was still awaiting review, it remains in the admin queue until a decision is made.',
      });
    }
  }

  async function onDeleteJob(id: number) {
    if (!token) return;
    if (!window.confirm('Delete this job posting?')) return;
    const res = await deleteEmployerJob(token, id);
    if (isFetchJsonFailure(res)) {
      setError(flattenApiErrors(res.data).join(' ') || 'Could not delete job.');
      return;
    }
    await loadJobs();
  }

  async function loadAppsForJob(jobId: number) {
    if (!token) return;
    setSelectedJobId(jobId);
    const res = await getEmployerJobApplications(token, jobId, 1);
    if (!isFetchJsonFailure(res)) setJobApps(res.items);
  }

  async function onStatusChange(applicationId: number, application_status: string) {
    if (!token) return;
    const res = await updateEmployerApplicationStatus(token, applicationId, { application_status });
    if (isFetchJsonFailure(res)) {
      setError(flattenApiErrors(res.data).join(' ') || 'Status not updated.');
      return;
    }
    await loadApplications();
    if (selectedJobId) await loadAppsForJob(selectedJobId);
    await loadStats();
  }

  const tabBtn = (id: Tab, label: string) => (
    <button
      key={id}
      type="button"
      onClick={() => setTab(id)}
      className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
        tab === id ? 'bg-brand-red text-white' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
      }`}
    >
      {label}
    </button>
  );

  const pipeline = useMemo(() => stats, [stats]);

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-16">
      <div className="container mx-auto px-4 py-8 space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Employer workspace</h1>
            <p className="text-gray-500 text-sm mt-1">Company profile, job posts, and applications.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {tabBtn('overview', 'Overview')}
            {tabBtn('company', 'Company')}
            {tabBtn('jobs', 'Jobs')}
            {tabBtn('applications', 'Applications')}
          </div>
        </div>

        {error && <div className="rounded-xl border border-red-200 bg-red-50 text-red-800 px-4 py-3 text-sm">{error}</div>}

        {loading && (
          <div className="flex justify-center py-20">
            <div className="h-10 w-10 rounded-full border-2 border-brand-red border-t-transparent animate-spin" />
          </div>
        )}

        {!loading && tab === 'overview' && pipeline && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              ['Total apps', pipeline.total],
              ['Pending', pipeline.pending],
              ['Shortlisted', pipeline.shortlisted],
              ['Accepted', pipeline.accepted],
              ['Rejected', pipeline.rejected],
            ].map(([label, val]) => (
              <div key={String(label)} className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">{label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{val}</p>
              </div>
            ))}
          </div>
        )}

        {!loading && tab === 'company' && (
          <section className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 max-w-2xl">
            <h2 className="font-bold text-lg mb-4">{company ? 'Update company' : 'Create company'}</h2>
            <form onSubmit={(e) => void onSaveCompany(e)} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-800">Company name *</label>
                <input
                  required
                  value={cName}
                  onChange={(e) => setCName(e.target.value)}
                  className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-brand-red"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-800">Description</label>
                <textarea
                  value={cDesc}
                  onChange={(e) => setCDesc(e.target.value)}
                  rows={4}
                  className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-brand-red"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-800">Website</label>
                  <input
                    value={cWebsite}
                    onChange={(e) => setCWebsite(e.target.value)}
                    className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-brand-red"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-800">Industry</label>
                  <input
                    value={cIndustry}
                    onChange={(e) => setCIndustry(e.target.value)}
                    className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-brand-red"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-800">Location</label>
                <input
                  value={cLocation}
                  onChange={(e) => setCLocation(e.target.value)}
                  className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-brand-red"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-800">Contact email</label>
                  <input
                    type="email"
                    value={cEmail}
                    onChange={(e) => setCEmail(e.target.value)}
                    className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-brand-red"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-800">Contact phone</label>
                  <input
                    value={cPhone}
                    onChange={(e) => setCPhone(e.target.value)}
                    className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-brand-red"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={cBusy}
                className="bg-brand-red text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-brand-red-dark disabled:opacity-60"
              >
                {cBusy ? 'Saving…' : company ? 'Save changes' : 'Create company'}
              </button>
            </form>
          </section>
        )}

        {!loading && tab === 'jobs' && (
          <section className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="font-bold text-lg">Your job posts</h2>
              <button
                type="button"
                onClick={() => openNewJob()}
                className="bg-brand-red text-white px-5 py-2.5 rounded-xl font-bold hover:bg-brand-red-dark shadow-lg shadow-brand-red/25"
              >
                Post new job
              </button>
            </div>

            {showJobForm && (
              <form
                onSubmit={(e) => void onSaveJob(e)}
                className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm space-y-4 max-w-2xl"
              >
                <h3 className="font-bold">{editingJobId ? 'Edit job' : 'New job'}</h3>
                <div>
                  <label className="text-sm font-medium text-gray-800">Title *</label>
                  <input
                    required
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-brand-red"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-800">
                    Description {editingJobId ? '(optional unless changing; min 50 chars)' : '*'}
                  </label>
                  <textarea
                    required={!editingJobId}
                    value={jobDesc}
                    onChange={(e) => setJobDesc(e.target.value)}
                    rows={5}
                    className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-brand-red"
                    placeholder={editingJobId ? 'Leave blank to keep existing description, or enter 50+ characters to replace it.' : ''}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-800">Location *</label>
                  <input
                    required
                    value={jobLocation}
                    onChange={(e) => setJobLocation(e.target.value)}
                    className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-brand-red"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-800">Work type</label>
                    <select
                      value={jobWork}
                      onChange={(e) => setJobWork(e.target.value)}
                      className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg bg-white outline-none focus:ring-2 focus:ring-brand-red"
                    >
                      <option value="remote">Remote</option>
                      <option value="onsite">On-site</option>
                      <option value="hybrid">Hybrid</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-800">Employment type</label>
                    <select
                      value={jobEmployment}
                      onChange={(e) => setJobEmployment(e.target.value)}
                      className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg bg-white outline-none focus:ring-2 focus:ring-brand-red"
                    >
                      <option value="full_time">Full-time</option>
                      <option value="part_time">Part-time</option>
                      <option value="contract">Contract</option>
                      <option value="freelance">Freelance</option>
                      <option value="internship">Internship</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-800">Experience level</label>
                  <select
                    value={jobExp}
                    onChange={(e) => setJobExp(e.target.value)}
                    className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg bg-white outline-none focus:ring-2 focus:ring-brand-red"
                  >
                    <option value="">Any</option>
                    <option value="entry">Entry</option>
                    <option value="mid">Mid</option>
                    <option value="senior">Senior</option>
                    <option value="lead">Lead</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-800">Category *</label>
                  <select
                    required
                    value={jobCategoryId === '' ? '' : String(jobCategoryId)}
                    onChange={(e) => setJobCategoryId(e.target.value ? Number(e.target.value) : '')}
                    className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg bg-white outline-none focus:ring-2 focus:ring-brand-red"
                  >
                    <option value="">Select category</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                  <p className="text-[11px] text-gray-500 mt-1">
                    Categories are loaded from your own postings and approved public listings. Ask an admin to add new categories if one is missing.
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-800">Salary min</label>
                    <input
                      type="number"
                      value={jobSalaryMin}
                      onChange={(e) => setJobSalaryMin(e.target.value)}
                      className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-brand-red"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-800">Salary max</label>
                    <input
                      type="number"
                      value={jobSalaryMax}
                      onChange={(e) => setJobSalaryMax(e.target.value)}
                      className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-brand-red"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-800">Application deadline</label>
                  <input
                    type="date"
                    value={jobDeadline}
                    onChange={(e) => setJobDeadline(e.target.value)}
                    className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-brand-red"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={jobBusy}
                    className="bg-brand-red text-white px-5 py-2 rounded-lg font-semibold disabled:opacity-60"
                  >
                    {jobBusy ? 'Saving…' : 'Save job'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowJobForm(false)}
                    className="border border-gray-200 px-5 py-2 rounded-lg font-semibold text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            <div className="bg-white border border-gray-100 rounded-xl divide-y divide-gray-100 shadow-sm">
              {jobs.map((j) => (
                <div key={j.id} className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <p className="font-semibold text-gray-900">{j.title}</p>
                    <p className="text-xs text-gray-500">
                      {formatJobType(j.work_type, j.employment_type)} · {relativeTime(j.created_at)} ·{' '}
                      <span className="uppercase font-bold text-amber-800">{j.status}</span>
                    </p>
                    <button
                      type="button"
                      onClick={() => openEditJob(j)}
                      className="text-xs text-brand-red font-semibold hover:underline"
                    >
                      Preview / edit listing
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => void loadAppsForJob(j.id)}
                      className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50"
                    >
                      Applicants
                    </button>
                    <button
                      type="button"
                      onClick={() => openEditJob(j)}
                      className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => void onDeleteJob(j.id)}
                      className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-red-200 text-red-700 hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
              {jobs.length === 0 && <p className="p-8 text-center text-sm text-gray-500">No jobs yet.</p>}
            </div>

            {selectedJobId && (
              <div className="bg-sky-50 border border-sky-100 rounded-xl p-4">
                <h4 className="font-bold text-sm text-gray-900 mb-2">Applicants for job #{selectedJobId}</h4>
                <ul className="space-y-2">
                  {jobApps.map((a) => (
                    <li key={a.id} className="text-sm flex flex-col sm:flex-row sm:items-center gap-2 sm:justify-between bg-white rounded-lg border border-gray-100 px-3 py-2">
                      <span>
                        {a.job.title} · <span className="text-gray-500">{a.application_status}</span>
                      </span>
                      <div className="flex flex-wrap items-center gap-2">
                        <Link
                          to={`/messages?application=${a.id}`}
                          className="text-xs font-semibold text-brand-red hover:underline"
                        >
                          Message
                        </Link>
                        <select
                          className="text-xs border border-gray-200 rounded-md px-2 py-1 bg-white"
                          value=""
                          onChange={(e) => {
                            const v = e.target.value;
                            e.target.value = '';
                            if (v) void onStatusChange(a.id, v);
                          }}
                        >
                          <option value="">Set status…</option>
                          <option value="shortlisted">Shortlisted</option>
                          <option value="accepted">Accepted</option>
                          <option value="rejected">Rejected</option>
                        </select>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>
        )}

        {!loading && tab === 'applications' && (
          <section className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-100 font-bold">All applications</div>
            <ul className="divide-y divide-gray-100">
              {applications.map((a) => (
                <li key={a.id} className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div>
                    <p className="font-semibold">{a.job.title}</p>
                    <p className="text-xs text-gray-500">
                      {a.job.company} · {relativeTime(a.created_at)}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Link
                      to={`/messages?application=${a.id}`}
                      className="text-xs font-semibold text-brand-red hover:underline"
                    >
                      Message
                    </Link>
                    <span className="text-xs uppercase font-bold text-gray-600">{a.application_status}</span>
                    <select
                      className="text-xs border border-gray-200 rounded-md px-2 py-1 bg-white"
                      value=""
                      onChange={(e) => {
                        const v = e.target.value;
                        e.target.value = '';
                        if (v) void onStatusChange(a.id, v);
                      }}
                    >
                      <option value="">Update…</option>
                      <option value="shortlisted">Shortlisted</option>
                      <option value="accepted">Accepted</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>
                </li>
              ))}
              {applications.length === 0 && (
                <li className="p-8 text-center text-sm text-gray-500">No applications yet.</li>
              )}
            </ul>
          </section>
        )}
      </div>

      <AuthAlertModal
        open={!!successModal}
        title={successModal?.title ?? ''}
        message={successModal?.message ?? ''}
        onClose={() => setSuccessModal(null)}
        variant="success"
      />
    </div>
  );
}
