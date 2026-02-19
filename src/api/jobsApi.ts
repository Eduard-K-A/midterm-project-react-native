import axios, { AxiosError } from 'axios';
import uuid from 'react-native-uuid';
import { Job } from '../types';

const apiClient = axios.create({
  baseURL: 'https://empllo.com/api/v1',
  timeout: 10000,
});

interface RawJob {
  title?: string;
  companyName?: string;
  companyLogo?: string;
  jobType?: string;
  workModel?: string;
  seniorityLevel?: string;
  minSalary?: number | null;
  maxSalary?: number | null;
  currency?: string;
  locations?: string[];
  tags?: string[];
  description?: string;
  pubDate?: number;
  expiryDate?: number;
  applicationLink?: string;
  guid?: string;
  mainCategory?: string;
  [key: string]: unknown;
}

interface JobsApiResponse {
  jobs?: RawJob[];
  total_count?: number;
  offset?: number;
  limit?: number;
  usage?: string;
  updated_at?: number;
  [key: string]: unknown;
}

const formatSalary = (
  minSalary: number | null | undefined,
  maxSalary: number | null | undefined,
  currency: string | undefined,
): string | undefined => {
  if (minSalary === null || minSalary === undefined) {
    return undefined;
  }

  const currencySymbol =
    currency === 'USD'
      ? '$'
      : currency === 'EUR'
      ? '€'
      : currency === 'GBP'
      ? '£'
      : currency === 'CAD'
      ? 'C$'
      : currency === 'BRL'
      ? 'R$'
      : currency === 'ILS'
      ? '₪'
      : currency || '';

  if (maxSalary && maxSalary !== minSalary) {
    return `${currencySymbol}${minSalary.toLocaleString()}-${currencySymbol}${maxSalary.toLocaleString()}`;
  }

  return `${currencySymbol}${minSalary.toLocaleString()}`;
};

const formatLocation = (locations: string[] | undefined): string => {
  if (!locations || locations.length === 0) {
    return 'Remote / Unspecified';
  }

  if (locations.length === 1) {
    return locations[0];
  }

  if (locations.length <= 3) {
    return locations.join(', ');
  }

  return `${locations.slice(0, 2).join(', ')}, +${locations.length - 2} more`;
};

const formatDate = (timestamp: number | undefined): string | undefined => {
  if (!timestamp) {
    return undefined;
  }

  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const normalizeJob = (raw: RawJob): Job => {
  const generatedId = uuid.v4().toString();

  const salary = formatSalary(raw.minSalary, raw.maxSalary, raw.currency);
  const location = formatLocation(raw.locations);
  const postedAt = formatDate(raw.pubDate);

  return {
    id: raw.guid ?? generatedId,
    title: raw.title ?? 'Untitled Role',
    company: raw.companyName ?? 'Unknown Company',
    location,
    salary,
    type: raw.jobType,
    description: raw.description,
    tags: Array.isArray(raw.tags) ? raw.tags.map((tag) => String(tag)) : undefined,
    postedAt,
    logo: raw.companyLogo,
  };
};

export const fetchJobsFromApi = async (): Promise<Job[]> => {
  try {
    const response = await apiClient.get<JobsApiResponse>('/');

    const payload = response.data;

    if (!payload || typeof payload !== 'object') {
      return [];
    }

    const rawJobs: RawJob[] = Array.isArray(payload.jobs) ? payload.jobs : [];

    if (rawJobs.length === 0) {
      return [];
    }

    return rawJobs.map(normalizeJob);
  } catch (error) {
    const axiosError = error as AxiosError;
    let message = 'Network error while fetching jobs';

    if (axiosError.response) {
      if (axiosError.response.status === 404) {
        message = 'Jobs endpoint not found. Please check the API URL.';
      } else if (axiosError.response.status >= 500) {
        message = 'Server error. Please try again later.';
      } else {
        message = 'Failed to fetch jobs from server';
      }
    } else if (axiosError.message) {
      message = axiosError.message;
    }

    throw new Error(message);
  }
};

