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
    cvssScore: z.number().min(0).max(10).optional(),
    cvssVector: z.string().optional(),
    cvssSeverity: z.enum(["Low", "Medium", "High", "Critical"]).optional(), // This might be inferred or explicitly set

    // Additional Scoring
    epssScore: z.number().min(0).max(1).optional(),

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

    // Added based on UI Guide
    severity: z.enum(["Low", "Medium", "High", "Critical"]).optional(), // Explicit severity, potentially overriding inferred cvssSeverity
    isZeroDay: z.boolean().optional().default(false), // Is it a zero-day?
  }),
});

// Export the collections object
export const collections = {
  'reports': reportsCollection,
};
