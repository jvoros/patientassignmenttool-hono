import { Hono } from "hono";
import { jwt } from "hono/jwt";
import createBoardStore from "./core/index.js";
import { broadcast } from "./stream.js";

const board = new Hono();

export const sites = {
  stmarks: await createBoardStore("stmarks", process.env.MONGO_URI),
};

const broadcastBoard = async (site) => {
  broadcast(site, "board", await sites[site].getBoard());
};

board.use("/*", jwt({ secret: process.env.JWT_SECRET, cookie: "auth" }));

board.get("/", async (c) => {
  const site = c.get("jwtPayload").site;
  broadcastBoard(site);
  return c.text("board broadcasted");
});

board.get("/site", async (c) => {
  const site = c.get("jwtPayload").site;
  const res = await sites[site].getSiteDetails();
  return c.json({ data: res });
});

export default board;
