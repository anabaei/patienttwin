# Vercel CVE-2025-66478 deployment fix

This project uses **Next.js 15.5.9** (patched for CVE-2025-66478 and related CVEs).  
`npx fix-react2shell-next` reports: **No vulnerable packages found.**

If Vercel still blocks deployment with "Vulnerable version of Next.js detected", try the following.

## 1. Ensure Vercel sees the full monorepo

- **Root Directory:** `patient-portal` (keep as-is).
- **Include source files outside of the Root Directory:** **ON**  
  (Project Settings → General → Root Directory → enable this).  
  This makes the repo root (and `pnpm-lock.yaml` + root `package.json` overrides) available when the install runs.

## 2. Commit and push

Ensure these are committed and pushed on the branch Vercel deploys:

- `package.json` (root, with `pnpm.overrides` for `next@15.5.9`)
- `patient-portal/package.json` (`"next": "15.5.9"`)
- `pnpm-lock.yaml` (root)

Then trigger a new deployment (e.g. push a commit or redeploy).

## 3. Clear build cache

Redeploy with **Clear cache and redeploy** (Deployments → … on latest deployment → Redeploy → clear cache).  
This forces a fresh `pnpm install` so the lockfile and overrides are applied.

## 4. If it still fails: override the block (false positive workaround)

We are on a patched version (15.5.9). If Vercel’s check still blocks you, you can bypass it **only** for this false positive:

1. Vercel Dashboard → your project → **Settings** → **Environment Variables**.
2. Add:
   - **Name:** `DANGEROUSLY_DEPLOY_VULNERABLE_CVE_2025_66478`
   - **Value:** `1`
   - **Environments:** Production (and Preview if you want).
3. Save and redeploy.

Use this only after confirming locally that `npx fix-react2shell-next` reports no vulnerabilities. You can remove the variable once Vercel updates their detection.
