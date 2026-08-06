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

## Project Structure