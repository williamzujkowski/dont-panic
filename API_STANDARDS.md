# API Standards for AVIP Repositories

This document outlines the standardized naming conventions and requirements for API keys, environment variables, and other user-supplied configuration values across all AVIP (Automated Vulnerability Intelligence Platform) repositories:

1. [vulnerability-data-pipeline](https://github.com/williamzujkowski/vulnerability-data-pipeline)
2. [vulnerability-intelligence-generator](https://github.com/williamzujkowski/vulnerability-intelligence-generator)
3. [dont-panic](https://github.com/williamzujkowski/dont-panic)

## Key Principles

- **Consistency**: All configuration parameters must use the same naming across all repositories
- **Clarity**: Names must be descriptive and indicate the service they relate to
- **Security**: Sensitive keys must never be hardcoded or included in source control
- **Documentation**: All required keys must be documented here and in repository-specific README files

## Environment Variables

### Naming Conventions

- Use UPPER_SNAKE_CASE for all environment variables
- Prefix with service/provider name where applicable
- Use descriptive, specific names that indicate purpose

### Required Keys by Repository

#### vulnerability-data-pipeline

| Variable Name | Description | Required | Default | Example |
|---------------|-------------|----------|---------|---------|
| `CVE_API_KEY` | API key for CVE services | Yes | None | `abc123def456` |
| `NVD_API_KEY` | API key for NVD database | No | None | `xyz789abc012` |
| `CISA_KEV_URL` | URL for CISA KEV feed | No | `https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json` | |
| `AVIP_OUTPUT_DIR` | Directory path for outputs | No | `./output` | `/data/avip/pipeline-output` |
| `AVIP_LOG_LEVEL` | Log level (DEBUG, INFO, WARNING, ERROR, CRITICAL) | No | `INFO` | `DEBUG` |

#### vulnerability-intelligence-generator

| Variable Name | Description | Required | Default | Example |
|---------------|-------------|----------|---------|---------|
| `OPENAI_API_KEY` | API key for OpenAI services | Yes | None | `sk-abc123def456` |
| `ANTHROPIC_API_KEY` | API key for Anthropic Claude | No | None | `sk-ant-xyz789` |
| `LANGSMITH_API_KEY` | API key for Langsmith observability | Yes | None | `ls-abc123xyz789` |
| `LANGCHAIN_TRACING` | Enable/disable Langchain tracing | No | `false` | `true` |
| `AVIP_INPUT_DIR` | Directory path for vulnerability data inputs | No | `./input` | `/data/avip/pipeline-output` |
| `AVIP_OUTPUT_DIR` | Directory path for report outputs | No | `./reports` | `/data/avip/reports` |
| `AVIP_LOG_LEVEL` | Log level (DEBUG, INFO, WARNING, ERROR, CRITICAL) | No | `INFO` | `DEBUG` |

#### dont-panic

| Variable Name | Description | Required | Default | Example |
|---------------|-------------|----------|---------|---------|
| `GITHUB_TOKEN` | GitHub token for CI/CD workflows | Yes* | None | `ghp_abc123def456` |
| `AVIP_REPORTS_SOURCE` | Source path/URL for reports | No | None | `https://github.com/williamzujkowski/vulnerability-intelligence-generator/reports` |
| `AVIP_LOG_LEVEL` | Log level (DEBUG, INFO, WARNING, ERROR, CRITICAL) | No | `INFO` | `DEBUG` |

*Required only for GitHub Actions workflows

### Shared Variables

These variables are standardized across all repositories:

| Variable Name | Description | Required | Default | Example |
|---------------|-------------|----------|---------|---------|
| `AVIP_ENV` | Environment (development, staging, production) | No | `development` | `production` |
| `AVIP_LOG_LEVEL` | Log level (DEBUG, INFO, WARNING, ERROR, CRITICAL) | No | `INFO` | `DEBUG` |

## Configuration Files

### Local Development

For local development, each repository should include:

1. `.env.example` file showing all required and optional variables with sample values
2. Documentation in the README.md explaining how to create a local `.env` file
3. Clear instructions on where/how to obtain API keys

Example `.env.example` file:
```
# Required
OPENAI_API_KEY=sk-your-key-here

# Optional
AVIP_LOG_LEVEL=DEBUG
```

### Production Deployment

For production deployments:

1. Use environment variables set in the deployment platform (GitHub Actions, cloud service, etc.)
2. Never commit production credentials to the repository
3. Use appropriate secrets management for the deployment platform

## GitHub Actions Configuration

### Secret Names

When setting GitHub repository secrets, use the exact same names as the environment variables listed above.

### Workflow Usage

In workflow files (`.github/workflows/*.yml`), reference secrets consistently:

```yaml
env:
  OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
  AVIP_LOG_LEVEL: ${{ vars.AVIP_LOG_LEVEL || 'INFO' }}
```

## Data Exchange Standards

When passing data between repositories (e.g., from pipeline to generator to frontend):

1. Use consistent JSON schema defined in [vulnerability-data-pipeline](https://github.com/williamzujkowski/vulnerability-data-pipeline) repository
2. Maintain filename formats: `CVE-YYYY-NNNNN.json` for JSON data and `CVE-YYYY-NNNNN.md` for Markdown reports
3. Include standard metadata fields in all reports

## Compliance Requirements

- All repositories must prevent credentials from being logged or exposed
- Include appropriate error handling for missing credentials
- Provide clear error messages when required keys are missing
- Never store credentials in container images

## Getting API Keys

Instructions for obtaining required API keys:

| Service | Instructions | Documentation Link |
|---------|--------------|-------------------|
| OpenAI API | Create an account at OpenAI, navigate to API keys section | [OpenAI API Keys](https://platform.openai.com/api-keys) |
| Anthropic API | Apply for access to Claude API and generate key | [Anthropic API](https://console.anthropic.com/settings/keys) |
| LangSmith | Register for LangSmith and generate API key | [LangSmith](https://smith.langchain.com/) |
| NVD API | Register on the NVD website to obtain a key | [NVD API Key](https://nvd.nist.gov/developers/request-an-api-key) |

## Troubleshooting

If you encounter issues with API keys or configuration:

1. Check that the environment variable is correctly named (exact case match)
2. Verify the key is valid and not expired
3. Ensure you have appropriate access permissions for the service
4. Check the application logs for specific error messages

## Updating This Document

When adding new required configuration parameters to any repository:

1. First update this document with the new parameter
2. Ensure consistent naming across repositories
3. Update the `.env.example` files in affected repositories
4. Update repository README files with the new requirements

---

This document serves as the single source of truth for API keys and configuration across all AVIP repositories. Maintaining consistency between repositories is critical for seamless integration and operation of the platform.