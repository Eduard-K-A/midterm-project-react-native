import uuid from 'react-native-uuid';

export const generateUUID = (): string => uuid.v4().toString();

export const formatSalary = (
  minSalary: number | null,
  maxSalary: number | null,
  currency: string,
): string => {
  // Handle case where neither min nor max is provided
  if ((minSalary === null || minSalary === undefined) && (maxSalary === null || maxSalary === undefined)) {
    return 'Not disclosed';
  }

  // Convert common currency codes to symbols; fall back to the string itself
  const symbol = currency === 'USD' ? '$' : currency === 'EUR' ? '€' : currency === 'GBP' ? '£' : currency;

  // If both bounds exist and differ, show range
  if (minSalary !== null && maxSalary !== null && minSalary !== maxSalary) {
    return `${symbol}${minSalary.toLocaleString()} - ${symbol}${maxSalary.toLocaleString()}`;
  }

  // Otherwise just show the single value available
  const value = (minSalary ?? maxSalary) ?? 0;
  return `${symbol}${value.toLocaleString()}`;
};

export const getInitials = (company: string): string => {
  // Return first two letters of the company name or the first letters of the
  // first two words. Used for placeholder logos when no image is available.
  const words = company.trim().split(/\s+/);
  if (words.length === 0) return '';
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
};

