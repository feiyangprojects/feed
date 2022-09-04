import { Application, Router } from "oak";

import { PORT } from "./utils/consts.js";
import { index } from "./routes/index.js";
import { hub as apnewsHub } from "./routes/apnews.js";
import {
  search as twitterSearch,
  user as twitterUser,
} from "./routes/twitter.js";

const router = new Router();
router.get("/", index);
router.get("/apnews/hub/:hub", apnewsHub);
router.get("/twitter/search/:query", twitterSearch);
router.get("/twitter/user/:user", twitterUser);

const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());

app.addEventListener(
  "listen",
  (_) => console.log(`Listening on http://127.0.0.1:${PORT}`),
);
await app.listen({ port: PORT });
