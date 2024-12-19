import { Hono } from "hono";
import { jwt } from "hono/jwt";
import createBoardStore from "./core/index.js";
import { broadcast } from "./stream.js";

// setup
const board = new Hono();

const testBoard = await createBoardStore("stmarks", process.env.MONGO_URI);
// console.log("testBoard: ", await testBoard.getBoard());
// helpers
export const sites = {
  stmarks: { store: await createBoardStore("stmarks", process.env.MONGO_URI), clients: [] },
};

const broadcastBoard = async (site) => {
  broadcast(site.clients, "board", await sites[site].store.getBoard());
};

// middleware
board.use("/*", jwt({ secret: process.env.JWT_SECRET, cookie: "auth" }));

// don't need to get board
// it goes out to all clients on connect
// board.get("/", async (c) => {
//   const site = c.get("jwtPayload").site;

//   broadcastBoard(site);
//   return c.text("board broadcasted");
// });

// routes

board.get("/site", async (c) => {
  const site = c.get("jwtPayload").site;
  const res = await sites[site].store.getSiteDetails();
  return c.json({ data: res });
});

export default board;
