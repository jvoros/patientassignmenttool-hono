import { Hono } from "hono";
import { jwt } from "hono/jwt";
import createBoardStore from "./core/index.js";

const board = new Hono();

board.use("/*", jwt({ secret: process.env.JWT_SECRET, cookie: "auth" }));

board.get("/", async (c) => {
  const board = await createBoardStore("stmarks", process.env.MONGO_URI);
  const data = await board.getBoard();
  return c.json({ data });
});

export default board;
