# 📁 Project File Tree
This document outlines the structure of the repository.
- **./**
    - .gitignore
    - CODEOWNERS
    - CONTRIBUTING.md
    - FILE_TREE.md
    - README.md
    - SECURITY.md
    - dependabot.yml
    - astro.config.mjs
    - guide.md
    - package.json
    - package-lock.json
    - repomix-output.txt
    - tailwind.config.cjs
    - tsconfig.json
    - vitest.config.ts
    - **.github/**
        - pull_request_template.md
        - **workflows/**
            - build_test.yml # Basic CI workflow (includes tests)
            - deploy.yml # GitHub Pages deployment workflow
            - sync_reports.yml # Workflow for syncing vulnerability reports
            - codeql-analysis.yml # (Keep if desired)
            - dependency-review.yml # (Keep if desired)
        - **ISSUE_TEMPLATE/**
            - **ISSUE_TEMPLATE/**
                - bug_report.md
                - config.yml
                - feature_request.md
    - **.llmconfig/** - *Contains LLM agent configurations and rules*
        - CONSOLIDATED_TASKS.md
        - **prompt-templates/**
            - .gitkeep
        - **context/**
            - .gitkeep
    - **config/** - *Configuration files*
        - .gitkeep
    - **docs/** - *Documentation files*
        - report-syncing.md # Documentation for the report syncing workflow
        - search-functionality.md # Documentation for the search functionality
        - .gitkeep
    - **public/** - *Static assets*
        - favicon.svg
    - **scripts/** - *Utility scripts*
        - .gitkeep
    - **src/** - *Source code*
        - **components/** - *Reusable Astro components*
            - AboutSection.astro
            - AboutSection.test.ts
            - CTASection.astro
            - CTASection.test.ts
            - FilterSidebar.astro
            - Footer.astro
            - Footer.test.ts
            - Header.astro
            - Header.test.ts
            - ScoreDisplay.astro
            - Search.astro # Pagefind search component
            - SeverityTag.astro
            - Styling.test.ts
            - ZeroDayTag.astro
        - **content/** - *Markdown content collections*
            - config.ts # Content collection schema definitions
            - **reports/** # Synced/copied Markdown reports go here
                - sample-cve.md # Sample report
        - **data/** - *Data files*
            - featuresData.ts
            - navItems.ts
        - **env.d.ts** - *TypeScript environment definitions*
        - **layouts/** - *Base page layouts*
            - BaseLayout.astro
            - Layout.astro
            - Layout.test.ts
        - **pages/** - *Site pages/routes*
            - about.astro
            - **blog/**
                - index.astro
                - sample-post.md
            - **reports/** # Directory for report pages
                - [slug].astro # Dynamic route for displaying single reports
            - index.astro # Home page with table view and search functionality
        - **styles/** - *CSS styles*
            - global.css
    - **tests/** - *Test files*
        - **components/**
            - FilterSidebar.test.ts
            - ReportCard.test.ts
            - VulnerabilityTable.test.ts
        - **layouts/**
            - BaseLayout.test.ts
        - **pages/**
            - index.test.ts
            - **reports/**
                - '[slug].test.ts'
            - table-view.e2e.js
        - **workflows/**
            - sync_reports.test.ts # Tests for report syncing workflow