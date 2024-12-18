import { Hono } from "hono";
import { jwt } from "hono/jwt";
import { streamSSE } from "hono/streaming";
import ShortUniqueId from "short-unique-id";
import { sites } from "./board.js";

const stream = new Hono();
const uid = new ShortUniqueId({ length: 6 });

const clients = {
  stmarks: [],
};

const SITE_INCLUDES_CLIENT = (site, id) => {
  return clients[site].findIndex((c) => c.id === id) !== -1;
};

export const broadcast = (site, event, data) => {
  clients[site].forEach((client) => {
    client.stream.writeSSE({
      data: `${JSON.stringify(data)}\n\n`,
      event,
    });
  });
};

stream.use("/*", jwt({ secret: process.env.JWT_SECRET, cookie: "auth" }));

stream.get("/", async (c) => {
  const site = c.get("jwtPayload").site;
  const id = uid.rnd();
  return streamSSE(c, async (stream) => {
    // add to client list for site
    clients[site].push({ id, stream });
    // remove client from list when they disconnect
    stream.onAbort(() => {
      clients[site] = clients[site].filter((c) => c.id !== id);
      console.log("client disconnected from stream: " + site);
    });

    stream.writeSSE({
      data: "client connected to " + site,
    });

    stream.writeSSE({
      data: JSON.stringify(await sites[site].getBoard()),
      event: "board",
    });

    while (SITE_INCLUDES_CLIENT(site, id)) {
      console.log(clients);
      await stream.writeSSE({
        data: ": keep-alive\n\n",
        event: "ping",
      });
      await stream.sleep(15000);
    }
  });
});

export default stream;
