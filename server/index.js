import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import api from "./api.js";

const app = new Hono();

app.get("/api/hello", (c) => {
  return c.text(process.env.JWT_SECRET);
});

app.route("/api", api);

// serve files built by vite
// paths relative to project root, not this file

// client/assets
app.get("/assets/*", serveStatic({ root: "./dist/client" }));
// client/public
app.get("/*", serveStatic({ root: "./dist/client" }));
// client/index.html
app.get("/", serveStatic({ path: "./dist/client" }));

// start server
const port = 3000;
console.log(`Server is running on http://localhost:${port}`);

serve({
  fetch: app.fetch,
  port,
});
