import { appendUniqueRow } from "../lib/googleSheets";
import { cleanString, handleFunctionError, jsonResponse, readJson, RequestError } from "../lib/http";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_PATTERN = /^\+?[0-9\s().-]{7,20}$/;
const SUBMISSION_ID_PATTERN = /^[0-9a-f-]{36}$/i;

export const config = {
  path: "/.netlify/functions/contact",
  rateLimit: { windowLimit: 10, windowSize: 60, aggregateBy: ["ip", "domain"] },
};

export default async (request: Request) => {
  if (request.method !== "POST") return jsonResponse(405, { error: "Method not allowed." });

  let submissionId = "";
  try {
    const body = await readJson(request);
    submissionId = cleanString(body.submissionId, 36);
    if (!SUBMISSION_ID_PATTERN.test(submissionId)) throw new RequestError(400, "Invalid submission identifier.");
    if (cleanString(body.website, 200)) return jsonResponse(200, { ok: true });

    const name = cleanString(body.name, 100);
    const email = cleanString(body.email, 254).toLowerCase();
    const phone = cleanString(body.phone, 20);
    if (name.length < 2 || !/[\p{L}]/u.test(name)) throw new RequestError(400, "Please enter a valid full name.");
    if (!EMAIL_PATTERN.test(email)) throw new RequestError(400, "Please enter a valid email address.");
    if (!PHONE_PATTERN.test(phone) || phone.replace(/\D/g, "").length < 7) {
      throw new RequestError(400, "Please enter a valid phone number.");
    }

    const result = await appendUniqueRow(
      process.env.CONTACT_SHEET_NAME?.trim() || "Contact Form",
      submissionId,
      [
        submissionId,
        new Date().toISOString(),
        name,
        email,
        phone,
        cleanString(body.company, 100),
        cleanString(body.org, 100),
        cleanString(body.subject, 150),
        cleanString(body.message, 3000),
      ],
    );
    return jsonResponse(200, { ok: true, duplicate: result.duplicate });
  } catch (error) {
    return handleFunctionError(error, submissionId);
  }
};
