import { useCallback, useEffect, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  createCandidateProfile,
  deleteCandidateProfile,
  getCandidateApplications,
  getCandidateProfile,
  getSavedJobs,
  updateCandidateProfile,
} from '../services/jobBoardApi';
import { flattenApiErrors, isFetchJsonFailure } from '../lib/api';
import type { ApiApplicationListItem, ApiCandidateProfile, ApiSavedJobRow } from '../types/api';
import { relativeTime } from '../lib/format';

type Tab = 'overview' | 'profile' | 'applications' | 'saved';

export default function CandidateDashboard() {
  const { token, user } = useAuth();
  const [tab, setTab] = useState<Tab>('overview');
  const [profile, setProfile] = useState<ApiCandidateProfile | null>(null);
  const [profileMissing, setProfileMissing] = useState(false);
  const [applications, setApplications] = useState<ApiApplicationListItem[]>([]);
  const [saved, setSaved] = useState<ApiSavedJobRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [headline, setHeadline] = useState('');
  const [bio, setBio] = useState('');
  const [location, setLocation] = useState('');
  const [phone, setPhone] = useState('');
  const [resumeFile, setResumeFile] = useState('');
  const [portfolioUrl, setPortfolioUrl] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [years, setYears] = useState('');
  const [profileBusy, setProfileBusy] = useState(false);
  const [profileMsg, setProfileMsg] = useState<string | null>(null);

  const loadProfile = useCallback(async () => {
    if (!token) return;
    const res = await getCandidateProfile(token);
    if (isFetchJsonFailure(res)) {
      if (res.status === 404) {
        setProfile(null);
        setProfileMissing(true);
      } else {
        setError(flattenApiErrors(res.data).join(' ') || 'Could not load profile.');
      }
      return;
    }
    setProfileMissing(false);
    setProfile(res.profile ?? null);
    if (res.profile) {
      setHeadline(res.profile.headline ?? '');
      setBio(res.profile.bio ?? '');
      setLocation(res.profile.location ?? '');
      setPhone(res.profile.phone ?? '');
      setResumeFile(res.profile.resume_file ?? '');
      setPortfolioUrl(res.profile.portfolio_url ?? '');
      setLinkedinUrl(res.profile.linkedin_url ?? '');
      setYears(res.profile.years_of_experience != null ? String(res.profile.years_of_experience) : '');
    }
  }, [token]);

  const loadApplications = useCallback(async () => {
    if (!token) return;
    const res = await getCandidateApplications(token, 1);
    if (!isFetchJsonFailure(res)) setApplications(res.items);
  }, [token]);

  const loadSaved = useCallback(async () => {
    if (!token) return;
    const res = await getSavedJobs(token, 1);
    if (!isFetchJsonFailure(res)) setSaved(res.items);
  }, [token]);

  useEffect(() => {
    let cancelled = false;
    async function boot() {
      if (!token) return;
      setLoading(true);
      setError(null);
      await loadProfile();
      await loadApplications();
      await loadSaved();
      if (!cancelled) setLoading(false);
    }
    void boot();
    return () => {
      cancelled = true;
    };
  }, [token, loadProfile, loadApplications, loadSaved]);

  async function onSaveProfile(e: FormEvent) {
    e.preventDefault();
    if (!token) return;
    setProfileBusy(true);
    setProfileMsg(null);
    setError(null);
    const body = {
      headline: headline.trim(),
      bio: bio.trim() || undefined,
      location: location.trim() || undefined,
      phone: phone.trim() || undefined,
      resume_file: resumeFile.trim() || undefined,
      portfolio_url: portfolioUrl.trim() || undefined,
      linkedin_url: linkedinUrl.trim() || undefined,
      years_of_experience: years ? Number(years) : undefined,
    };
    const res = profile
      ? await updateCandidateProfile(token, body)
      : await createCandidateProfile(token, body);
    setProfileBusy(false);
    if (isFetchJsonFailure(res)) {
      setError(flattenApiErrors(res.data).join(' ') || 'Profile not saved.');
      return;
    }
    setProfileMsg('Profile saved.');
    await loadProfile();
  }

  async function onDeleteProfile() {
    if (!token || !profile) return;
    if (!window.confirm('Delete your candidate profile? This cannot be undone.')) return;
    const res = await deleteCandidateProfile(token);
    if (isFetchJsonFailure(res)) {
      setError(flattenApiErrors(res.data).join(' ') || 'Could not delete profile.');
      return;
    }
    setProfile(null);
    setProfileMissing(true);
    setProfileMsg(null);
  }

  const tabBtn = (id: Tab, label: string) => (
    <button
      key={id}
      type="button"
      onClick={() => setTab(id)}
      className={`w-full text-left px-6 py-4 font-medium transition-colors rounded-lg ${
        tab === id ? 'bg-brand-red text-white' : 'hover:bg-sky-50 text-gray-800'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-16">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <aside className="md:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
              <div className="w-24 h-24 bg-brand-red/10 rounded-full mx-auto mb-4 flex items-center justify-center text-brand-red text-2xl font-bold">
                {user?.name
                  ?.split(/\s+/)
                  .filter(Boolean)
                  .map((p) => p[0])
                  .join('')
                  .slice(0, 2)
                  .toUpperCase() ?? '?'}
              </div>
              <h2 className="font-bold text-lg text-gray-900">{user?.name}</h2>
              <p className="text-gray-500 text-sm mb-2">{profile?.headline || 'Complete your candidate profile'}</p>
              <Link to="/jobs" className="text-xs font-semibold text-brand-red hover:underline">
                Browse open roles
              </Link>
            </div>

            <nav className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden space-y-1 p-2">
              {tabBtn('overview', 'Dashboard')}
              {tabBtn('profile', 'My profile')}
              {tabBtn('applications', 'Applications')}
              {tabBtn('saved', 'Saved jobs')}
            </nav>
          </aside>

          <main className="md:col-span-3 space-y-8">
            {loading && (
              <div className="flex justify-center py-20">
                <div className="h-10 w-10 rounded-full border-2 border-brand-red border-t-transparent animate-spin" />
              </div>
            )}

            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 text-red-800 px-4 py-3 text-sm">{error}</div>
            )}

            {!loading && tab === 'overview' && (
              <>
                <section className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div className="bg-blue-50 text-blue-800 p-6 rounded-xl border border-blue-100">
                    <p className="text-sm font-medium mb-1">Applications</p>
                    <p className="text-3xl font-bold">{applications.length}</p>
                  </div>
                  <div className="bg-emerald-50 text-emerald-800 p-6 rounded-xl border border-emerald-100">
                    <p className="text-sm font-medium mb-1">Saved jobs</p>
                    <p className="text-3xl font-bold">{saved.length}</p>
                  </div>
                  <div className="bg-amber-50 text-amber-900 p-6 rounded-xl border border-amber-100">
                    <p className="text-sm font-medium mb-1">Profile</p>
                    <p className="text-lg font-bold">{profile ? 'Complete' : 'Action needed'}</p>
                  </div>
                </section>

                <section className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="font-bold text-lg">Recent applications</h3>
                    <button type="button" onClick={() => setTab('applications')} className="text-brand-red text-sm font-medium hover:underline">
                      View all
                    </button>
                  </div>
                  <div className="divide-y divide-gray-100">
                    {applications.slice(0, 5).map((a) => (
                      <div key={a.id} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
                        <div>
                          <h4 className="font-semibold text-gray-900">{a.job.title}</h4>
                          <p className="text-xs text-gray-500">
                            {a.job.company} · {relativeTime(a.created_at)}
                          </p>
                        </div>
                        <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase bg-gray-100 text-gray-700">
                          {a.application_status}
                        </span>
                      </div>
                    ))}
                    {applications.length === 0 && (
                      <p className="p-8 text-center text-sm text-gray-500">You have not applied to any roles yet.</p>
                    )}
                  </div>
                </section>
              </>
            )}

            {!loading && tab === 'profile' && (
              <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
                <h3 className="font-bold text-lg">{profile ? 'Edit profile' : 'Create profile'}</h3>
                {profileMissing && !profile && (
                  <p className="text-sm text-gray-600">Add a headline and optional details so employers can understand your background.</p>
                )}
                {profileMsg && <p className="text-sm text-emerald-800 bg-emerald-50 border border-emerald-100 rounded-lg px-3 py-2">{profileMsg}</p>}
                <form onSubmit={(e) => void onSaveProfile(e)} className="space-y-4 max-w-xl">
                  <div>
                    <label className="text-sm font-medium text-gray-800">Headline *</label>
                    <input
                      required
                      value={headline}
                      onChange={(e) => setHeadline(e.target.value)}
                      className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-brand-red"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-800">Bio</label>
                    <textarea
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      rows={4}
                      className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-brand-red"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-800">Location</label>
                      <input
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-brand-red"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-800">Phone</label>
                      <input
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-brand-red"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-800">Resume URL / path</label>
                    <input
                      value={resumeFile}
                      onChange={(e) => setResumeFile(e.target.value)}
                      className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-brand-red"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-800">Portfolio URL</label>
                      <input
                        value={portfolioUrl}
                        onChange={(e) => setPortfolioUrl(e.target.value)}
                        className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-brand-red"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-800">LinkedIn URL</label>
                      <input
                        value={linkedinUrl}
                        onChange={(e) => setLinkedinUrl(e.target.value)}
                        className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-brand-red"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-800">Years of experience</label>
                    <input
                      type="number"
                      min={0}
                      max={50}
                      value={years}
                      onChange={(e) => setYears(e.target.value)}
                      className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-brand-red"
                    />
                  </div>
                  <div className="flex gap-3 flex-wrap">
                    <button
                      type="submit"
                      disabled={profileBusy}
                      className="bg-brand-red text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-brand-red-dark disabled:opacity-60"
                    >
                      {profileBusy ? 'Saving…' : profile ? 'Update profile' : 'Create profile'}
                    </button>
                    {profile && (
                      <button
                        type="button"
                        onClick={() => void onDeleteProfile()}
                        className="border border-red-200 text-red-700 px-5 py-2.5 rounded-lg font-semibold hover:bg-red-50"
                      >
                        Delete profile
                      </button>
                    )}
                  </div>
                </form>
              </section>
            )}

            {!loading && tab === 'applications' && (
              <section className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                  <h3 className="font-bold text-lg">My applications</h3>
                </div>
                <div className="divide-y divide-gray-100">
                  {applications.map((a) => (
                    <div key={a.id} className="p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <div>
                        <Link
                          to={`/jobs?q=${encodeURIComponent(a.job.title)}`}
                          className="font-semibold text-gray-900 hover:text-brand-red"
                        >
                          {a.job.title}
                        </Link>
                        <p className="text-xs text-gray-500">
                          {a.job.company} · {a.job.location} · {relativeTime(a.created_at)}
                        </p>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <Link
                          to={`/messages?application=${a.id}`}
                          className="text-xs font-semibold text-brand-red hover:underline"
                        >
                          Message employer
                        </Link>
                        <span className="self-start px-3 py-1 rounded-full text-[10px] font-bold uppercase bg-gray-100 text-gray-700">
                          {a.application_status}
                        </span>
                      </div>
                    </div>
                  ))}
                  {applications.length === 0 && (
                    <p className="p-8 text-center text-sm text-gray-500">No applications yet. Explore the job board.</p>
                  )}
                </div>
              </section>
            )}

            {!loading && tab === 'saved' && (
              <section className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                  <h3 className="font-bold text-lg">Saved jobs</h3>
                </div>
                <ul className="divide-y divide-gray-100">
                  {saved.map((row) => (
                    <li key={row.id} className="p-6 flex justify-between items-center gap-4">
                      <div>
                        <Link to={`/jobs/${row.job.slug}`} className="font-semibold text-gray-900 hover:text-brand-red">
                          {row.job.title}
                        </Link>
                        <p className="text-xs text-gray-500">
                          {row.job.company?.name} · {row.job.location}
                        </p>
                      </div>
                      <span className="text-xs text-gray-400">{relativeTime(row.saved_at)}</span>
                    </li>
                  ))}
                  {saved.length === 0 && (
                    <li className="p-8 text-center text-sm text-gray-500">You have not saved any jobs.</li>
                  )}
                </ul>
              </section>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
