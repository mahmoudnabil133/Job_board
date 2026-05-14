import { useCallback, useEffect, useMemo, useState, type FormEvent } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  checkJobSaved,
  getPublicJobBySlug,
  submitApplication,
  toggleSavedJob,
} from '../services/jobBoardApi';
import { flattenApiErrors, getApiEnvelopeData, isFetchJsonFailure } from '../lib/api';
import type { ApiApplicationQuestion, ApiJobDetail } from '../types/api';
import { formatJobType, formatSalaryRange, relativeTime } from '../lib/format';

export default function JobDetailsPage() {
  const { slug } = useParams<{ slug: string }>();
  const { token, user } = useAuth();
  const navigate = useNavigate();

  const [job, setJob] = useState<ApiJobDetail | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [saved, setSaved] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [resumeFile, setResumeFile] = useState('');
  const [applicantName, setApplicantName] = useState('');
  const [applicantEmail, setApplicantEmail] = useState('');
  const [applicantPhone, setApplicantPhone] = useState('');
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [actionMsg, setActionMsg] = useState<string | null>(null);
  const [actionErr, setActionErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const isCandidate = user?.role === 'candidate';

  const loadJob = useCallback(async () => {
    if (!slug) return;
    setLoading(true);
    const res = await getPublicJobBySlug(slug);
    setLoading(false);
    if (isFetchJsonFailure(res) || !res.job) {
      setLoadError('This job could not be loaded. It may have been removed or the link is incorrect.');
      setJob(null);
      return;
    }
    setLoadError(null);
    setJob(res.job);
  }, [slug]);

  useEffect(() => {
    void loadJob();
  }, [loadJob]);

  useEffect(() => {
    if (!token || !job || !isCandidate) {
      setSaved(false);
      return;
    }
    let cancelled = false;
    void (async () => {
      const res = await checkJobSaved(token, job.id);
      if (cancelled) return;
      if (!isFetchJsonFailure(res)) setSaved(res.saved);
    })();
    return () => {
      cancelled = true;
    };
  }, [token, job, isCandidate]);

  const questions = useMemo(() => (job?.application_questions ?? []) as ApiApplicationQuestion[], [job]);

  async function onToggleSave() {
    setActionErr(null);
    setActionMsg(null);
    if (!token || !job) {
      navigate('/login', { state: { from: { pathname: `/jobs/${slug}` } } });
      return;
    }
    if (!isCandidate) {
      setActionErr('Only candidate accounts can save jobs.');
      return;
    }
    setBusy(true);
    const res = await toggleSavedJob(token, job.id);
    setBusy(false);
    if (isFetchJsonFailure(res)) {
      setActionErr(flattenApiErrors(res.data).join(' ') || 'Could not update saved jobs.');
      return;
    }
    const inner = getApiEnvelopeData<{ saved?: boolean }>(res.data);
    if (typeof inner?.saved === 'boolean') setSaved(inner.saved);
    else setSaved((s) => !s);
    setActionMsg('Saved list updated.');
  }

  async function onApply(e: FormEvent) {
    e.preventDefault();
    setActionErr(null);
    setActionMsg(null);
    if (!token || !job) {
      navigate('/login', { state: { from: { pathname: `/jobs/${slug}` } } });
      return;
    }
    if (!isCandidate) {
      setActionErr('Sign in with a candidate profile to apply.');
      return;
    }
    for (const q of questions) {
      if (q.is_required && !answers[q.id]?.trim()) {
        setActionErr(`Please answer: ${q.question}`);
        return;
      }
    }
    const answersPayload =
      questions.length > 0
        ? questions.map((q) => ({
            question_id: q.id,
            answer: answers[q.id] ?? '',
          }))
        : undefined;

    setBusy(true);
    const res = await submitApplication(token, {
      job_id: job.id,
      cover_letter: coverLetter.trim() || undefined,
      resume_file: resumeFile.trim() || undefined,
      applicant_name: applicantName.trim() || undefined,
      applicant_email: applicantEmail.trim() || undefined,
      applicant_phone: applicantPhone.trim() || undefined,
      answers: answersPayload,
    });
    setBusy(false);
    if (isFetchJsonFailure(res)) {
      setActionErr(flattenApiErrors(res.data).join(' ') || 'Application was not accepted.');
      return;
    }
    setActionMsg('Your application was submitted.');
    setCoverLetter('');
    setAnswers({});
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 flex justify-center">
        <div className="h-10 w-10 rounded-full border-2 border-brand-red border-t-transparent animate-spin" />
      </div>
    );
  }

  if (loadError || !job) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-12">
        <div className="container mx-auto px-4 max-w-lg text-center">
          <p className="text-gray-700 mb-6">{loadError}</p>
          <Link to="/jobs" className="text-brand-red font-semibold hover:underline">
            Back to job search
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <Link to="/jobs" className="text-sm text-gray-500 hover:text-brand-red mb-6 inline-flex items-center gap-1">
          ← Back to all jobs
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex gap-6 items-start mb-8">
                <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-500 font-bold text-sm shrink-0 overflow-hidden">
                  {job.company?.logo ? (
                    <img src={job.company.logo} alt="" className="w-full h-full object-cover" />
                  ) : (
                    job.company?.name?.slice(0, 2).toUpperCase() ?? 'Co'
                  )}
                </div>
                <div>
                  <h1 className="text-3xl font-bold mb-2 text-gray-900">{job.title}</h1>
                  <div className="flex flex-wrap gap-3 text-gray-500 text-sm">
                    <span>{job.company?.name}</span>
                    <span>·</span>
                    <span>{job.location}</span>
                    <span>·</span>
                    <span>{relativeTime(job.created_at)}</span>
                    <span>·</span>
                    <span className="text-emerald-700 font-medium uppercase text-xs tracking-wide">{job.status}</span>
                  </div>
                </div>
              </div>

              {job.description && (
                <section className="mb-8">
                  <h3 className="text-xl font-bold mb-3 text-gray-900">Overview</h3>
                  <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{job.description}</p>
                </section>
              )}
              {job.responsibilities && (
                <section className="mb-8">
                  <h3 className="text-xl font-bold mb-3 text-gray-900">Responsibilities</h3>
                  <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{job.responsibilities}</p>
                </section>
              )}
              {job.requirements && (
                <section className="mb-8">
                  <h3 className="text-xl font-bold mb-3 text-gray-900">Requirements</h3>
                  <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{job.requirements}</p>
                </section>
              )}
              {job.benefits && (
                <section>
                  <h3 className="text-xl font-bold mb-3 text-gray-900">Benefits</h3>
                  <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{job.benefits}</p>
                </section>
              )}
            </div>
          </div>

          <aside className="space-y-6">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <div className="space-y-3 mb-6 text-sm">
                <div className="flex justify-between gap-2">
                  <span className="text-gray-500">Salary</span>
                  <span className="font-bold text-gray-900 text-right">
                    {formatSalaryRange(job.salary_min, job.salary_max, job.salary_currency)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Type</span>
                  <span className="font-semibold text-brand-red-dark bg-brand-red/15 px-2 py-1 rounded text-xs">
                    {formatJobType(job.work_type, job.employment_type)}
                  </span>
                </div>
                {job.experience_level && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Experience</span>
                    <span className="font-semibold text-gray-900 capitalize">{job.experience_level}</span>
                  </div>
                )}
                {job.application_deadline && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Apply by</span>
                    <span className="font-semibold text-gray-900">{job.application_deadline}</span>
                  </div>
                )}
              </div>

              {actionMsg && (
                <div className="mb-3 text-sm text-emerald-800 bg-emerald-50 border border-emerald-100 rounded-lg px-3 py-2">
                  {actionMsg}
                </div>
              )}
              {actionErr && (
                <div className="mb-3 text-sm text-red-800 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                  {actionErr}
                </div>
              )}

              {isCandidate && job.status === 'approved' && (
                <form onSubmit={onApply} className="space-y-4 border-t border-gray-100 pt-6">
                  <h4 className="font-bold text-gray-900">Apply</h4>
                  <div>
                    <label className="text-xs font-medium text-gray-500">Cover letter (optional)</label>
                    <textarea
                      value={coverLetter}
                      onChange={(e) => setCoverLetter(e.target.value)}
                      rows={4}
                      className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-brand-red"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500">Resume URL / file path (optional)</label>
                    <input
                      value={resumeFile}
                      onChange={(e) => setResumeFile(e.target.value)}
                      className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-brand-red"
                    />
                  </div>
                  <div className="grid grid-cols-1 gap-3">
                    <input
                      placeholder="Your name (optional)"
                      value={applicantName}
                      onChange={(e) => setApplicantName(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-brand-red"
                    />
                    <input
                      placeholder="Contact email (optional)"
                      type="email"
                      value={applicantEmail}
                      onChange={(e) => setApplicantEmail(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-brand-red"
                    />
                    <input
                      placeholder="Phone (optional)"
                      value={applicantPhone}
                      onChange={(e) => setApplicantPhone(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-brand-red"
                    />
                  </div>
                  {questions.map((q) => (
                    <div key={q.id}>
                      <label className="text-xs font-medium text-gray-500">
                        {q.question}
                        {q.is_required ? ' *' : ''}
                      </label>
                      {q.input_type === 'textarea' ? (
                        <textarea
                          required={q.is_required}
                          value={answers[q.id] ?? ''}
                          onChange={(e) => setAnswers((a) => ({ ...a, [q.id]: e.target.value }))}
                          rows={3}
                          className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-brand-red"
                        />
                      ) : (
                        <input
                          required={q.is_required}
                          value={answers[q.id] ?? ''}
                          onChange={(e) => setAnswers((a) => ({ ...a, [q.id]: e.target.value }))}
                          className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-brand-red"
                        />
                      )}
                    </div>
                  ))}
                  <button
                    type="submit"
                    disabled={busy}
                    className="w-full bg-brand-red hover:bg-brand-red-dark text-white py-3 rounded-xl font-bold transition-all shadow-lg shadow-brand-red/25 disabled:opacity-60"
                  >
                    {busy ? 'Submitting…' : 'Submit application'}
                  </button>
                </form>
              )}

              {!token && (
                <p className="text-sm text-gray-600 mb-4">
                  <Link to="/login" state={{ from: { pathname: `/jobs/${slug}` } }} className="text-brand-red font-semibold">
                    Sign in
                  </Link>{' '}
                  as a candidate to apply or save this role.
                </p>
              )}

              {token && !isCandidate && (
                <p className="text-sm text-gray-600">Switch to a candidate account to apply to this role.</p>
              )}

              <button
                type="button"
                disabled={busy}
                onClick={() => void onToggleSave()}
                className="w-full mt-3 bg-white border border-gray-200 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-50 transition-all disabled:opacity-60"
              >
                {saved ? 'Remove from saved' : 'Save for later'}
              </button>
            </div>

            {job.company && (
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="font-bold mb-3 text-gray-900">About the company</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{job.company.description || 'Details appear on employer profiles.'}</p>
                {job.company.website && (
                  <a
                    href={job.company.website}
                    target="_blank"
                    rel="noreferrer"
                    className="text-brand-red text-sm font-bold mt-3 inline-block hover:underline"
                  >
                    Visit website
                  </a>
                )}
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}
