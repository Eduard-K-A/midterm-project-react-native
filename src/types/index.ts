export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary?: string;
  type?: string;
  description?: string;
  tags?: string[];
  postedAt?: string;
  logo?: string;
}

export interface ApplicationFormData {
  name: string;
  email: string;
  contactNumber: string;
  whyShouldWeHireYou: string;
}

export interface ApplicationFormModalProps {
  visible: boolean;
  job: Job | null;
  onClose: () => void;
  onSuccess: () => void;
  sourceScreen: 'JobFinder' | 'SavedJobs';
}

export interface ColorTokens {
  background: string;
  surface: string;
  primary: string;
  success: string;
  destructive: string;
  text: string;
  textMuted: string;
  border: string;
  shadow: string;
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
}

export interface SavedJobsState {
  savedJobs: Job[];
}

