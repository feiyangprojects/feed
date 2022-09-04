import { assertEquals } from "https://deno.land/std@0.152.0/testing/asserts.ts";

Deno.test("index", async () => {
  const response = await fetch("http://127.0.0.1:8080/");

  assertEquals(response.status, 200);
  await response.body.cancel();
});

Deno.test("apnews hub", async () => {
  const response = await fetch("http://127.0.0.1:8080/apnews/hub/world-news");

  assertEquals(response.status, 200);
  await response.body.cancel();
});

Deno.test("twitter search", async () => {
  const response = await fetch("http://127.0.0.1:8080/twitter/search/Twitter");

  assertEquals(response.status, 200);
  await response.body.cancel();
});

Deno.test("twitter user", async () => {
  //User exist.
  let response = await fetch("http://127.0.0.1:8080/twitter/user/Twitter");

  assertEquals(response.status, 200);
  await response.body.cancel();

  //User doesn't exist.
  response = await fetch(
    "http://127.0.0.1:8080/twitter/user/ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  );

  assertEquals(response.status, 500);
  await response.body.cancel();
});
