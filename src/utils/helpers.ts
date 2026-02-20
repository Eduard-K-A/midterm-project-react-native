import uuid from 'react-native-uuid';

export const generateUUID = (): string => uuid.v4().toString();

export const formatSalary = (
  minSalary: number | null,
  maxSalary: number | null,
  currency: string,
): string => {
  if ((minSalary === null || minSalary === undefined) && (maxSalary === null || maxSalary === undefined)) {
    return 'Not disclosed';
  }

  const symbol = currency === 'USD' ? '$' : currency === 'EUR' ? '€' : currency === 'GBP' ? '£' : currency;

  if (minSalary !== null && maxSalary !== null && minSalary !== maxSalary) {
    return `${symbol}${minSalary.toLocaleString()} - ${symbol}${maxSalary.toLocaleString()}`;
  }

  const value = (minSalary ?? maxSalary) ?? 0;
  return `${symbol}${value.toLocaleString()}`;
};

export const getInitials = (company: string): string => {
  const words = company.trim().split(/\s+/);
  if (words.length === 0) return '';
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
};

