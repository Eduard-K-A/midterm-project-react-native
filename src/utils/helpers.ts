import uuid from 'react-native-uuid';

export const generateUUID = (): string => uuid.v4().toString();

export const formatCurrency = (value: string | undefined): string | undefined => {
  if (!value) {
    return undefined;
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return undefined;
  }

  if (/^\d+(\.\d+)?$/.test(trimmed)) {
    return `$${trimmed}`;
  }

  return trimmed;
};

export const getInitials = (company: string): string => {
  const words = company.trim().split(/\s+/);
  if (words.length === 0) {
    return '';
  }
  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase();
  }
  return (words[0][0] + words[1][0]).toUpperCase();
};

