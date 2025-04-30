# Automated Report Syncing

This document explains how the automated report syncing works between the vulnerability intelligence generator source repository and the "Don't Panic" frontend.

## Overview

The "Don't Panic" frontend automatically synchronizes vulnerability reports from a source repository (typically a vulnerability intelligence generator). This ensures that new vulnerability reports are promptly displayed on the website with minimal manual intervention.

## How It Works

The synchronization process is implemented as a GitHub Actions workflow that:

1. Runs daily at midnight UTC
2. Can be manually triggered from the GitHub Actions tab
3. Validates reports against the required schema
4. Compares reports in the source repository with the current reports
5. Copies new and updated reports to the frontend repository
6. Preserves the sample report regardless of source changes
7. Commits and pushes changes with detailed commit messages
8. Triggers a rebuild and deployment of the website when changes are detected

## Workflow Configuration

The workflow is defined in `.github/workflows/sync_reports.yml` and includes the following key features:

### Trigger Methods

- **Scheduled**: Runs automatically every day at midnight UTC
- **Manual**: Can be triggered from the GitHub Actions tab with custom parameters:
  - Source repository (default: `owner/vulnerability-intelligence-generator`)
  - Source branch (default: `main`)
  - Source path (default: `reports/`) - Specify the directory within the source repository where reports are located

### Sync Process

1. **Setup**: 
   - Checkout both repositories
   - Setup Node.js environment for validation
   - Install dependencies

2. **Validation**:
   - Check that the source reports directory exists
   - Validate all new and modified reports against the schema
   - Ensure reports have all required fields and proper data types

3. **Syncing**:
   - Create a backup of the sample report
   - Remove all current reports except the sample
   - Copy all reports from source to destination
   - Restore the sample report if it was overwritten
   - Stage, commit, and push changes

4. **Deployment**:
   - Trigger the deployment workflow to rebuild and deploy the site
   - Report sync results with counts of new and updated reports

## Schema Validation

The workflow includes automatic validation of report frontmatter against the schema defined in `src/content/config.ts`. Reports must have:

1. Required fields: `cveId`, `title`, `publishDate`
2. Valid data types (e.g., dates must be valid dates, scores must be within correct ranges)
3. Enumerated values that match the schema (e.g., severity must be one of "Low", "Medium", "High", "Critical")

Reports that fail validation will not be synced, and the workflow will log the specific validation errors.

## Expected Report Structure

Reports from the source repository should:

1. Be markdown files (`.md`)
2. Include frontmatter that matches the schema defined in `src/content/config.ts`
3. Be located in a directory that matches the sync configuration (default: `reports/`)

Example report frontmatter:

```yaml
---
# Core Vulnerability Identifiers
cveId: "CVE-2024-XXXX"
title: "Title of the vulnerability"
publishDate: 2024-01-01

# CVSS Information
cvssScore: 9.8
cvssVector: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H"
cvssSeverity: "Critical"

# Additional Scoring
epssScore: 0.85

# Classification
cwe: "CWE-287"
vulnerabilityType: "Authentication Bypass"

# Product Information
vendor: "ExampleCorp"
product: "SecureFileTransfer"
affectedProductsString: "Versions 1.0 through 2.1"

# Patch Information
patchAvailable: true
patchLink: "https://example.com/advisory/CVE-2024-XXXX"

# Exploitation Information
exploitationStatus: "PoC Available"
exploitationStatusLink: "https://example.com/poc/CVE-2024-XXXX"

# Metadata Fields
tags: ["critical", "web", "authentication"]
author: "Security Research Team"
description: "A brief description of the vulnerability."

# Display Settings
severity: "Critical"
isZeroDay: false
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
3. Uncomment the `token` line in the workflow file:
   ```yaml
   - name: Checkout source repository
     uses: actions/checkout@v4
     with:
       repository: ${{ github.event.inputs.source_repo || 'owner/vulnerability-intelligence-generator' }}
       ref: ${{ github.event.inputs.source_branch || 'main' }}
       path: source-repo
       token: ${{ secrets.SOURCE_REPO_PAT }}  # Uncomment this line
   ```

## Customizing the Sync Process

The workflow can be customized by:

1. **Changing the source path**: When triggering manually, specify a different source path if your reports are not in the default `reports/` directory
2. **Modifying validation criteria**: Edit the validation script in the workflow to add additional checks
3. **Adjusting sync frequency**: Edit the cron schedule in the workflow file to run more or less frequently

## Troubleshooting

If the sync process is not working as expected:

1. **Check the workflow logs** in the GitHub Actions tab for error messages
2. **Validate source directory**: Ensure the source reports directory exists
3. **Check schema compliance**: Verify that report frontmatter matches the schema
4. **Inspect validation errors**: Look for specific validation errors in the logs
5. **Check permissions**: Ensure the GitHub token has sufficient permissions
6. **Verify deployment trigger**: Check if the deployment workflow was triggered successfully

Common errors:
- Missing required fields in frontmatter
- Invalid data types (e.g., non-numeric CVSS scores)
- Invalid date formats
- Source directory not found
- Permission issues when accessing private repositories

## Manual Syncing

If necessary, reports can be manually added to the `src/content/reports/` directory. After adding files manually:

1. Commit and push the changes
2. The regular deployment workflow will rebuild and deploy the site

Remember to validate your manual reports against the schema to ensure they will be processed correctly by the application.