import { getPrimaryApiMessage, flattenApiErrors, type ApiErrorBody } from './api';

const LOGIN_FALLBACK =
  'We could not open a session with those credentials. Please confirm your email and password match what you used when you joined ITI Careers.';

const REGISTER_FALLBACK =
  'We could not finish creating your account. Please review the highlighted fields and try again.';

export function loginFailureMessage(status: number, data: unknown): string {
  if (status >= 500) {
    return 'Our hiring platform is temporarily unavailable—like a busy recruiter’s inbox. Please wait a moment and try signing in again.';
  }
  const flat = flattenApiErrors(data);
  const joined = flat.join(' ');
  if (/credential|incorrect|invalid|password|email/i.test(joined)) {
    return 'Your email or password did not match any active account. Double-check for typos, or create a candidate or employer profile if you are new here.';
  }
  const primary = getPrimaryApiMessage(data, '');
  if (primary && primary !== 'Validation errorrrs') return primary;
  if (flat.length) return flat[0] ?? LOGIN_FALLBACK;
  return LOGIN_FALLBACK;
}

export function registerFailureMessage(status: number, data: unknown): string {
  if (status >= 500) {
    return 'We hit a snag saving your profile—our servers are taking a coffee break. Please try submitting your registration again shortly.';
  }
  const flat = flattenApiErrors(data);
  if (flat.length) return flat.join(' ');
  const d = data as ApiErrorBody;
  if (typeof d.message === 'string' && d.message && d.message !== 'Validation errorrrs') return d.message;
  return REGISTER_FALLBACK;
}
