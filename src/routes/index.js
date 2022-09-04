import { Feed } from "../utils/feed.js";
import { CONTENT_TYPES, PROJECT } from "../utils/consts.js";

function index(ctx, next) {
  const feed = new Feed({
    id: PROJECT["LINK"],
    link: ctx.request.url.href,
    title: PROJECT["NAME"],
  });

  feed.add({
    id: `${PROJECT["LINK"]}/tree/${PROJECT["VERSION"]}`,
    title: PROJECT["VERSION"],
    updated: new Date(PROJECT["VERSION"]).toISOString(),
    content: PROJECT["VERSION"],
    summary: PROJECT["VERSION"],
  });

  ctx.response.body = feed.build();
  ctx.response.headers.set("content-type", CONTENT_TYPES.ATOM);
}

export { index };
