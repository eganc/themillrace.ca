# Deployment Guide: Vercel + Cloudflare

This guide explains how to deploy the **Millrace Oracle** to Vercel and point your Cloudflare domain (`themillrace.ca`) to it.

## 1. Push to GitHub
Ensure your latest code is pushed to your GitHub repository.

## 2. Deploy to Vercel
1.  Log in to [Vercel](https://vercel.com/).
2.  Click **"Add New..."** -> **"Project"**.
3.  Select your GitHub repository (`themillrace.ca`).
4.  **Configure Project**:
    - **Framework Preset**: Vite (should be auto-detected).
    - **Root Directory**: `marketing` (since your app is in a subdirectory).
    - **Environment Variables**:
        - Add `VITE_GEMINI_API_KEY` : `[Your Google Gemini API Key]`
5.  Click **Deploy**.

## 3. Connect Domain (Vercel Side)
1.  Once deployed, go to the project **Settings** -> **Domains**.
2.  Enter `themillrace.ca`.
3.  Vercel will likely ask you to add `www.themillrace.ca` as well.
4.  Vercel will give you a **CNAME** or **A Record** value (e.g., `cname.vercel-dns.com` or `351c91e...vercel-dns-017.com`).

## 4. Update Cloudflare (DNS Side)
1.  Log in to [Cloudflare](https://dash.cloudflare.com/).
2.  Select `themillrace.ca`.
3.  Go to **DNS** -> **Records**.
4.  **Add/Edit Record**:
    - **Type**: `CNAME`
    - **Name**: `www`
    - **Target**: `351c91e007d5614b.vercel-dns-017.com` (Use the EXACT value Vercel provides in your dashboard).
    - **Proxy Status**: Proxied (Orange Cloud) is fine.

    *(Repeat this for the root `@` record if you haven't already).*

5.  Vercel will verify the domain (takes a few minutes).

## Troubleshooting
- **404 on Homepage/Refresh**: 
    - **CRITICAL**: Go to **Settings** -> **General** -> **Root Directory**. Ensure it is set to **`marketing`**. If it is empty, Vercel is looking in the wrong folder.
    - If refreshing gives 404, verify `marketing/vercel.json` exists.
- **API Errors**: Check the Vercel Function logs or Console logs. If you see quota errors, check your Google AI Studio limits.
- **DNS Issues**:
    - Root (`@`) uses `cname.vercel-dns.com` (via CNAME flattening).
    - `www` uses the **specific** target provided by Vercel.
