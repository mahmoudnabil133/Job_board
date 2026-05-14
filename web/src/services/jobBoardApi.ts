import {
  fetchJson,
  getApiEnvelopeData,
  getResourceCollectionItems,
  getResourceCollectionMeta,
  isFetchJsonFailure,
} from '../lib/api';
import type {
  ApiActivityLog,
  ApiApplicationDetail,
  ApiApplicationListItem,
  ApiCandidateProfile,
  ApiCategory,
  ApiCompanyResource,
  ApiConversationListItem,
  ApiJobDetail,
  ApiJobListItem,
  ApiMessage,
  ApiNotification,
  ApiSavedJobRow,
  ApiSkill,
  JobsListQuery,
} from '../types/api';

function jobsListQueryString(q: JobsListQuery): string {
  const p = new URLSearchParams();
  if (q.q) p.set('q', q.q);
  if (q.work_type) p.set('work_type', q.work_type);
  if (q.employment_type) p.set('employment_type', q.employment_type);
  if (q.experience_level) p.set('experience_level', q.experience_level);
  if (q.category_id != null) p.set('category_id', String(q.category_id));
  if (q.location) p.set('location', q.location);
  if (q.salary_min != null) p.set('salary_min', String(q.salary_min));
  if (q.salary_max != null) p.set('salary_max', String(q.salary_max));
  if (q.per_page != null) p.set('per_page', String(q.per_page));
  if (q.page != null) p.set('page', String(q.page));
  const s = p.toString();
  return s ? `?${s}` : '';
}

export async function getPublicJobs(query?: JobsListQuery) {
  const res = await fetchJson<unknown>(`/v1/jobs${jobsListQueryString(query ?? {})}`);
  if (isFetchJsonFailure(res)) return res;
  return {
    ok: true as const,
    items: getResourceCollectionItems<ApiJobListItem>(res.data),
    meta: getResourceCollectionMeta(res.data),
  };
}

export async function getPublicJobBySlug(slug: string) {
  const res = await fetchJson<unknown>(`/v1/jobs/${encodeURIComponent(slug)}`);
  if (isFetchJsonFailure(res)) return res;
  const job = getApiEnvelopeData<ApiJobDetail>(res.data);
  return { ok: true as const, job };
}

export async function getCandidateProfile(token: string) {
  const res = await fetchJson<unknown>('/v1/candidate/profile', { method: 'GET', token });
  if (isFetchJsonFailure(res)) return res;
  const profile = getApiEnvelopeData<ApiCandidateProfile>(res.data);
  return { ok: true as const, profile };
}

export async function createCandidateProfile(token: string, body: Record<string, unknown>) {
  return fetchJson<unknown>('/v1/candidate/profile', {
    method: 'POST',
    token,
    body: JSON.stringify(body),
  });
}

export async function updateCandidateProfile(token: string, body: Record<string, unknown>) {
  return fetchJson<unknown>('/v1/candidate/profile', {
    method: 'PUT',
    token,
    body: JSON.stringify(body),
  });
}

export async function deleteCandidateProfile(token: string) {
  return fetchJson<unknown>('/v1/candidate/profile', { method: 'DELETE', token });
}

export async function getCandidateApplications(token: string, page = 1) {
  const res = await fetchJson<unknown>(`/v1/candidate/applications?page=${page}`, {
    method: 'GET',
    token,
  });
  if (isFetchJsonFailure(res)) return res;
  return {
    ok: true as const,
    items: getResourceCollectionItems<ApiApplicationListItem>(res.data),
    meta: getResourceCollectionMeta(res.data),
  };
}

export async function getCandidateApplication(token: string, id: number) {
  const res = await fetchJson<unknown>(`/v1/candidate/applications/${id}`, { method: 'GET', token });
  if (isFetchJsonFailure(res)) return res;
  const app = getApiEnvelopeData<ApiApplicationDetail>(res.data);
  return { ok: true as const, application: app };
}

export async function submitApplication(token: string, body: Record<string, unknown>) {
  return fetchJson<unknown>('/v1/candidate/applications', {
    method: 'POST',
    token,
    body: JSON.stringify(body),
  });
}

export async function withdrawApplication(token: string, id: number) {
  return fetchJson<unknown>(`/v1/candidate/applications/${id}/withdraw`, {
    method: 'PATCH',
    token,
  });
}

export async function getSavedJobs(token: string, page = 1) {
  const res = await fetchJson<unknown>(`/v1/candidate/saved-jobs?page=${page}`, { method: 'GET', token });
  if (isFetchJsonFailure(res)) return res;
  return {
    ok: true as const,
    items: getResourceCollectionItems<ApiSavedJobRow>(res.data),
    meta: getResourceCollectionMeta(res.data),
  };
}

export async function saveJob(token: string, jobId: number) {
  return fetchJson<unknown>(`/v1/candidate/jobs/${jobId}/save`, { method: 'POST', token });
}

export async function unsaveJob(token: string, jobId: number) {
  return fetchJson<unknown>(`/v1/candidate/jobs/${jobId}/unsave`, { method: 'DELETE', token });
}

export async function toggleSavedJob(token: string, jobId: number) {
  return fetchJson<unknown>(`/v1/candidate/jobs/${jobId}/toggle`, { method: 'POST', token });
}

export async function checkJobSaved(token: string, jobId: number) {
  const res = await fetchJson<unknown>(`/v1/candidate/jobs/${jobId}/saved`, { method: 'GET', token });
  if (isFetchJsonFailure(res)) return res;
  const inner = getApiEnvelopeData<{ saved?: boolean }>(res.data);
  return { ok: true as const, saved: Boolean(inner?.saved) };
}

export async function getEmployerCompany(token: string) {
  const res = await fetchJson<unknown>('/v1/employer/company', { method: 'GET', token });
  if (isFetchJsonFailure(res)) return res;
  const company = getApiEnvelopeData<ApiCompanyResource>(res.data);
  return { ok: true as const, company };
}

export async function createEmployerCompany(token: string, body: Record<string, unknown>) {
  return fetchJson<unknown>('/v1/employer/company', {
    method: 'POST',
    token,
    body: JSON.stringify(body),
  });
}

export async function updateEmployerCompany(token: string, body: Record<string, unknown>) {
  return fetchJson<unknown>('/v1/employer/company', {
    method: 'PUT',
    token,
    body: JSON.stringify(body),
  });
}

export async function deleteEmployerCompany(token: string) {
  return fetchJson<unknown>('/v1/employer/company', { method: 'DELETE', token });
}

export async function getEmployerJobs(token: string, page = 1) {
  const res = await fetchJson<unknown>(`/v1/employer/jobs?page=${page}`, { method: 'GET', token });
  if (isFetchJsonFailure(res)) return res;
  return {
    ok: true as const,
    items: getResourceCollectionItems<ApiJobListItem>(res.data),
    meta: getResourceCollectionMeta(res.data),
  };
}

export async function createEmployerJob(token: string, body: Record<string, unknown>) {
  return fetchJson<unknown>('/v1/employer/jobs', {
    method: 'POST',
    token,
    body: JSON.stringify(body),
  });
}

export async function updateEmployerJob(token: string, jobId: number, body: Record<string, unknown>) {
  return fetchJson<unknown>(`/v1/employer/jobs/${jobId}`, {
    method: 'PUT',
    token,
    body: JSON.stringify(body),
  });
}

export async function deleteEmployerJob(token: string, jobId: number) {
  return fetchJson<unknown>(`/v1/employer/jobs/${jobId}`, { method: 'DELETE', token });
}

export async function getEmployerApplicationStats(token: string) {
  const res = await fetchJson<unknown>('/v1/employer/applications/stats', { method: 'GET', token });
  if (isFetchJsonFailure(res)) return res;
  const stats = getApiEnvelopeData<{
    total: number;
    pending: number;
    shortlisted: number;
    accepted: number;
    rejected: number;
  }>(res.data);
  return { ok: true as const, stats };
}

export async function getEmployerApplications(token: string, page = 1) {
  const res = await fetchJson<unknown>(`/v1/employer/applications?page=${page}`, { method: 'GET', token });
  if (isFetchJsonFailure(res)) return res;
  return {
    ok: true as const,
    items: getResourceCollectionItems<ApiApplicationListItem>(res.data),
    meta: getResourceCollectionMeta(res.data),
  };
}

export async function getEmployerJobApplications(token: string, jobId: number, page = 1) {
  const res = await fetchJson<unknown>(`/v1/employer/jobs/${jobId}/applications?page=${page}`, {
    method: 'GET',
    token,
  });
  if (isFetchJsonFailure(res)) return res;
  return {
    ok: true as const,
    items: getResourceCollectionItems<ApiApplicationListItem>(res.data),
    meta: getResourceCollectionMeta(res.data),
  };
}

export async function getEmployerApplication(token: string, id: number) {
  const res = await fetchJson<unknown>(`/v1/employer/applications/${id}`, { method: 'GET', token });
  if (isFetchJsonFailure(res)) return res;
  const application = getApiEnvelopeData<ApiApplicationDetail>(res.data);
  return { ok: true as const, application };
}

export async function updateEmployerApplicationStatus(
  token: string,
  applicationId: number,
  body: { application_status: string; employer_notes?: string | null },
) {
  return fetchJson<unknown>(`/v1/employer/applications/${applicationId}/status`, {
    method: 'PATCH',
    token,
    body: JSON.stringify(body),
  });
}

export async function getAdminPendingJobs(token: string, page = 1) {
  const res = await fetchJson<unknown>(`/v1/admin/jobs/pending?page=${page}`, { method: 'GET', token });
  if (isFetchJsonFailure(res)) return res;
  return {
    ok: true as const,
    items: getResourceCollectionItems<ApiJobDetail>(res.data),
    meta: getResourceCollectionMeta(res.data),
  };
}

export async function approveAdminJob(token: string, jobId: number) {
  return fetchJson<unknown>(`/v1/admin/jobs/${jobId}/approve`, { method: 'PATCH', token });
}

export async function rejectAdminJob(token: string, jobId: number) {
  return fetchJson<unknown>(`/v1/admin/jobs/${jobId}/reject`, { method: 'PATCH', token });
}

export async function getAdminCategories(token: string, page = 1) {
  const res = await fetchJson<unknown>(`/v1/admin/categories?page=${page}`, { method: 'GET', token });
  if (isFetchJsonFailure(res)) return res;
  return {
    ok: true as const,
    items: getResourceCollectionItems<ApiCategory>(res.data),
    meta: getResourceCollectionMeta(res.data),
  };
}

export async function createAdminCategory(token: string, name: string) {
  return fetchJson<unknown>('/v1/admin/categories', {
    method: 'POST',
    token,
    body: JSON.stringify({ name }),
  });
}

export async function updateAdminCategory(token: string, id: number, name: string) {
  return fetchJson<unknown>(`/v1/admin/categories/${id}`, {
    method: 'PUT',
    token,
    body: JSON.stringify({ name }),
  });
}

export async function deleteAdminCategory(token: string, id: number) {
  return fetchJson<unknown>(`/v1/admin/categories/${id}`, { method: 'DELETE', token });
}

export async function getAdminSkills(token: string, page = 1) {
  const res = await fetchJson<unknown>(`/v1/admin/skills?page=${page}`, { method: 'GET', token });
  if (isFetchJsonFailure(res)) return res;
  return {
    ok: true as const,
    items: getResourceCollectionItems<ApiSkill>(res.data),
    meta: getResourceCollectionMeta(res.data),
  };
}

export async function createAdminSkill(token: string, name: string) {
  return fetchJson<unknown>('/v1/admin/skills', {
    method: 'POST',
    token,
    body: JSON.stringify({ name }),
  });
}

export async function updateAdminSkill(token: string, id: number, name: string) {
  return fetchJson<unknown>(`/v1/admin/skills/${id}`, {
    method: 'PUT',
    token,
    body: JSON.stringify({ name }),
  });
}

export async function deleteAdminSkill(token: string, id: number) {
  return fetchJson<unknown>(`/v1/admin/skills/${id}`, { method: 'DELETE', token });
}

export async function getAdminActivityLogs(token: string, page = 1) {
  const res = await fetchJson<unknown>(`/v1/admin/logs/activity-logs?page=${page}`, { method: 'GET', token });
  if (isFetchJsonFailure(res)) return res;
  return {
    ok: true as const,
    items: getResourceCollectionItems<ApiActivityLog>(res.data),
    meta: getResourceCollectionMeta(res.data),
  };
}

export async function getMyActivityLogs(token: string, page = 1) {
  const res = await fetchJson<unknown>(`/v1/logs/my-activity-logs?page=${page}`, { method: 'GET', token });
  if (isFetchJsonFailure(res)) return res;
  return {
    ok: true as const,
    items: getResourceCollectionItems<ApiActivityLog>(res.data),
    meta: getResourceCollectionMeta(res.data),
  };
}

export async function changePassword(token: string, current_password: string, new_password: string) {
  return fetchJson<unknown>('/v1/user/change-password', {
    method: 'POST',
    token,
    body: JSON.stringify({ current_password, new_password }),
  });
}

export async function getNotifications(token: string, page = 1) {
  const res = await fetchJson<unknown>(`/v1/notifications?page=${page}`, { method: 'GET', token });
  if (isFetchJsonFailure(res)) return res;
  return {
    ok: true as const,
    items: getResourceCollectionItems<ApiNotification>(res.data),
    meta: getResourceCollectionMeta(res.data),
  };
}

export async function getUnreadNotificationCount(token: string) {
  const res = await fetchJson<unknown>('/v1/notifications/unread-count', { method: 'GET', token });
  if (isFetchJsonFailure(res)) return res;
  const inner = getApiEnvelopeData<{ unread_count?: number }>(res.data);
  return { ok: true as const, count: inner?.unread_count ?? 0 };
}

export async function markNotificationRead(token: string, id: number) {
  return fetchJson<unknown>(`/v1/notifications/${id}/read`, { method: 'PATCH', token });
}

export async function markAllNotificationsRead(token: string) {
  return fetchJson<unknown>('/v1/notifications/mark-all-read', { method: 'POST', token });
}

export async function getConversations(token: string, page = 1) {
  const res = await fetchJson<unknown>(`/v1/conversations?page=${page}`, { method: 'GET', token });
  if (isFetchJsonFailure(res)) return res;
  return {
    ok: true as const,
    items: getResourceCollectionItems<ApiConversationListItem>(res.data),
    meta: getResourceCollectionMeta(res.data),
  };
}

/** Sum of `unread_count` across all inbox pages (candidates & employers only). */
export async function getTotalUnreadMessages(token: string): Promise<number> {
  let total = 0;
  let page = 1;
  let lastPage = 1;
  const maxPages = 40;
  while (page <= lastPage && page <= maxPages) {
    const res = await getConversations(token, page);
    if (isFetchJsonFailure(res)) return total;
    for (const c of res.items) total += Number(c.unread_count) || 0;
    lastPage = typeof res.meta?.last_page === 'number' ? res.meta.last_page : 1;
    if (res.items.length === 0) break;
    page += 1;
  }
  return total;
}

export async function getConversationMessages(token: string, conversationId: number, page = 1) {
  const res = await fetchJson<unknown>(
    `/v1/conversations/${conversationId}/messages?page=${page}`,
    { method: 'GET', token },
  );
  if (isFetchJsonFailure(res)) return res;
  return {
    ok: true as const,
    items: getResourceCollectionItems<ApiMessage>(res.data),
    meta: getResourceCollectionMeta(res.data),
  };
}

export async function postConversationMessage(token: string, conversationId: number, body: string) {
  return fetchJson<unknown>(`/v1/conversations/${conversationId}/messages`, {
    method: 'POST',
    token,
    body: JSON.stringify({ body }),
  });
}

export async function markConversationRead(token: string, conversationId: number) {
  return fetchJson<unknown>(`/v1/conversations/${conversationId}/read`, { method: 'PATCH', token });
}

export async function getApplicationMessages(token: string, applicationId: number, page = 1) {
  const res = await fetchJson<unknown>(`/v1/applications/${applicationId}/messages?page=${page}`, {
    method: 'GET',
    token,
  });
  if (isFetchJsonFailure(res)) return res;
  return {
    ok: true as const,
    items: getResourceCollectionItems<ApiMessage>(res.data),
    meta: getResourceCollectionMeta(res.data),
  };
}

export async function postApplicationMessage(token: string, applicationId: number, body: string) {
  return fetchJson<unknown>(`/v1/applications/${applicationId}/messages`, {
    method: 'POST',
    token,
    body: JSON.stringify({ body }),
  });
}
