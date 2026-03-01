export interface Job {
  title: string;
  mainCategory: string;
  companyName: string;
  companyLogo: string; // remote image URL
  jobType: string;
  workModel: string;
  seniorityLevel: string;
  minSalary: number | null;
  maxSalary: number | null;
  currency: string;
  locations: string[];
  tags: string[];
  description: string; // HTML string
  pubDate: number; // Unix timestamp
  expiryDate: number; // Unix timestamp
  guid: string; // unique identifier
}

export interface ApplicationFormData {
  name: string;
  email: string;
  contactNumber: string; // +63XXXXXXXXXX
  whyShouldWeHireYou: string;
}

export interface ApplicationFormModalProps {
  visible: boolean;
  job: Job | null;
  onClose: () => void;
  onSuccess: () => void;
  sourceScreen: 'JobFinder' | 'SavedJobs' | 'JobDetail';
}

export interface ColorTokens {
  background: string;
  surface: string;
  primary: string;
  primaryLight?: string;
  success: string;
  destructive: string;
  text: string;
  textMuted: string;
  border: string;
  shadow: string;
  onPrimary?: string;
  onDestructive?: string;
  onSuccess?: string;
  overlay?: string;
}

export interface ThemeContextType {
  isDark: boolean;
  toggleTheme: () => void;
  colors: ColorTokens;
}

export interface JobsState {
  jobs: Job[];
  loading: boolean;
  error: string | null;
  searchQuery: string;
  lastFetchTime: number | null;
}

export interface SavedJobsState {
  savedJobs: Job[];
}

