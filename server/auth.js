import { Hono } from "hono";
import { sign, verify } from "hono/jwt";
import { getCookie, setCookie, deleteCookie } from "hono/cookie";

const auth = new Hono();

// auth routes
auth.post("/login", async (c) => {
  console.log("login route");
  const { site, code } = await c.req.json();
  console.log(site, code);

  if (code && code.toString() === process.env.ACCESS_TOKEN?.toString()) {
    const payload = {
      role: "user",
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24,
    };
    const token = await sign(payload, process.env.JWT_SECRET);
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

auth.post("/logout", async (c) => {
  deleteCookie(c, "auth");
  return c.text("Logged out");
});

auth.post("/verify", async (c) => {
  const token = getCookie(c, "auth");
  if (token) {
    try {
      const payload = await verify(token, process.env.JWT_SECRET);
      return c.text("Valid token");
    } catch {
      return c.text("Invalid token", 400);
    }
  } else {
    return c.text("No token", 400);
  }
});

export default auth;
