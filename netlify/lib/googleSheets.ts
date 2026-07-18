import { createSign } from "node:crypto";

const SHEETS_SCOPE = "https://www.googleapis.com/auth/spreadsheets";
const REQUEST_TIMEOUT_MS = 10_000;
let cachedToken: { value: string; expiresAt: number } | undefined;

function requiredEnv(name: string) {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

function base64Url(value: string) {
  return Buffer.from(value).toString("base64url");
}

async function getAccessToken() {
  if (cachedToken && cachedToken.expiresAt > Date.now() + 60_000) return cachedToken.value;

  const now = Math.floor(Date.now() / 1000);
  const header = base64Url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const claims = base64Url(JSON.stringify({
    iss: requiredEnv("GOOGLE_SERVICE_ACCOUNT_EMAIL"),
    scope: SHEETS_SCOPE,
    aud: "https://oauth2.googleapis.com/token",
    iat: now,
    exp: now + 3600,
  }));
  const unsignedJwt = `${header}.${claims}`;
  const signer = createSign("RSA-SHA256");
  signer.update(unsignedJwt);
  signer.end();
  const signature = signer.sign(requiredEnv("GOOGLE_PRIVATE_KEY").replace(/\\n/g, "\n"), "base64url");

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  let response: Response;
  try {
    response = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
        assertion: `${unsignedJwt}.${signature}`,
      }),
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeout);
  }
  if (!response.ok) throw new Error(`Google authentication failed with status ${response.status}.`);
  const token = await response.json() as { access_token?: string; expires_in?: number };
  if (!token.access_token) throw new Error("Google authentication did not return an access token.");
  cachedToken = {
    value: token.access_token,
    expiresAt: Date.now() + (token.expires_in || 3600) * 1000,
  };
  return cachedToken.value;
}

async function sheetsRequest(path: string, init?: RequestInit) {
  const accessToken = await getAccessToken();

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const response = await fetch(`https://sheets.googleapis.com/v4/${path}`, {
      ...init,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        ...init?.headers,
      },
      signal: controller.signal,
    });
    if (!response.ok) {
      const details = await response.text();
      throw new Error(`Google Sheets API returned ${response.status}: ${details.slice(0, 500)}`);
    }
    return response;
  } finally {
    clearTimeout(timeout);
  }
}

export async function appendUniqueRow(sheetName: string, submissionId: string, row: string[]) {
  const spreadsheetId = requiredEnv("GOOGLE_SHEETS_SPREADSHEET_ID");
  const escapedSheetName = sheetName.replace(/'/g, "''");
  const idRange = encodeURIComponent(`'${escapedSheetName}'!A:A`);
  const existing = await sheetsRequest(`spreadsheets/${spreadsheetId}/values/${idRange}`);
  const values = (await existing.json() as { values?: string[][] }).values || [];
  if (values.some(value => value[0] === submissionId)) return { duplicate: true };

  const appendRange = encodeURIComponent(`'${escapedSheetName}'!A:Z`);
  await sheetsRequest(
    `spreadsheets/${spreadsheetId}/values/${appendRange}:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS`,
    { method: "POST", body: JSON.stringify({ values: [row] }) },
  );
  return { duplicate: false };
}
