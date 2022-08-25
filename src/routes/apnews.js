import { fetchX } from "../utils/network.js";
import { Feed } from "../utils/feed.js";
import { CONTENT_TYPES, ERRORS, LIMIT } from "../utils/consts.js";

const HUB_NAME_REGEX = /^[0-9a-z-]+$/;

async function hub(ctx, next) {
  let response;
  if (ctx.params.hub.match(HUB_NAME_REGEX) !== null) {
    try {
      response = await (await fetchX(
        `https://storage.googleapis.com/afs-prod/feeds/${ctx.params.hub}.json.gz`,
      )).json();
    } catch (_) {
      ctx.response.body = ERRORS["FAILED_UPSTREAM"];
      ctx.response.status = 500;
      return;
    }

    const feed = new Feed({
      id: `https://apnews.com/hub/${ctx.params.hub}`,
      link: ctx.request.url.href,
      title: `AP News - ${response["tagObjs"][0]["name"]}`,
      icon: "https://apnews.com/favicon.ico",
    });

    let author;
    for (let i = 0; i < response["cards"].length && i < LIMIT; i++) {
      if (response["cards"][i]["cardType"] === "Wire Story") {
        if (response["cards"][i]["contents"][0]["bylines"] !== null) {
          author = response["cards"][i]["contents"][0]["bylines"].substr(3);
        } else {
          author = "AP News";
        }

        feed.add({
          id: `https://apnews.com/article/${
            response["cards"][i]["contents"][0]["canonicalUrl"]
          }-${response["cards"][i]["contents"][0]["shortId"]}`,
          title: response["cards"][i]["contents"][0]["headline"],
          updated: new Date(response["cards"][i]["contents"][0]["published"])
            .toISOString(),
          author: author,
          content: response["cards"][i]["contents"][0]["storyHTML"],
          summary: response["cards"][i]["contents"][0]["firstWords"],
        });
      }
    }

    ctx.response.body = feed.build();
    ctx.response.headers.set("content-type", CONTENT_TYPES.ATOM);
    return;
  } else {
    ctx.response.body = ERRORS["INVALID_REQUEST"];
    ctx.response.status = 400;
    return;
  }
}

export { hub };
