import type { CollectionEntry } from 'astro:content';

export const byNewest = (a: CollectionEntry<'blog'>, b: CollectionEntry<'blog'>) =>
  b.data.date.valueOf() - a.data.date.valueOf();

export const formatDate = (date: Date) =>
  new Intl.DateTimeFormat('en', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date);

export const readingTime = (body: string | undefined) => {
  const words = (body ?? '').trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
};
