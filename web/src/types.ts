/**
 * Core Types for ITI Careers Platform
 */

export enum UserRole {
  GUEST = 'guest',
  CANDIDATE = 'candidate',
  EMPLOYER = 'employer',
  ADMIN = 'admin',
}

/** Matches API `users.role` (Sanctum auth). */
export type AuthUserRole = 'candidate' | 'employer' | 'admin';

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: AuthUserRole;
  email_verified_at?: string | null;
  created_at?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  companyId?: string; // Only for employers
}

export interface Company {
  id: string;
  name: string;
  logo: string;
  description: string;
  industry: string;
  location: string;
  website?: string;
}

export enum JobType {
  FULL_TIME = 'Full-time',
  PART_TIME = 'Part-time',
  INTERNSHIP = 'Internship',
  CONTRACT = 'Contract',
  REMOTE = 'Remote',
}

export enum JobStatus {
  OPEN = 'open',
  CLOSED = 'closed',
  DRAFT = 'draft',
}

export interface Job {
  id: string;
  title: string;
  companyId: string;
  location: string;
  type: JobType;
  salary?: string;
  category: string;
  description: string;
  requirements: string[];
  benefits: string[];
  postedAt: string;
  status: JobStatus;
}

export enum ApplicationStatus {
  PENDING = 'pending',
  REVIEWING = 'reviewing',
  SHORTLISTED = 'shortlisted',
  INTERVIEWING = 'interviewing',
  OFFERED = 'offered',
  REJECTED = 'rejected',
}

export interface JobApplication {
  id: string;
  jobId: string;
  candidateId: string;
  status: ApplicationStatus;
  appliedAt: string;
  resumeUrl: string;
  coverLetter?: string;
}
