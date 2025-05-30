import { format } from 'date-fns';

export const formatDate = (date: Date): string => {
  return format(date, 'dd.MM.yyyy');
};

export const formatDateTime = (date: Date): string => {
  return format(date, 'dd.MM.yyyy HH:mm');
};

export const slugify = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}; 