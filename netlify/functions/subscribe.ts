import { appendUniqueRow } from "../lib/googleSheets";
import { cleanString, handleFunctionError, jsonResponse, readJson, RequestError } from "../lib/http";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const SUBMISSION_ID_PATTERN = /^[0-9a-f-]{36}$/i;

export const config = {
  path: "/.netlify/functions/subscribe",
  rateLimit: { windowLimit: 20, windowSize: 60, aggregateBy: ["ip", "domain"] },
};

export default async (request: Request) => {
  if (request.method !== "POST") return jsonResponse(405, { error: "Method not allowed." });

  let submissionId = "";
  try {
    const body = await readJson(request);
    submissionId = cleanString(body.submissionId, 36);
    if (!SUBMISSION_ID_PATTERN.test(submissionId)) throw new RequestError(400, "Invalid submission identifier.");
    if (cleanString(body.website, 200)) return jsonResponse(200, { ok: true });

    const email = cleanString(body.email, 254).toLowerCase();
    if (!EMAIL_PATTERN.test(email)) throw new RequestError(400, "Please enter a valid email address.");

    const result = await appendUniqueRow(
      process.env.NEWSLETTER_SHEET_NAME?.trim() || "Newsletter",
      submissionId,
      [submissionId, new Date().toISOString(), email, cleanString(body.source, 50)],
    );
    return jsonResponse(200, { ok: true, duplicate: result.duplicate });
  } catch (error) {
    return handleFunctionError(error, submissionId);
  }
};
