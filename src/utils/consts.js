const CONTENT_TYPES = {
  TEXT: "text/plain; charset=UTF-8",
  ATOM: "application/atom+xml; charset=UTF-8",
};

const PORT = parseInt(Deno.env.get("PORT")) || 8080;

const PROJECT = {
  NAME: "Serverless Feed",
  //Version should follow YYYY-MM-DD as standard
  VERSION: "2022-09-04",
  LINK: Deno.env.get("PROJECT_LINK") || "https://github.com/RmVpMVlhbmc/feed",
};

const LIMIT = parseInt(Deno.env.get("LIMIT")) || 10;

const ERRORS = {
  INVALID_REQUEST: "Error: Request is invalid.",
  FAILED_UPSTREAM: "Error: Upstream failed to send response.",
};

export { CONTENT_TYPES, ERRORS, LIMIT, PORT, PROJECT };
