import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const gallery = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/gallery' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      medium: z.string().min(1),
      year: z.number().int().min(2000).max(2100),
      description: z.string().default(''),
      cover: image(),
      coverAlt: z.string().default(''),
      video: z.string().optional(),
      featured: z.boolean().default(false),
      order: z.number().default(0),
    }),
});

const work = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/work' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      category: z.enum(['autonomy', 'software', 'embedded']),
      year: z.number().int().min(2000).max(2100),
      summary: z.string(),
      role: z.string().optional(),
      tools: z.array(z.string()).default([]),
      cover: image(),
      coverAlt: z.string().default(''),
      featured: z.boolean().default(false),
      order: z.number().default(0),
      links: z
        .array(z.object({ label: z.string(), href: z.url() }))
        .default([]),
    }),
});

export const collections = { work, gallery };
