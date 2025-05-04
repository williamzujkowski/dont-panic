High-Level Project Overview: Automated Vulnerability Intelligence Platform (AVIP)
Version: 1.2
Date: 2025-05-03

1. Overall Vision & Purpose
The Automated Vulnerability Intelligence Platform (AVIP) aims to create an automated, LLM-powered system that continuously monitors vulnerability data sources, identifies high-priority emerging threats based on defined criteria (CVSS >= 9.0, EPSS >= 70%, potential zero-days), generates concise, actionable intelligence reports, and publishes them to a user-friendly web frontend ("Don't Panic").

This document provides a high-level overview intended to guide development efforts, particularly for code generation LLMs working within individual project repositories, ensuring alignment with the overall architecture and goals. All development MUST adhere to the standards defined in .llmconfig/CLAUDE.md.

2. Core Principles
Modularity: Each core function (data pipeline, intelligence generation, frontend) resides in its own distinct repository with clear interfaces. The repositories are:

vulnerability-data-pipeline: https://github.com/williamzujkowski/vulnerability-data-pipeline

vulnerability-intelligence-generator: https://github.com/williamzujkowski/vulnerability-intelligence-generator

dont-panic: https://github.com/williamzujkowski/dont-panic

Automation: CI/CD pipelines drive data processing, report generation, testing, and deployment across repositories.

Standards-Driven: Strictly adhere to all guidelines outlined in .llmconfig/CLAUDE.md (coding, testing, documentation, security, Git practices, etc.).

Standardized Configuration: IMPORTANT: All API keys, environment variables, and other user-supplied configuration values MUST use consistent naming conventions across all repositories (vulnerability-data-pipeline, vulnerability-intelligence-generator, dont-panic) to simplify key management and deployment. A shared API_STANDARDS.md document detailing these conventions and required keys/variables will be created and maintained at the root level of each repository. Refer to this document before adding or modifying configuration parameters.

Observability: Integrate LangSmith for LLM workflow tracing/debugging (vulnerability-intelligence-generator) and implement structured logging throughout.

Testability: Design components for high test coverage according to the Testing Manifesto in .llmconfig/CLAUDE.md.

LLM Integration: Utilize LangChain/LangGraph for sophisticated LLM workflows and manage prompts effectively via .llmconfig/ structures.

3. High-Level Architecture (Multi-Repository)
The system is composed of three primary repositories orchestrating the flow of data from external sources to the end-user interface.

graph TD
    subgraph ExternalSources [External Sources]
        CVEOrg[cve.org (JSON 5)]
        CISA[CISA KEV]
        VendorAdvisories[Vendor Advisories]
        OtherFeeds[Other Threat Feeds]
        NVD[(NVD - Secondary)]
    end

    subgraph vulnerability_data_pipeline [Repo 1: vulnerability-data-pipeline]
        direction LR
        Ingest(Ingest/Parse) --> Normalize(Normalize Data)
        Normalize --> Filter(Filter CVSS/EPSS/ZeroDay)
        Filter --> OutputStore[(Structured Data Output - JSON)]
    end

    subgraph vulnerability_intelligence_generator [Repo 2: vulnerability-intelligence-generator]
        direction LR
        InputTrigger(Monitor OutputStore) --> LangGraphWorkflow(LangGraph: Enrich/Analyze/Draft)
        LangGraphWorkflow -- Uses --> LLM(LLM API)
        LangGraphWorkflow -- Monitored By --> LangSmith[(LangSmith)]
        LangGraphWorkflow --> ReportOutput[(Markdown Reports)]
    end

    subgraph dont_panic [Repo 3: dont-panic (Frontend)]
        direction LR
        ReportFetcher(Fetch/Sync Reports) --> BuildProcess(Astro Build)
        BuildProcess --> Display(Filterable Table UI)
    end

    ExternalSources --> Ingest
    OutputStore --> InputTrigger
    ReportOutput --> ReportFetcher

    %% Styling (Conceptual)
    classDef repo fill:#f9f,stroke:#333,stroke-width:2px;
    class vulnerability_data_pipeline,vulnerability_intelligence_generator,dont_panic repo;

Workflow Summary: External vulnerability data (primarily from cve.org, CISA KEV, and other feeds) is ingested and filtered by the vulnerability-data-pipeline. Prioritized vulnerabilities trigger the vulnerability-intelligence-generator, which uses LLMs (via LangGraph) to create Markdown reports. These reports are then synced to the dont-panic frontend repository, which builds and displays them in a user-friendly, filterable table interface.

4. Repository-Specific Goals & Responsibilities
4.1. vulnerability-data-pipeline
Purpose: To act as the primary data ingestion and filtering engine for the AVIP system.

Responsibilities/Goals:

Reliably fetch data from configured external sources (prioritizing cve.org, CISA KEV, vendor feeds).

Parse diverse data formats (especially CVE JSON 5.0).

Normalize data into a consistent internal schema (defined in src/avip_pipeline/models.py).

Filter vulnerabilities based on defined criteria (CVSS >= 9.0, EPSS >= 0.70, zero-day heuristics).

Output structured data (JSON format) containing prioritized vulnerabilities.

Operate reliably via scheduled CI/CD jobs.

Maintain high test coverage for parsing, normalization, and filtering logic.

Inputs: External APIs, Data Feeds (JSON, XML, etc.).

Outputs: Structured JSON files containing prioritized vulnerability data (e.g., stored as CI/CD artifacts or in cloud storage).

Core Technology: Python, Pydantic, Requests, Pytest.

Guidance: Focus on data accuracy, robust error handling during fetching/parsing, and efficient filtering logic. Adhere strictly to .llmconfig/CLAUDE.md and API_STANDARDS.md for configuration.

4.2. vulnerability-intelligence-generator
Purpose: To enrich prioritized vulnerability data and generate insightful intelligence reports using LLMs.

Responsibilities/Goals:

Monitor for new prioritized vulnerability data output by the pipeline.

Orchestrate multi-step LLM workflows using LangGraph (enrichment, analysis, drafting).

Manage prompts effectively and securely via .llmconfig/.

Integrate securely with chosen LLM APIs.

Utilize LangSmith for comprehensive workflow tracing and observability.

Generate well-structured, informative reports in Markdown format.

Handle potential zero-day inputs with specific analysis logic/prompts.

Output generated reports to a defined location accessible by the frontend.

Trigger report generation via CI/CD based on pipeline output.

Inputs: Structured JSON data from vulnerability-data-pipeline.

Outputs: Markdown files containing vulnerability intelligence reports.

Core Technology: Python, LangChain, LangGraph, LangSmith SDK, Pydantic, Pytest.

Guidance: Focus on effective prompt engineering, robust LangGraph workflow design, reliable LLM interaction, error handling within the graph, and secure API key management. Adhere strictly to .llmconfig/CLAUDE.md and API_STANDARDS.md for configuration (especially LLM and LangSmith keys).

4.3. dont-panic (Frontend)
Purpose: To provide a highly functional, user-friendly web interface for browsing and analyzing the generated vulnerability intelligence reports.

Responsibilities/Goals:

Present vulnerability reports primarily via a data-dense, sortable, filterable table view on the homepage.

Provide a dedicated filter sidebar with comprehensive options (Severity, Scores, Dates, Status, Vendor, etc.).

Implement client-side JavaScript for table sorting, sidebar filtering, and URL state management (reflecting filters/sort in URL parameters).

Display full report details on dedicated pages (/reports/[slug]/).

Include static informational pages (About, Methodology).

Implement Pagefind for full-text search.

Ensure the interface is fully responsive and mobile-friendly.

Achieve high accessibility standards (WCAG 2.1 AA).

Automate report syncing from the generator's output location via CI/CD.

Build and deploy automatically via CI/CD.

Inputs: Markdown report files (synced from vulnerability-intelligence-generator).

Outputs: Static HTML/CSS/JS website.

Core Technology: Astro.js, Tailwind CSS, TypeScript, Playwright (for E2E tests).

Guidance: Focus on implementing the table/sidebar UI effectively, ensuring robust client-side interactivity (sorting/filtering/URL state), optimizing for performance and usability for security analysts, and maintaining strict adherence to .llmconfig/CLAUDE.md and accessibility standards. If any API keys are needed (e.g., for future enhancements), adhere to API_STANDARDS.md.