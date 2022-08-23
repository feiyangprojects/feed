import { fetchX } from "../utils/network.js";
import { add, create, parse } from "../utils/feed.js";
import { CONTENT_TYPES, ERRORS, LIMIT } from "../utils/consts.js";

const INIT = {
  headers: {
    authorization:
      "Bearer AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs%3D1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA",
  },
};

async function setupInit() {
  INIT["method"] = "POST";
  INIT["headers"]["x-guest-token"] = (await (await fetchX(
    "https://api.twitter.com/1.1/guest/activate.json",
    INIT,
  )).json())["guest_token"];

  delete INIT["method"];
}

async function user(ctx, next) {
  const url = new URL(
    "https://twitter.com/i/api/1.1/statuses/user_timeline.json",
  );
  url.searchParams.set("count", LIMIT);
  url.searchParams.set("screen_name", ctx.params.user);

  let response;
  try {
    await setupInit();

    response = await (await fetchX(url, INIT)).json();
  } catch (_) {
    ctx.response.body = ERRORS["FAILED_UPSTREAM"];
    ctx.response.status = 500;
    return;
  }

  const feed = create(
    `https://twitter.com/i/user/${response[0]["user"]["id_str"]}`,
    `Twitter - ${response[0]["user"]["name"]}`,
    response[0]["user"]["name"],
    response[0]["user"]["profile_image_url_https"],
  );

  for (let i = 0; i < response.length && i < LIMIT; i++) {
    const title = response[i]["text"].replace(/(?:\r\n|\n|\r)/gm, "");
    add(
      feed,
      `https://twitter.com/i/status/${response[i]["id_str"]}`,
      title,
      new Date(response[i]["created_at"]).toISOString(),
      response[i]["user"]["text"],
      response[i]["text"],
      title,
    );
  }

  ctx.response.body = parse(feed);
  ctx.response.headers.set("content-type", CONTENT_TYPES.ATOM);
  return;
}

export { user };
