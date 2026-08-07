# CodeHub Portfolio Platform

An AI-powered developer portfolio generator. Users enter their GitHub username, skills, and
a few rough project notes — the platform automatically fetches real GitHub activity, uses
Google Gemini to write a polished bio and refine project descriptions, and publishes a
permanent, shareable portfolio page.

🔗 **Live site:** [codehub-portfolio.vercel.app](https://codehub-portfolio.vercel.app)

## What it does

1. User fills out a short signup form (GitHub username, skills, project notes, optional contact links and profile photo)
2. The platform fetches real data from the GitHub REST API (repos, stars, followers, top languages, join date)
3. Google Gemini AI writes a professional bio, skill tags, and polishes each project description
4. Everything is saved permanently to a Supabase database
5. A live portfolio page is generated at `/portfolio/[username]` — no repeated AI cost on future visits
6. Visitors can download the portfolio as a PDF

## Tech Stack

- **Next.js** (React framework, App Router) — frontend + backend API routes in one project
- **TypeScript** — type safety across the codebase
- **Tailwind CSS** — styling
- **Supabase** (PostgreSQL + Storage) — database for profiles/projects, and file storage for uploaded photos
- **GitHub REST API** — source of real developer activity data
- **Google Gemini API** — generates bio, skill tags, and refined project descriptions
- **Vercel** — hosting and continuous deployment

## Challenges Faced and Solutions

Building this project involved real, practical problems at nearly every stage. Below is an honest record of the major issues encountered and how each was resolved.

### 1. PowerShell blocked script execution
- **Challenge:** Running `npx create-next-app` failed with "running scripts is disabled on this system."
- **Solution:** Ran `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser` to allow local scripts to execute.

### 2. Git was not installed
- **Challenge:** The terminal did not recognize the `git` command, blocking version control and deployment.
- **Solution:** Installed Git for Windows and fully restarted VS Code so it could detect the updated system PATH.

### 3. File and folder structure mistakes
- **Challenge:** Components were repeatedly created inside the wrong folder (nested under `app/api/...` instead of the project root), causing "Cannot find module" errors.
- **Solution:** Diagnosed the exact issue using TypeScript error messages and file paths, then moved folders to the correct root level.

### 4. Corrupted file content after pasting code
- **Challenge:** Pasting code sometimes produced broken, duplicated JSX with dozens of syntax errors.
- **Solution:** Deleted the affected file entirely and recreated it fresh rather than patching line-by-line.

### 5. Gemini AI model deprecation
- **Challenge:** The AI generation step failed — first with a quota error on `gemini-2.0-flash`, then a 404 "no longer available" error on `gemini-2.5-flash`.
- **Solution:** Queried the Gemini API's model list endpoint to see which models were actually available, then switched to `gemini-flash-latest`, an alias that always points to the current recommended model.

### 6. Environment variable confusion
- **Challenge:** While configuring Vercel, a Supabase URL was accidentally typed into a "Key" field instead of a "Value" field.
- **Solution:** Corrected the field placement manually; recommended using Vercel's "Import .env" feature going forward to eliminate manual transcription errors.

### 7. Duplicate local dev servers
- **Challenge:** Multiple terminal sessions each tried to start the dev server, causing port conflicts.
- **Solution:** Used `taskkill /PID [id] /F` to terminate the conflicting process before restarting cleanly.

### 8. Uncommitted secret keys risk
- **Challenge:** Risk of accidentally publishing private API keys (`.env.local`) to the public GitHub repository.
- **Solution:** Verified `.env.local` was covered by `.gitignore`, and double-checked the live repository's file list after every push.

## Overall Learnings

### Technologies learned

- **Next.js** — learned how a single framework can handle both the pages users see (frontend) and the backend logic (API routes) in one project, and how folder names control page addresses (like `[username]` creating a dynamic page for every user).
- **TypeScript** — learned why adding types to JavaScript catches mistakes early, before the code even runs.
- **React** — learned the basics of components, state (`useState`), and how a form updates and reacts as the user types.
- **Tailwind CSS** — learned how to style a whole website quickly using small utility classes instead of writing separate CSS files.
- **Supabase** — learned how to set up a real database (tables, columns) and file storage without needing to build or host a database server myself.
- **REST APIs** — learned how to call an external service (like GitHub) from code and use the data it sends back.
- **Google Gemini API** — learned how to send a written instruction ("prompt") to an AI model and get back structured, usable text.
- **Git and GitHub** — learned how to save version history, push code to the cloud, and collaborate with a teammate on the same project.
- **Vercel** — learned how to deploy a website live on the internet, and how it automatically rebuilds the site every time new code is pushed.
- **GitHub Actions (CI/CD)** — learned how to set up an automated pipeline that checks the code builds correctly every time it changes.
- **Environment variables** — learned why secret keys (like API keys) should never be written directly in code, and how to store them safely instead.

### Practical lessons learned

- Windows sometimes blocks scripts from running by default, so you may need to change a security setting before tools like `npx` will work.
- After installing new software (like Git), you often need to fully restart your code editor before it recognizes the new tool.
- In Next.js, where you place a file actually matters — put it in the wrong folder and the app can't find it, even if the code inside is correct.
- Sometimes pasting code causes weird, hard-to-explain errors. When that happens, it's often faster to delete the file and paste fresh than to try fixing it piece by piece.
- AI tools like Gemini update their models often, and older model names can stop working. Using a "latest" version instead of a fixed one helps avoid this problem in the future.
- It's easy to accidentally mix up which box you're supposed to type a name in versus a value — always double check before saving settings like environment variables.
- Running multiple terminals at once can leave old processes stuck in the background, blocking new ones from starting. You have to manually close them.
- Never assume your private keys are safe just because you meant to hide them — always check the actual GitHub repository to confirm secret files were not uploaded by mistake.
- Vercel automatically rebuilds and updates your live website every time you push new code to GitHub — but it does not automatically know your secret keys, so those have to be added separately in Vercel's own settings.
- Supabase gives you both a database and file storage, but they work differently — the database is ready to use right away with the right key, while file storage (like photo uploads) needs its own permission rules turned on before it will actually work.
## Complete Feature List

- AI-generated bio and skill tags (via Google Gemini)
- AI-refined project descriptions from rough notes
- Real GitHub data integration (repos, followers, stars, top languages)
- Featured repositories section (top-starred repos)
- GitHub join date display
- Custom profile picture (GitHub avatar, file upload, or external URL)
- Optional contact/social links (email, website, LinkedIn, Twitter/X)
- Permanent, zero-cost hosting per visit (no repeated AI calls)
- Unique public URL per user (`/portfolio/username`)
- Dynamic SEO metadata per portfolio page
- PDF export/download
- Custom 404 page
- Duplicate username protection
- Responsive, animated dark UI
- Automated CI pipeline via GitHub Actions

## What is CI/CD?

**CI/CD** stands for **Continuous Integration** and **Continuous Deployment**. It is a standard engineering practice for automatically testing and shipping code changes instead of doing so manually.

- **Continuous Integration (CI):** Every time new code is pushed, an automated process downloads the code, installs dependencies, and attempts to build the project — catching mistakes within minutes instead of much later.
- **Continuous Deployment (CD):** If the build succeeds, the verified code is automatically published live, with no manual upload step.

**In plain terms:** CI/CD automatically answers two questions every time code changes — "Does this still work?" and, if yes, "Is this now live for users?"

## How the CI/CD Pipeline Works in This Project

This project uses **GitHub Actions** for Continuous Integration, configured in `.github/workflows/ci.yml`.

**Trigger:** Runs automatically on every push or pull request to the `main` branch.

**Pipeline steps:**
1. **Checkout code** — downloads the exact code just pushed
2. **Set up Node.js** — installs the correct runtime (Node 20)
3. **Install dependencies** — runs `npm install`
4. **Build the project** — runs `npm run build`, which fails loudly on any TypeScript error, broken import, or syntax problem
5. **Report result** — GitHub shows a green checkmark (success) or red cross (failure) on the commit and in the Actions tab

**Secrets management:** Environment variables needed for the build (Supabase and Gemini keys) are stored securely as GitHub Repository Secrets (Settings → Secrets and variables → Actions) and referenced via `${{ secrets.SECRET_NAME }}` — never exposed in the code itself.

This reflects a real, industry-standard practice: no code reaches `main` without being automatically verified first. Deployment itself is separately automated by Vercel, which redeploys the live site whenever new code is pushed — completing the full CI/CD loop.