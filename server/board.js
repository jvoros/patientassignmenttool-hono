import { Hono } from "hono";
import { jwt } from "hono/jwt";
import { PrismaClient } from "@prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";

import Board from "./core/board.js";
import { broadcast } from "./stream.js";

const board = new Hono();
const prisma = new PrismaClient().$extends(withAccelerate());

// HELPERS
const getBoard = async (site) => {
  const data = await prisma.site.findFirst({
    where: { site },
    select: { board: true },
  });
  return data.board;
};

const getSiteDetails = async (site) => {
  const data = await prisma.site.findFirst({
    where: { site },
    select: { details: true },
  });
  return data.details;
};

const broadcastBoard = async (site) => {
  console.log(`[${site}] board broadcasted`);
  broadcast(sites[site].clients, "board", Board.hydrate(sites[site].board));
};

// SETUP SITES
export const sites = {
  stmarks: {
    board: await getBoard("stmarks"),
    details: await getSiteDetails("stmarks"),
    clients: [],
  },
};

// MIDDLEWARE
board.use("/*", jwt({ secret: process.env.JWT_SECRET, cookie: "auth" }));

// ROUTES

board.get("/getBoard", async (c) => {
  const site = c.get("jwtPayload").site;
  return c.json({ data: sites[site].board });
});

board.get("/getSiteDetails", async (c) => {
  const site = c.get("jwtPayload").site;
  return c.json({ data: sites[site].details });
});

board.post("/boardReset", async (c) => {
  const site = c.get("jwtPayload").site;
  const board = sites[site].board;
  const logs = Board.buildLogs(site, board);
  const date = board.date;

  prisma.$transaction([
    prisma.log.deleteMany({ where: { date: date, site: site } }),
    prisma.log.createMany({ data: logs }),
  ]);

  const newBoard = Board.reset(board);

  try {
    await prisma.site.update({
      where: { site },
      data: { board: newBoard },
    });
    sites[site].board = newBoard;
    broadcastBoard(site);
    return c.json({ message: "board reset" });
  } catch (error) {
    console.error(error);
    return c.json({ error: error.message });
  }
});
// PROGRAMMATIC ROUTES

// all the functions are just passed through to core Board
// same JWT and payload extraction
// same error handling
// same broadcast
// this HOF just wraps it all
const wrapWithUpdate = (fn) => async (c) => {
  const site = c.get("jwtPayload").site;
  const payload = await c.req.json();
  const newBoard = Board[fn](sites[site].board, ...Object.keys(payload).map((key) => payload[key]));
  sites[site].board = newBoard;
  broadcastBoard(site);

  try {
    await prisma.site.update({
      where: { site },
      data: { board: newBoard },
    });
    return c.json({ message: fn + " broadcasted" });
  } catch (error) {
    console.error(error);
    return c.json({ error: error.message });
  }
};

// spit out endpoint for each fn of Board
Object.keys(Board).forEach((fn) => board.post(`/${fn}`, wrapWithUpdate(fn)));

export default board;
