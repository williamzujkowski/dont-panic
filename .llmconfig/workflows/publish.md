Okay, let's create a similar TDD-style plan for generating the GitHub Actions workflow to deploy your Astro site to GitHub Pages. This plan guides the LLM step-by-step.

---

**TDD Plan: GitHub Actions Workflow for Astro GitHub Pages Deployment**

**Goal:** Create a GitHub Actions workflow (`.github/workflows/deploy.yml`) that automatically builds the Astro project and deploys it to GitHub Pages upon pushes to the `main` branch.

**Assumptions:**

* Your repository is on GitHub.
* GitHub Pages is enabled for your repository (Source: GitHub Actions).
* Your Astro project builds correctly using `npm run build`.
* Your `astro.config.mjs` is configured with the correct `site` URL and `base` path if deploying to a project site (e.g., `base: '/your-repo-name/'`). If deploying to a user/org site (`username.github.io`), `base` should likely be `/`. **This configuration in `astro.config.mjs` is crucial and should be done first.**

---

**Phase 1: Basic Workflow Setup & Build**

* **Step 1.1: Create Workflow File and Trigger**
    * **(Define/Test - Red):** Create a workflow file that triggers on push to the `main` branch. It should define a single job that runs on Ubuntu and checks out the code.
    * **(Implement - Green):** Create `.github/workflows/deploy.yml`. Add `name`, `on: push: branches: [ "main" ]`, `workflow_dispatch:`, a `build` job (`jobs: build: runs-on: ubuntu-latest`), and the checkout step (`steps: - uses: actions/checkout@v4`).
    * **(Verify):** Commit and push the `.github/workflows/deploy.yml` file to `main`. Go to the Actions tab in your GitHub repository. Does the workflow run? Does the "build" job start and the "checkout" step succeed?

* **Step 1.2: Setup Node.js Environment**
    * **(Define/Test - Red):** Add a step to install the specific Node.js version your project requires (e.g., LTS version like 20.x).
    * **(Implement - Green):** Add the `actions/setup-node@v4` step to the `build` job *after* checkout, specifying the `node-version`.
        ```yaml
        - name: Setup Node.js
          uses: actions/setup-node@v4
          with:
            node-version: '20' # Adjust to your project's required Node version
            cache: 'npm' # Enable caching for npm managed by setup-node
        ```
    * **(Verify):** Trigger the workflow (push to `main` or manual trigger via `workflow_dispatch`). Does the "Setup Node.js" step run successfully and log the correct Node version?

* **Step 1.3: Install Dependencies**
    * **(Define/Test - Red):** Add a step to install project dependencies using `npm ci` (preferred for CI for speed and reliability using `package-lock.json`).
    * **(Implement - Green):** Add a step *after* Node.js setup:
        ```yaml
        - name: Install Dependencies
          run: npm ci
        ```
    * **(Verify):** Trigger the workflow. Does the "Install Dependencies" step complete successfully? Does the npm cache (enabled in 1.2) show hits on subsequent runs?

* **Step 1.4: Build the Astro Site**
    * **(Define/Test - Red):** Add a step to execute the Astro build command (`npm run build`).
    * **(Implement - Green):** Add a step *after* dependency installation:
        ```yaml
        - name: Build Astro Site
          run: npm run build # Assumes 'build' script in package.json runs 'astro build'
        ```
    * **(Verify):** Trigger the workflow. Does the "Build Astro Site" step run successfully? Check the logs for any build errors. (It should build into the `dist` directory by default).

**Phase 2: GitHub Pages Configuration & Deployment**

* **Step 2.1: Configure GitHub Pages Artifact**
    * **(Define/Test - Red):** Add steps required by the official `deploy-pages` action to prepare the built site (`dist` directory) for deployment.
    * **(Implement - Green):** Add the `actions/configure-pages@v4` and `actions/upload-pages-artifact@v3` steps *after* the build step within the `build` job:
        ```yaml
        - name: Setup Pages
          uses: actions/configure-pages@v4

        - name: Upload artifact
          uses: actions/upload-pages-artifact@v3
          with:
            # Upload repository's default dist directory
            path: './dist'
        ```
    * **(Verify):** Trigger the workflow. Do the "Setup Pages" and "Upload artifact" steps complete successfully? Check the run summary page for a "github-pages" artifact link.

* **Step 2.2: Add Deployment Job & Permissions**
    * **(Define/Test - Red):** Add a new `deploy` job that depends on the `build` job completing successfully. This job will use the official `actions/deploy-pages@v4` action. Grant necessary permissions to the workflow.
    * **(Implement - Green):**
        1.  Add top-level `permissions` to the workflow file:
            ```yaml
            permissions:
              contents: read
              pages: write
              id-token: write
            ```
        2.  Add a new `deploy` job *after* the `build` job:
            ```yaml
            deploy:
              environment:
                name: github-pages
                url: ${{ steps.deployment.outputs.page_url }}
              runs-on: ubuntu-latest
              needs: build # Depends on the build job completing successfully
              steps:
                - name: Deploy to GitHub Pages
                  id: deployment
                  uses: actions/deploy-pages@v4
            ```
    * **(Verify):** Trigger the workflow. Does the `build` job complete? Does the `deploy` job start? Does the "Deploy to GitHub Pages" step succeed? Check the deployment environment URL provided in the run summary or the repository's "Environments" tab. **Crucially: Visit the deployed URL. Does the site load correctly? Are assets (CSS, JS, images) loading without 404 errors?** (This verifies the `base` path config).

**Phase 3: Optimization & Refinement**

* **Step 3.1: Add Concurrency Control**
    * **(Define/Test - Red):** Prevent multiple workflow runs for the same Pages environment from running simultaneously or deploying outdated code.
    * **(Implement - Green):** Add a top-level `concurrency` group to the workflow file:
        ```yaml
        concurrency:
          group: "pages"
          cancel-in-progress: true
        ```
    * **(Verify):** Push multiple commits to `main` in quick succession. Go to the Actions tab. Do you see older runs being cancelled automatically?

* **Step 3.2: Review and Finalize**
    * **(Define/Test - Red):** Review the complete workflow file for clarity, correctness, and adherence to best practices. Ensure all necessary steps are present and permissions are correctly scoped.
    * **(Implement - Green):** Make any necessary adjustments to step names, comments, or ordering for readability. Ensure the Node.js version is correct.
    * **(Verify):** Trigger the workflow one last time. Review the logs and the deployed site to confirm everything works as expected.

---

**Resulting `todo.md` Checklist for LLM:**

```markdown
# TODO - GitHub Actions Workflow for GitHub Pages Deployment

This checklist guides the creation of the `.github/workflows/deploy.yml` file.

## Phase 1: Basic Workflow Setup & Build

### 1.1: Workflow File and Trigger
- [x] Create `.github/workflows/deploy.yml`.
- [x] Add `name: Deploy Astro Site to Pages`.
- [x] Add trigger `on: push: branches: ["main"]`.
- [x] Add `workflow_dispatch:` trigger for manual runs.
- [x] Define a `build` job running on `ubuntu-latest`.
- [x] Add `actions/checkout@v4` step to the `build` job.
- [x] **Verify:** Workflow runs on push/manual trigger; checkout succeeds.

### 1.2: Setup Node.js Environment
- [x] Add `actions/setup-node@v4` step after checkout.
- [x] Specify the correct `node-version` (e.g., '20').
- [x] Enable npm caching via `cache: 'npm'` within the setup-node action.
- [x] **Verify:** Step succeeds; correct Node version logged; cache potentially used on 2nd run.

### 1.3: Install Dependencies
- [x] Add step `name: Install Dependencies` after Node.js setup.
- [x] Use command `run: npm ci`.
- [x] **Verify:** Step succeeds; dependencies installed; cache hit speeds up subsequent runs.

### 1.4: Build the Astro Site
- [x] Add step `name: Build Astro Site` after dependency install.
- [x] Use command `run: npm run build`.
- [x] **Verify:** Step succeeds; no build errors logged.

## Phase 2: GitHub Pages Configuration & Deployment

### 2.1: Configure GitHub Pages Artifact
- [x] Add step `name: Setup Pages` using `actions/configure-pages@v4` after build.
- [x] Add step `name: Upload artifact` using `actions/upload-pages-artifact@v3` after Setup Pages.
- [x] Configure `upload-pages-artifact` with `path: './dist'`.
- [x] **Verify:** Steps succeed; "github-pages" artifact appears in run summary.

### 2.2: Add Deployment Job & Permissions
- [x] Add top-level `permissions` block (`contents: read`, `pages: write`, `id-token: write`).
- [x] Define a new `deploy` job running on `ubuntu-latest`.
- [x] Add `needs: build` to the `deploy` job.
- [x] Define `environment: name: github-pages` and `url: ${{ steps.deployment.outputs.page_url }}` for the `deploy` job.
- [x] Add step `name: Deploy to GitHub Pages` to the `deploy` job using `actions/deploy-pages@v4`. Assign `id: deployment`.
- [x] **Verify:** `build` job completes, `deploy` job runs & succeeds; **visit deployed URL and confirm site loads correctly with assets**.

## Phase 3: Optimization & Refinement

### 3.1: Add Concurrency Control
- [x] Add top-level `concurrency:` block.
- [x] Set `group: "pages"`.
- [x] Set `cancel-in-progress: true`.
- [x] **Verify:** Rapid pushes result in older workflow runs being cancelled.

### 3.2: Review and Finalize
- [x] Review the entire `deploy.yml` file for clarity and correctness.
- [x] Ensure comments explain non-obvious parts.
- [x] Confirm Node.js version matches project requirements.
- [x] **Verify:** Final workflow run executes successfully, deployment looks correct.
```

This plan provides the LLM with small, verifiable steps to construct the GitHub Actions workflow, mirroring the TDD approach used for the website code itself.
