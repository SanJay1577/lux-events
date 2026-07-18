const JSON_HEADERS = {
  "Content-Type": "application/json; charset=utf-8",
  "Cache-Control": "no-store",
};

export function jsonResponse(status: number, body: Record<string, unknown>) {
  return new Response(JSON.stringify(body), { status, headers: JSON_HEADERS });
}

export async function readJson(request: Request) {
  const contentType = request.headers.get("content-type") || "";
  if (!contentType.toLowerCase().includes("application/json")) {
    throw new RequestError(415, "Content-Type must be application/json.");
  }

  const rawBody = await request.text();
  if (rawBody.length > 12_000) throw new RequestError(413, "Request is too large.");

  try {
    return JSON.parse(rawBody) as Record<string, unknown>;
  } catch {
    throw new RequestError(400, "Request body must be valid JSON.");
  }
}

export class RequestError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

export function cleanString(value: unknown, maxLength: number) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

export function handleFunctionError(error: unknown, submissionId?: string) {
  if (error instanceof RequestError) return jsonResponse(error.status, { error: error.message });
  console.error("Form submission failed", { submissionId, error });
  return jsonResponse(503, {
    error: "We could not save your details right now. Please wait a moment and try again.",
  });
}
