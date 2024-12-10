import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { serveStatic } from "@hono/node-server/serve-static";

const app = new Hono();

app.get("/api/hello", (c) => {
  return c.text("Hello World!");
});

// serve files built by vite
// assets
app.get("/assets/*", serveStatic({ root: "./dist" }));
// public
app.get("/*", serveStatic({ root: "./dist" }));
// index.html
app.get("/", serveStatic({ path: "./dist" }));

const port = 3000;
console.log(`Server is running on http://localhost:${port}`);

serve({
  fetch: app.fetch,
  port,
});
