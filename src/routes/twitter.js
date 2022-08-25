import { fetchX } from "../utils/network.js";
import { Feed } from "../utils/feed.js";
import { CONTENT_TYPES, ERRORS, LIMIT } from "../utils/consts.js";

const REMOVE_NEWLINE_REGEX = /(?:\r\n|\n|\r)/gm;

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

async function search(ctx, next) {
  const url = new URL(
    "https://twitter.com/i/api/1.1/search/tweets.json",
  );
  url.searchParams.set("count", LIMIT);
  // Type `popular` produces results with s**t quality
  url.searchParams.set("result_type", "recent");
  url.searchParams.set("q", ctx.params.query);

  let response;
  try {
    await setupInit();

    response = await (await fetchX(url, INIT)).json();
  } catch (_) {
    ctx.response.body = ERRORS["FAILED_UPSTREAM"];
    ctx.response.status = 500;
    return;
  }

  const feed = new Feed({
    id: `https://twitter.com/search?q=${ctx.params.query}`,
    link: ctx.request.url.href,
    title: `Twitter - ${ctx.params.query}`,
    icon: "https://twitter.com/favicon.ico",
  });

  for (let i = 0; i < response["statuses"].length && i < LIMIT; i++) {
    const title = response["statuses"][i]["text"].replace(
      REMOVE_NEWLINE_REGEX,
      "",
    );

    feed.add({
      id: `https://twitter.com/i/status/${response["statuses"][i]["id_str"]}`,
      title: title,
      updated: new Date(response["statuses"][i]["created_at"]).toISOString(),
      author: response["statuses"][i]["user"]["text"],
      content: response["statuses"][i]["user"]["text"],
      summary: title,
    });
  }

  ctx.response.body = feed.build();
  ctx.response.headers.set("content-type", CONTENT_TYPES.ATOM);
  return;
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

  const feed = new Feed({
    id: `https://twitter.com/i/user/${response[0]["user"]["id_str"]}`,
    link: ctx.request.url.href,
    title: `Twitter - ${response[0]["user"]["name"]}`,
    author: response[0]["user"]["name"],
    icon: response[0]["user"]["profile_image_url_https"],
  });

  for (let i = 0; i < response.length && i < LIMIT; i++) {
    const title = response[i]["text"].replace(REMOVE_NEWLINE_REGEX, "");

    feed.add({
      id: `https://twitter.com/i/status/${response[i]["id_str"]}`,
      title: title,
      updated: new Date(response[i]["created_at"]).toISOString(),
      author: response[i]["user"]["text"],
      content: response[i]["text"],
      summary: title,
    });
  }

  ctx.response.body = feed.build();
  ctx.response.headers.set("content-type", CONTENT_TYPES.ATOM);
  return;
}

export { search, user };
