// ─── Auth Models ──────────────────────────────────────────────────────────────
export interface RegisterRequest {
  firstName: string;
  lastName:  string;
  email:     string;
  password:  string;
}

export interface LoginRequest {
  email:    string;
  password: string;
}

export interface VerifyEmailRequest {
  userId: string;
  token:  string;
}
export interface forgotPasswordDto {
  success: boolean;
  message: string;
}
 
export interface resetPasswordDto {
  success: boolean;
  message: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword:  string;
}

export interface AuthResponse {
  token:        string;
  refreshToken: string;
  expiresAt:    string;
  user:         UserProfile;
}

export interface UserProfile {
  userId:    string;
  firstName: string;
  lastName : string;
  email:     string;
  role:      string;
}

// ─── Application Status ───────────────────────────────────────────────────────
export type ApplicationStatus =
  | 'Draft' | 'Submitted' | 'UnderReview'
  | 'InterviewScheduled' | 'Interviewed'
  | 'Accepted' | 'Rejected' | 'Withdrawn';

export const APPLICATION_STATUSES: ApplicationStatus[] = [
  'Draft', 'Submitted', 'UnderReview',
  'InterviewScheduled', 'Interviewed',
  'Accepted', 'Rejected', 'Withdrawn',
];

// ─── Interview Type ───────────────────────────────────────────────────────────
export type InterviewType = 'Phone' | 'Video' | 'OnSite' | 'Technical' | 'HRRound' | 'Final';

export const INTERVIEW_TYPES: InterviewType[] = [
  'Phone', 'Video', 'OnSite', 'Technical', 'HRRound', 'Final',
];

// ─── Job Application Summary (nested inside Interview response) ───────────────
export interface JobApplicationSummary {
  jobAppId:    string;
  companyName: string;
  title:       string;
  location:    string;
  status:      ApplicationStatus;
  workMode:    string;
  type:        string;
  link?:       string;
}

// ─── Interview ────────────────────────────────────────────────────────────────
export interface Interview {
  interviewId:      string;
  iobAppId:         string;
  interviewDate:    Date;
  interviewType:    InterviewType;
  interviewerName?: string;       // ← added
  note:             string;       // ← was "note", now matches backend DTO
  feedback:         string;
  createdAt:        string;
  updatedAt:        string;
  jobApplication:   JobApplicationSummary;  // ← added (populated via Include())
}

export interface CreateInterviewRequest {
  JobAppId:        string;
  InterviewType:   InterviewType;
  InterviewDate:   string;
  InterviewerName: string;
  Note:            string;
  Feedback:        string;
}

export interface UpdateInterviewRequest {
  interviewDate?: string;
  interviewType?: InterviewType;
  notes?:         string;
}

// ─── Job Application ──────────────────────────────────────────────────────────
export interface JobApplication {
  jobAppId:    string;
  userId:      string;
  companyName: string;
  title:       string;
  location:    string;
  jobLink:     string;
  appliedAt:   string;
  status:      ApplicationStatus;
  interviews:  Interview[];
  createdAt:   string;
  updatedAt:   string;
  description: string;
}

export interface CreateApplicationRequest {
  CompanyName:     string;
  Title:           string;
  Location:        string;
  Link?:           string;
  ApplicationDate: Date;
  Status:          ApplicationStatus;
  Description?:    string;
}

export interface UpdateApplicationRequest {
  CompanyName:     string;
  Title:           string;
  Location:        string;
  JobLink?:        string;
  ApplicationDate: Date;
  Status:          ApplicationStatus;
  Description?:    string;
}

// ─── API Wrapper ──────────────────────────────────────────────────────────────
export interface ApiResponse<T> {
  data:    T;
  message: string;
  success: boolean;
}

export interface PagedResponse<T> {
  data:       T[];
  total:      number;
  page:       number;
  pageSize:   number;
  totalPages: number;
}

export interface PagedQuery {
  page?:     number;
  pageSize?: number;
  search?:   string;
  status?:   ApplicationStatus | '';
  sortBy?:   string;
  sortDir?:  'asc' | 'desc';
  fromDate?: Date;
  toDate?:   Date;
}

// ─── Dashboard ────────────────────────────────────────────────────────────────
export interface DashboardSummary {
  totalApplications:    number;
  thisWeekApplications: number;
  responseRate:         number;
  byStatus:             StatusBreakdown;
  upcomingInterviews:   UpcomingInterview[];
  recentApplications:   RecentApplication[];
}

export interface StatusBreakdown {
  applied:      number;
  interviewing: number;
  offered:      number;
  rejected:     number;
  withdrawn:    number;
}

export interface UpcomingInterview {
  id:            string;
  company:       string;
  position:      string;
  interviewDate: string;
  interviewType: string;
}

export interface RecentApplication {
  jobAppId:    string;
  company:     string;
  position:    string;
  appliedDate: string;
  status:      string;
}