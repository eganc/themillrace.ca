# Millrace Oracle: Development Log

**Status:** Live Production (`themillrace.ca`)
**Stack:** React + Vite + Google Gemini (Flash)

## Continuous Deployment Guide (How to Update)
Anytime you want to update the site, simply:
1.  Make your changes in the code.
2.  Commit and Push to GitHub:
    ```bash
    git add .
    git commit -m "Update text"
    git push
    ```
3.  Vercel will detect the push and automatically redeploy the site (usually takes ~45 seconds).

## Safe Development (Preview Mode)
To work on changes **without** affecting the live site (`themillrace.ca`):

1.  **Create a Branch**:
    ```bash
    git checkout -b new-feature
    ```
2.  **Work & Push**:
    ```bash
    git add .
    git commit -m "Try new headline"
    git push -u origin new-feature
    ```
3.  **Check Preview**:
    - Go to Vercel Dashboard.
    - You will see a **Preview Deployment** for that branch.
    - It gets its own unique URL (e.g., `marketing-git-new-feature...vercel.app`).
    - The live site stays untouched.

4.  **Publish**:
    - When you are happy with the preview, merge it to main:
    ```bash
    git checkout main
    git merge new-feature
    git push origin main
    ```

## Project Structure
- `src/App.jsx`: Main entry point and orchestrator.
- `src/components/BackgroundFlow.jsx`: Visual engine (Particle Physics).
- `src/components/ArtifactRenderer.jsx`: UI Component engine (Visual Cards).
- `src/GeminiService.js`: Interface to Google's Generative AI.
- `src/Knowledge.js`: Hardcoded "Offline" knowledge base and backup responses.
- `src/SoundEngine.js`: Audio context and procedural sound generation.

## January 2026: Deployment & Cleanup
- **Migrated Repo:** Renamed to `themillrace.ca` to match domain.
- **Refactoring:** Split monolithic App component into modular pieces.
- **Cleanup:** Removed test scripts.
- **Deployment:** 
    - Configured Vercel with correct `marketing` Root Directory.
    - Configured Cloudflare DNS (CNAME flattening).
