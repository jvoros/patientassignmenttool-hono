import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import apiRoutes from "./routes/apiRoutes.js";

const app = new Hono();

app.route("/api", apiRoutes);

// VITE BUILT FILES

// paths relative to project root, not this file
// client/assets
app.use("/assets/*", serveStatic({ root: "./dist/client" }));
// client/public
app.use("/*", serveStatic({ root: "./dist/client/" }));
// client/index.html
app.use("/", serveStatic({ path: "./dist/client/index.html" }));

// START
const port = 8080;
console.log(`Server is running on http://localhost:${port}`);

serve({
  fetch: app.fetch,
  port,
});
