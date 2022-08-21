const CONTENT_TYPES = {
  TEXT: "text/plain; charset=UTF-8",
  ATOM: "application/atom+xml; charset=UTF-8",
};
const PORT = parseInt(Deno.env.get("PORT")) || 8080;

const LIMIT = parseInt(Deno.env.get("LIMIT")) || 10;

const ERRORS = {
  INVALID_REQUEST: "Error: Request is invalid.",
  FAILED_UPSTREAM: "Error: Upstream failed to send response.",
};
export { CONTENT_TYPES, ERRORS, LIMIT, PORT };
