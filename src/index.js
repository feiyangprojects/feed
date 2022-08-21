import { Application, Router } from "https://deno.land/x/oak@v11.0.0/mod.ts";

import { PORT } from "./utils/consts.js";

const router = new Router();
router.get("/", (ctx) => {
  ctx.response.body = "Hello world!";
});

const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());

app.addEventListener(
  "listen",
  (_) => console.log(`Listening on http://127.0.0.1:${PORT}`),
);
await app.listen({ port: PORT });
