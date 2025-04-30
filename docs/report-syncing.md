# Automated Report Syncing

This document explains how the automated report syncing works between the vulnerability-intelligence-generator and the dont-panic frontend.

## Overview

The dont-panic frontend automatically synchronizes vulnerability reports from the vulnerability-intelligence-generator repository. This ensures that new vulnerability reports are promptly displayed on the website.

## How It Works

The synchronization process is implemented as a GitHub Actions workflow that:

1. Runs daily at midnight UTC
2. Can be manually triggered from the GitHub Actions tab
3. Compares reports in the source repository with the current reports
4. Copies new and updated reports to the frontend repository
5. Triggers a rebuild and deployment of the website when changes are detected

## Workflow Configuration

The workflow is defined in `.github/workflows/sync_reports.yml` and includes the following key features:

### Trigger Methods

- **Scheduled**: Runs automatically every day at midnight UTC
- **Manual**: Can be triggered from the GitHub Actions tab with custom parameters:
  - Source repository (default: `owner/vulnerability-intelligence-generator`)
  - Source branch (default: `main`)

### Sync Process

1. Checkout both repositories
2. Compare report directories
3. Copy new and updated reports while preserving the sample report
4. Commit and push changes if any are detected
5. Trigger the deployment workflow to rebuild and deploy the site

## Expected Report Structure

Reports from the source repository should:

1. Be markdown files (`.md`)
2. Include frontmatter that matches the schema defined in `src/content/config.ts`
3. Be located in a directory that matches the sync configuration (default: `reports/`)

Example report frontmatter:

```yaml
---
# Core Vulnerability Identifiers
cveId: "CVE-XXXX-XXXX"
title: "Title of the vulnerability"
publishDate: 2024-MM-DD

# CVSS Information
cvssScore: 9.8
cvssVector: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H"
cvssSeverity: "Critical"

# Additional fields as per schema
---
```

## Setup Instructions

### For Public Source Repository

The default configuration works with public repositories. Simply ensure that:

1. The source repository structure matches expectations
2. The repository name is correctly specified in the workflow

### For Private Source Repository

To sync from a private repository:

1. Create a Personal Access Token (PAT) with `repo` scope
2. Add the token as a secret named `SOURCE_REPO_PAT` in the repository settings
3. Uncomment the `token` line in the workflow file

## Troubleshooting

If the sync process is not working as expected:

1. Check the logs in the GitHub Actions tab
2. Verify that the source repository structure matches expectations
3. Ensure that the frontmatter in the reports matches the schema
4. Check that the permissions for the GitHub token are sufficient

## Manual Syncing

If necessary, reports can be manually added to the `src/content/reports/` directory. After adding files manually:

1. Commit and push the changes
2. The regular deployment workflow will rebuild and deploy the site