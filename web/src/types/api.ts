/** Shapes aligned with Laravel API resources (see `api` folder). */

export type ApiCompanyBrief = {
  id: number;
  name: string;
  logo_url?: string | null;
};

export type ApiCategoryBrief = {
  id: number;
  name: string;
  slug?: string;
};

export type ApiJobListItem = {
  id: number;
  title: string;
  employer_id: number;
  slug: string;
  location: string;
  work_type: string;
  employment_type: string;
  salary_min?: number | null;
  salary_max?: number | null;
  salary_currency?: string | null;
  application_deadline?: string | null;
  status: string;
  created_at: string;
  company: ApiCompanyBrief;
  category: ApiCategoryBrief;
  skills: string[];
};

export type ApiApplicationQuestion = {
  id: number;
  question: string;
  input_type: string;
  is_required: boolean;
};

export type ApiJobDetail = {
  id: number;
  employer_id: number;
  title: string;
  slug: string;
  description: string;
  responsibilities?: string | null;
  requirements?: string | null;
  benefits?: string | null;
  location: string;
  work_type: string;
  employment_type: string;
  experience_level?: string | null;
  salary_min?: number | null;
  salary_max?: number | null;
  salary_currency?: string | null;
  application_deadline?: string | null;
  status: string;
  created_at?: string | null;
  company?: ApiCompanyResource | null;
  category?: ApiCategoryBrief | null;
  skills?: { id: number; name: string }[];
  application_questions?: ApiApplicationQuestion[];
};

export type ApiCompanyResource = {
  id: number;
  name: string;
  description?: string | null;
  website?: string | null;
  logo?: string | null;
  industry?: string | null;
  location?: string | null;
  contact_email?: string | null;
  contact_phone?: string | null;
  employer_id: number;
  created_at?: string;
  updated_at?: string;
};

export type ApiCandidateProfile = {
  id: number;
  user_id: number;
  headline: string;
  bio?: string | null;
  location?: string | null;
  phone?: string | null;
  resume_file?: string | null;
  portfolio_url?: string | null;
  linkedin_url?: string | null;
  years_of_experience?: number | null;
  created_at?: string;
  updated_at?: string;
  user?: { id: number; name: string; email: string };
};

export type ApiApplicationListItem = {
  id: number;
  job_id: number;
  application_status: string;
  created_at: string;
  job: {
    id: number;
    title: string;
    company?: string | null;
    location?: string | null;
    work_type?: string | null;
  };
};

export type ApiApplicationDetail = ApiApplicationListItem & {
  candidate_id?: number;
  resume_file?: string | null;
  cover_letter?: string | null;
  applicant_name?: string | null;
  applicant_email?: string | null;
  applicant_phone?: string | null;
  employer_notes?: string | null;
  reviewed_at?: string | null;
  updated_at?: string;
  answers?: unknown[];
};

export type ApiSavedJobRow = {
  id: number;
  candidate_id: number;
  saved_at: string;
  job: {
    id: number;
    title: string;
    slug: string;
    location?: string | null;
    work_type?: string | null;
    employment_type?: string | null;
    salary_min?: number | null;
    salary_max?: number | null;
    salary_currency?: string | null;
    application_deadline?: string | null;
    status: string;
    company: { id: number; name: string; logo_url?: string | null };
    category: { id: number; name: string };
    skills: string[];
  };
};

export type ApiNotification = {
  id: number;
  title: string;
  message: string;
  type: string;
  is_read: boolean;
  created_at: string;
  created_at_human?: string;
};

export type ApiConversationListItem = {
  id: number;
  application_id: number;
  application_status: string;
  unread_count: number;
  last_message_at?: string | null;
  job: { id: number; title: string };
  other_party: { id: number; name: string };
  latest_message?: {
    id: number;
    body: string;
    sender_id: number;
    created_at: string;
  };
};

export type ApiMessage = {
  id: number;
  conversation_id: number;
  body: string;
  read_at?: string | null;
  created_at: string;
  sender: { id: number; name: string };
};

export type ApiActivityLog = {
  id: number;
  user_id: number;
  action: string;
  description: string;
  created_at: string;
  user?: { id: number; name: string; email: string; role: string };
};

export type ApiCategory = {
  id: number;
  name: string;
  slug: string;
  jobs_count?: number;
  created_at?: string;
  updated_at?: string;
};

export type ApiSkill = {
  id: number;
  name: string;
  jobs_count?: number;
  created_at?: string;
  updated_at?: string;
};

export type JobsListQuery = {
  q?: string;
  work_type?: string;
  employment_type?: string;
  experience_level?: string;
  category_id?: number;
  location?: string;
  salary_min?: number;
  salary_max?: number;
  per_page?: number;
  page?: number;
};
