import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const work = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/work' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      category: z.enum(['autonomy', 'software', 'embedded', 'design']),
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

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

export const collections = { work, blog };
