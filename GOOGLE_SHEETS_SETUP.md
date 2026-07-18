# Google Sheets + Netlify setup

This project uses one Google spreadsheet with two tabs. Contact and newsletter data is written only by Netlify Functions, so the service-account key never reaches the browser.

## 1. Create the spreadsheet

1. Create a Google Sheet and rename its first tab to `Contact Form`.
2. Add a second tab named `Newsletter`.
3. Add these headers to row 1 of `Contact Form`:
   `Submission ID | Received At | Name | Email | Phone | Company | Organization Type | Subject | Message`
4. Add these headers to row 1 of `Newsletter`:
   `Submission ID | Subscribed At | Email | Source`
5. Copy the spreadsheet ID from the URL: `https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit`.

## 2. Create a free Google Cloud service account

1. Open Google Cloud Console, create/select a project, then open **APIs & Services → Library**.
2. Enable **Google Sheets API**. Google Drive API is not required.
3. Open **IAM & Admin → Service Accounts**, create a service account, and copy its email.
4. Open that account's **Keys** tab, choose **Add key → Create new key → JSON**, and securely download the file.
5. In the Google Sheet, click **Share** and give the service-account email **Editor** access. Do not make the sheet public.

If key creation is disabled by your Google Workspace organization policy, ask its administrator for a narrowly scoped exception or create the project under an account where you control that policy. Store the downloaded JSON securely, never commit it, and rotate/delete the key if it is exposed.

## 3. Configure local development (optional)

1. Copy `.env.example` to `.env`.
2. Fill in the spreadsheet ID, `client_email`, and `private_key` from the downloaded JSON file.
3. Keep the private key quoted and represent its line breaks as `\n`, as shown in `.env.example`.
4. Run `npx netlify dev` when you want to test Functions locally. Plain `npm run dev` serves only the UI.

## 4. Deploy through the Netlify GUI

Do not drag and drop only the `dist` folder. That publishes the static frontend but leaves out `netlify/functions`. For a GUI-based deployment, connect the complete project through GitHub, GitLab, or Bitbucket.

### A. Put the complete project in a Git repository

1. Create a private repository in your Git provider's website.
2. Upload/push the complete project, including `src`, `netlify`, `netlify.toml`, `package.json`, and `package-lock.json`.
3. Do not upload `.env`, the downloaded service-account JSON, `node_modules`, or `dist`.
4. Confirm `.env.example` contains placeholders only. If a real key was ever committed, delete that key in Google Cloud and create a replacement before deploying.

### B. Import the repository in Netlify

1. Open the Netlify dashboard and choose **Add new project → Import an existing project**.
2. Choose your Git provider, authorize Netlify, and select the repository.
3. On the deployment configuration screen, use:
   - **Base directory:** leave blank
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
   - **Functions directory:** `netlify/functions`
4. Select **Deploy project**. The checked-in `netlify.toml` already contains these settings and takes precedence if the UI shows different defaults.

### C. Add production environment variables

1. Open the new Netlify project.
2. Go to **Project configuration → Environment variables** and choose **Add a variable**.
3. Add the following separately:
   - `GOOGLE_SHEETS_SPREADSHEET_ID`: the ID between `/d/` and `/edit` in the Sheet URL
   - `GOOGLE_SERVICE_ACCOUNT_EMAIL`: the JSON file's `client_email`
   - `GOOGLE_PRIVATE_KEY`: the JSON file's `private_key` value only, including the BEGIN/END lines
   - `CONTACT_SHEET_NAME`: `Contact Form`
   - `NEWSLETTER_SHEET_NAME`: `Newsletter`
4. Make each variable available to **Functions** and the **Production** deploy context. Add Deploy Previews only if preview submissions should write to the same sheet.
5. Never add a `VITE_` prefix to these variables; that would expose them to browser code.

### D. Redeploy after adding variables

1. Go to **Deploys** in the Netlify project.
2. Choose **Trigger deploy → Deploy site** (or **Clear cache and deploy site** if the regular redeploy still uses stale configuration).
3. Open the completed deploy and confirm its deploy log lists the `contact` and `subscribe` functions.

## 5. Verify safely

1. Open `https://YOUR-SITE.netlify.app/.netlify/functions/subscribe` in a browser. A `405` response containing `{"error":"Method not allowed."}` confirms the function is deployed. Website HTML or a `404` means only the frontend was deployed.
2. In Netlify, open **Functions** and confirm both `contact` and `subscribe` are listed.
3. Submit one newsletter email and confirm a row appears in `Newsletter`.
4. Submit one contact form and confirm a row appears in `Contact Form`.
5. Test invalid email/phone values and confirm no row is written.
6. If a valid submission fails, open **Functions → subscribe/contact → Logs**:
   - `Missing required environment variable`: correct the Netlify variable name or Functions scope, then redeploy.
   - Google authentication failure: replace/re-enter the service-account email or private key, then redeploy.
   - Google Sheets `403`: enable Sheets API and share the spreadsheet with the service-account email as Editor.
   - Unable to parse range / `400`: make the spreadsheet tab names exactly match the configured names.

## Cost and reliability notes

- Netlify's current Free plan provides 300 credits per month with a hard spending limit. Google says standard Sheets API use has no additional cost within its quotas, although Google plans charges for quota overages later in 2026. Monitor both dashboards as pricing changes.
- Each request validates on both client and server, times out stalled calls, keeps form data after failure, blocks a bot honeypot, uses a submission ID to avoid duplicate rows when the same request is replayed, and is rate-limited per IP/domain by Netlify.
- For higher traffic or stronger anti-spam requirements, add CAPTCHA and move idempotency/rate-limit state to a durable store.
