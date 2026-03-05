import uuid from 'react-native-uuid';

/**
 * Generates a RFC 4122 v4 UUID string.
 * Wrapping the library call here lets us swap the implementation
 * (e.g. to `crypto.randomUUID`) in one place without touching consumers.
 */
export const generateUUID = (): string => uuid.v4().toString();

/**
 * Formats a salary range into a display-friendly string.
 *
 * - Returns "Not disclosed" when both min and max are absent.
 * - Maps common ISO 4217 currency codes to their symbols; falls back to
 *   the raw code string for unknown currencies.
 * - Shows a range "£X – £Y" when both bounds differ, otherwise a single value.
 */
export const formatSalary = (
  minSalary: number | null,
  maxSalary: number | null,
  currency: string,
): string => {
  if ((minSalary === null || minSalary === undefined) &&
      (maxSalary === null || maxSalary === undefined)) {
    return 'Not disclosed';
  }

  // Convert common currency codes to symbols; fall back to the string itself
  const symbol =
    currency === 'USD' ? '$'
    : currency === 'EUR' ? '€'
    : currency === 'GBP' ? '£'
    : currency;

  // If both bounds exist and differ, show range
  if (minSalary !== null && maxSalary !== null && minSalary !== maxSalary) {
    return `${symbol}${minSalary.toLocaleString()} – ${symbol}${maxSalary.toLocaleString()}`;
  }

  // Otherwise show the single available value
  const value = (minSalary ?? maxSalary) ?? 0;
  return `${symbol}${value.toLocaleString()}`;
};

/**
 * Derives 1–2 initials from a company name for use in logo placeholders.
 *
 * Rules:
 * - Single word  → first 2 characters  ("Google" → "GO")
 * - Multiple words → first letter of each of the first two words ("Neo4j DB" → "ND")
 */
export const getInitials = (company: string): string => {
  const words = company.trim().split(/\s+/);
  if (words.length === 0) return '';
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
};
