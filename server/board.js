import { Hono } from "hono";
import { jwt } from "hono/jwt";
import createBoardStore from "./core/index.js";
import { broadcast } from "./stream.js";

// setup
const board = new Hono();

// HELPERS
export const sites = {
  stmarks: { store: await createBoardStore("stmarks", process.env.MONGO_URI), clients: [] },
};

const broadcastBoard = async (site) => {
  const board = await sites[site].store.getBoard();
  console.log(`[${site}] board broadcasted`);
  broadcast(sites[site].clients, "board", board);
};

// MIDDLEWARE
board.use("/*", jwt({ secret: process.env.JWT_SECRET, cookie: "auth" }));

board.post("/", async (c) => {});

// ROUTES

board.get("/site", async (c) => {
  const site = c.get("jwtPayload").site;
  const res = await sites[site].store.getSiteDetails();
  return c.json({ data: res });
});

// PROGRAMMATIC ROUTES

// all the functions are just passed through to core
// same JWT and payload extraction
// same error handling
// same broadcast
// this HOF just wraps it all
const apiFn = (method) => async (c) => {
  const site = c.get("jwtPayload").site;
  const payload = await c.req.json();
  const newBoard = await sites[site].store[method](
    ...Object.keys(payload).map((key) => payload[key])
  );
  if (newBoard.error) {
    return c.json({ error: newBoard.error });
  }
  broadcastBoard(site);
  return c.text(method + " broadcasted");
};

// just list the methods for which we need endpoints
const methods = [
  "undo",
  "signIn",
  "signOut",
  "pauseShift",
  "unpauseShift",
  "changePosition",
  "switchZone",
  "joinZone",
  "leaveZone",
  "advanceRotation",
];
// spit out endpoint for each method
methods.forEach((method) => board.post(`/${method}`, apiFn(method)));

// e.g.
// board.post("/pauseShift", apiFn("pauseShift"));
// board.post("/unpauseShift", apiFn("unpauseShift"));
// board.post("/signIn", apiFn("signIn"));

// which is same as:

// board.post("/unpauseShift", async (c) => {
//   const site = c.get("jwtPayload").site;
//   const payload = await c.req.json();
//   const newBoard = await sites[site].store['unpause'](
//     ...Object.keys(payload).map((key) => payload[key])
//   );
//   if (newBoard.error) {
//     return c.json({ error: newBoard.error });
//   }
//   broadcastBoard(site);
//   return c.text("unpause" + " broadcasted");
// });

export default board;
