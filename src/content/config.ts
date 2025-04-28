import { defineCollection, z } from 'astro:content';

// Define the schema for the 'reports' collection
const reportsCollection = defineCollection({
  type: 'content', // 'content' for Markdown files
  schema: z.object({
    // Core Identifiers
    cveId: z.string(), // e.g., "CVE-2024-XXXX"
    title: z.string(),
    publishDate: z.coerce.date(), // Renamed from pubDate

    // CVSS Information
    cvssScore: z.number().min(0).max(10).optional(), // Renamed from cvss
    cvssVector: z.string().optional(), // e.g., "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H"
    cvssSeverity: z.enum(["Low", "Medium", "High", "Critical"]).optional(), // Based on score

    // Additional Scoring
    epssScore: z.number().min(0).max(1).optional(), // Renamed from epss

    // Classification
    cwe: z.string().optional(), // e.g., "CWE-287"
    vulnerabilityType: z.string().optional(), // e.g., "Authentication Bypass"

    // Product Information
    vendor: z.string().optional(),
    product: z.string().optional(),
    affectedProductsString: z.string().optional(), // Descriptive string

    // Patch Information
    patchAvailable: z.boolean().default(false),
    patchLink: z.string().url().optional().nullable(), // URL or null

    // Exploitation Information
    exploitationStatus: z.string().optional(), // e.g., "PoC Available"
    exploitationStatusLink: z.string().url().optional().nullable(), // URL or null

    // Metadata Fields
    tags: z.array(z.string()).optional(),
    author: z.string().default("AI Content Generator"),
    description: z.string().optional(),
    draft: z.boolean().default(false),
    // last_modified: handled by Git

    // Display Settings
    show_toc: z.boolean().default(true),
  }),
});

// Export the collections object
export const collections = {
  'reports': reportsCollection,
};
