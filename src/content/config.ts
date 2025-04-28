import { defineCollection, z } from 'astro:content';

// Define the schema for the 'reports' collection
const reportsCollection = defineCollection({
  type: 'content', // 'content' for Markdown files
  schema: z.object({
    title: z.string(),
    pubDate: z.coerce.date(), // Coerce string dates to Date objects
    description: z.string().optional(), // Optional short description
    cvss: z.number().min(0).max(10).optional(), // Optional CVSS score
    epss: z.number().min(0).max(1).optional(), // Optional EPSS score (0-1 range)
    tags: z.array(z.string()).optional(), // Optional tags
    // Add other frontmatter fields as needed
  }),
});

// Export the collections object
export const collections = {
  'reports': reportsCollection,
};
