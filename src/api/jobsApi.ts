import axios, { AxiosError } from 'axios';
import uuid from 'react-native-uuid';
import { Job } from '../types';

const apiClient = axios.create({
  baseURL: 'https://empllo.com/api/v1',
  timeout: 10_000, // 10s timeout
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


/**
 * Maps a currency code to the matching symbol for display purposes.
 * Falls back to the raw code if the currency isn't in the lookup.
 */
const formatSalary = (
  minSalary: number | null | undefined,
  maxSalary: number | null | undefined,
  currency: string | undefined,
): string | undefined => {
  if (minSalary === null || minSalary === undefined) return undefined;

  const currencySymbol =
    currency === 'USD' ? '$'
    : currency === 'EUR' ? '€'
    : currency === 'GBP' ? '£'
    : currency === 'CAD' ? 'C$'
    : currency === 'BRL' ? 'R$'
    : currency === 'ILS' ? '₪'
    : currency || '';

  if (maxSalary && maxSalary !== minSalary) {
    return `${currencySymbol}${minSalary.toLocaleString()}–${currencySymbol}${maxSalary.toLocaleString()}`;
  }
  return `${currencySymbol}${minSalary.toLocaleString()}`;
};

const formatLocation = (locations: string[] | undefined): string => {
  if (!locations || locations.length === 0) return 'Remote / Unspecified';
  if (locations.length === 1) return locations[0];
  if (locations.length <= 3) return locations.join(', ');
  return `${locations.slice(0, 2).join(', ')}, +${locations.length - 2} more`;
};

const formatDate = (timestamp: number | undefined): string | undefined => {
  if (!timestamp) return undefined;
  return new Date(timestamp * 1000).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

/**
 * Normalises a raw API job object into the strongly-typed `Job` interface.
 *
 * - Provides safe fallbacks for every nullable / optional field.
 * - Generates a UUID when the API doesn't return a `guid` so every job
 *   has a stable identity for keying React lists and Redux lookups.
 */
const normalizeJob = (raw: RawJob): Job => {
  const generatedGuid = (raw.guid ?? uuid.v4().toString()) as string;

  return {
    title:         String(raw.title ?? 'Untitled Role'),
    mainCategory:  String(raw.mainCategory ?? 'General'),
    companyName:   String(raw.companyName ?? 'Unknown Company'),
    companyLogo:   String(raw.companyLogo ?? ''),
    jobType:       String(raw.jobType ?? 'Unknown'),
    workModel:     String(raw.workModel ?? 'Remote'),
    seniorityLevel:String(raw.seniorityLevel ?? 'Not specified'),
    minSalary:     raw.minSalary ?? null,
    maxSalary:     raw.maxSalary ?? null,
    currency:      String(raw.currency ?? 'USD'),
    // Ensure locations is always a string array; default to ["Remote"]
    locations:     Array.isArray(raw.locations) ? raw.locations.map(String) : ['Remote'],
    tags:          Array.isArray(raw.tags) ? raw.tags.map(String) : [],
    description:   String(raw.description ?? '<p>No description provided.</p>'),
    // pubDate / expiryDate: use current time as a safe fallback when missing
    pubDate:       typeof raw.pubDate === 'number' ? raw.pubDate : Math.floor(Date.now() / 1000),
    expiryDate:
      typeof raw.expiryDate === 'number'
        ? raw.expiryDate
        : Math.floor(Date.now() / 1000) + 30 * 24 * 3600,
    guid: generatedGuid,
  };
};

// ── Public API ─────────────────────────────────────────────────────────────

/**
 * Fetches the job feed from the remote API and returns a normalised array.
 *
 * Seeding: if the API returns an empty jobs array we inject one sample record
 * so the UI always has something to render during development / demo.
 *
 * Error handling: converts Axios error codes to readable user-facing messages
 * that are surfaced in the Redux error state.
 */
export const fetchJobsFromApi = async (): Promise<Job[]> => {
  try {
    const response = await apiClient.get<JobsApiResponse>('/');
    const payload = response.data;

    if (!payload || typeof payload !== 'object') return [];

    const rawJobs: RawJob[] = Array.isArray(payload.jobs) ? payload.jobs : [];

    if (rawJobs.length === 0) {
      // Seed with a sample record when the endpoint returns nothing
      const sample: RawJob = {
        title: 'Fullstack Engineer - Cloud',
        mainCategory: 'Engineering',
        companyName: 'Neo4j',
        companyLogo: 'https://assets.empllo.com/8f3d0zon8elh551ptsdy8exvs7mk',
        jobType: 'Full time',
        workModel: 'On site',
        seniorityLevel: 'Mid',
        minSalary: null,
        maxSalary: null,
        currency: 'SEK',
        locations: ['Worldwide'],
        tags: ['Javascript','TypeScript','React','Go','Docker','Kubernetes','PostgreSQL','Neo4j'],
        description:
          "<h3>📋 Description</h3><ul><li>Build observability tools with real-time DB insights.</li>...</ul>",
        pubDate: 1771584318,
        expiryDate: 1774176318,
        guid: 'https://empllo.com/jobs/view/fullstack-engineer-cloud-4655990006',
      };
      return [normalizeJob(sample)];
    }

    return rawJobs.map(normalizeJob);
  } catch (error) {
    // Classify the Axios error into a human-readable message
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
