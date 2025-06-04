import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import { Server } from "socket.io";
import apiRoutes from "./routes/apiRoutes.js";

// START SERVER
const app = new Hono();
const port = 8080;
const httpServer = serve({
  fetch: app.fetch,
  port,
});
console.log(`Server is running on http://localhost:${port}`);

// ADD WEBSOCKETS
export const io = new Server(httpServer);

io.on("connection", (socket) => {
  console.log("[socket] id:", socket.id);
  io.emit("connection", "connected with ID: " + socket.id);

  socket.on("room", (value) => {
    socket.join(value);
    console.log(`[socket](id: ${socket.id}) joined room ${value}`);
    io.to(value).emit("message", `joined room: ${value}`);
  });
});

// ROUTES
app.use(async (c, next) => {
  c.set("io", io);
  await next();
});
app.route("/api", apiRoutes);

// VITE routes

// paths relative to project root, not this file
// client/assets
app.use("/assets/*", serveStatic({ root: "./dist/client" }));
// client/public
app.use("/*", serveStatic({ root: "./dist/client/" }));
// client/index.html
app.use("/", serveStatic({ path: "./dist/client/index.html" }));
