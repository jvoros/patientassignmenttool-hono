import { Hono } from "hono";
import { jwt } from "hono/jwt";
import createBoardStore from "./core/index.js";
import { broadcast } from "./stream.js";

// setup
const board = new Hono();

// helpers
export const sites = {
  stmarks: { store: await createBoardStore("stmarks", process.env.MONGO_URI), clients: [] },
};

const broadcastBoard = async (site) => {
  const board = await sites[site].store.getBoard();
  console.log(`[${site}] board broadcasted`);
  broadcast(sites[site].clients, "board", board);
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
  console.log("site: ", site);
  const res = await sites[site].store.getSiteDetails();
  return c.json({ data: res });
});

board.post("/signin", async (c) => {
  const site = c.get("jwtPayload").site;
  const { provider, schedule } = await c.req.json();

  const newBoard = await sites[site].store.signIn(provider, schedule);

  if (newBoard.error) {
    return c.json({ error: newBoard.error });
  }

  broadcastBoard(site);
  return c.text("signin broadcasted");
});

board.post("/undo", async (c) => {
  const site = c.get("jwtPayload").site;

  const newBoard = await sites[site].store.undo();

  if (newBoard.error) {
    return c.json({ error: newBoard.error });
  }

  broadcastBoard(site);
  return c.text("undo broadcasted");
});

export default board;
