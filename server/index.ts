import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { serveStatic } from "@hono/node-server/serve-static";
import { decode, sign, verify } from "hono/jwt";
import { getCookie, getSignedCookie, setCookie, setSignedCookie, deleteCookie } from "hono/cookie";
import { cors } from "hono/cors";

const app = new Hono();

app.get("/api/hello", (c) => {
  return c.text(process.env.JWT_SECRET!);
});

// auth routes
app.post("/api/login", async (c) => {
  console.log("login route");
  const { password } = await c.req.json();

  if (password && password.toString() === process.env.ACCESS_TOKEN?.toString()) {
    const payload = {
      role: "user",
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24,
    };
    const token = await sign(payload, process.env.JWT_SECRET!);
    setCookie(c, "auth", token, {
      httpOnly: true,
      sameSite: "Lax",
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });
    return c.text("Logged in");
  } else {
    console.log("login route fail path");
    return c.text("Invalid access code", 401);
  }
});

app.post("/api/logout", async (c) => {
  deleteCookie(c, "auth");
  return c.text("Logged out");
});

app.post("/api/verify", async (c) => {
  const token = getCookie(c, "auth");
  if (token) {
    try {
      const payload = await verify(token, process.env.JWT_SECRET!);
      return c.text("Valid token");
    } catch {
      return c.text("Invalid token", 400);
    }
  } else {
    return c.text("No token", 400);
  }
});

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
