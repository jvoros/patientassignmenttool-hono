import { Hono } from "hono";
import { jwt } from "hono/jwt";
import createBoardStore from "./core/index.js";

const board = new Hono();
const smh = await createBoardStore("stmarks", process.env.MONGO_URI);

const sites = {
  stmarks: await createBoardStore("stmarks", process.env.MONGO_URI),
};

board.use("/*", jwt({ secret: process.env.JWT_SECRET, cookie: "auth" }));

board.get("/", async (c) => {
  const site = c.get("jwtPayload").site;
  console.log("site:", site);
  const data = await sites[site].getBoard();
  return c.json({ data });
});

board.get("/site", async (c) => {
  const site = c.get("jwtPayload").site;
  const data = await smh.getSiteDetails(site);
  return c.json({ data });
});

export default board;
