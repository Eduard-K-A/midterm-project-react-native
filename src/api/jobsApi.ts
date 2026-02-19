import axios, { AxiosError } from 'axios';
import uuid from 'react-native-uuid';
import { Job } from '../types';

const apiClient = axios.create({
  baseURL: 'https://empllo.com/api/v1',
});

interface RawJob {
  id?: string;
  title?: string;
  company?: string;
  location?: string;
  salary?: string;
  type?: string;
  description?: string;
  tags?: string[] | string;
  postedAt?: string;
  logo?: string;
  [key: string]: unknown;
}

interface JobsApiResponse {
  data?: RawJob[];
  jobs?: RawJob[];
  [key: string]: unknown;
}

const normalizeJob = (raw: RawJob): Job => {
  const generatedId = uuid.v4().toString();

  const tagsArray: string[] | undefined = Array.isArray(raw.tags)
    ? raw.tags.map((tag) => String(tag))
    : typeof raw.tags === 'string'
    ? raw.tags.split(',').map((tag) => tag.trim())
    : undefined;

  return {
    id: raw.id ?? generatedId,
    title: raw.title ?? 'Untitled Role',
    company: raw.company ?? 'Unknown Company',
    location: raw.location ?? 'Remote / Unspecified',
    salary: raw.salary,
    type: raw.type,
    description: raw.description,
    tags: tagsArray,
    postedAt: raw.postedAt,
    logo: raw.logo,
  };
};

export const fetchJobsFromApi = async (): Promise<Job[]> => {
  try {
    const response = await apiClient.get<JobsApiResponse>('/jobs');

    const payload = response.data;
    const rawJobs: RawJob[] =
      (Array.isArray(payload) ? (payload as RawJob[]) : null) ??
      (Array.isArray(payload.data) ? payload.data : []) ??
      (Array.isArray(payload.jobs) ? payload.jobs : []);

    if (!rawJobs || rawJobs.length === 0) {
      return [];
    }

    return rawJobs.map(normalizeJob);
  } catch (error) {
    const axiosError = error as AxiosError;
    const message =
      axiosError.response?.data && typeof axiosError.response.data === 'object'
        ? 'Failed to fetch jobs from server'
        : axiosError.message || 'Network error while fetching jobs';

    throw new Error(message);
  }
};

