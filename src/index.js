import { Application, Router } from "https://deno.land/x/oak@v11.0.0/mod.ts";

import { PORT } from "./utils/consts.js";
import { hub as apnewsHub } from "./routes/apnews.js";
import {user as twitterUser } from "./routes/twitter.js"

const router = new Router();
router.get("/", (ctx) => {
  ctx.response.body = "Hello world!";
});
router.get("/apnews/hub/:hub", apnewsHub);
router.get("/twitter/user/:user", twitterUser);

const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());

app.addEventListener(
  "listen",
  (_) => console.log(`Listening on http://127.0.0.1:${PORT}`),
);
await app.listen({ port: PORT });
