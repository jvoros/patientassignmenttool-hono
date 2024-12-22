import { Hono } from "hono";
import { jwt } from "hono/jwt";
import { streamSSE } from "hono/streaming";
import { sites } from "./board.js";

// setup
const stream = new Hono();

// helpers
const SITE_INCLUDES_CLIENT = (site, id) => {
  return sites[site].clients.findIndex((c) => c.id === id) !== -1;
};

export const broadcast = (clients, event, data) => {
  console.log("broadcasting...");
  clients.forEach((client) => {
    client.stream.writeSSE({
      data: `${JSON.stringify(data)}\n\n`,
      event,
    });
  });
};

// middleware
stream.use("/*", jwt({ secret: process.env.JWT_SECRET, cookie: "auth" }));

// routes
stream.get("/", async (c) => {
  const { site, id } = c.get("jwtPayload");
  const clients = sites[site].clients;
  return streamSSE(c, async (stream) => {
    // add to client list for site if not already there
    if (!SITE_INCLUDES_CLIENT(site, id)) clients.push({ id, stream });
    console.log(`Client [${id}] connected to stream [${site} - total clients: ${clients.length}]`);

    // remove client from list when they disconnect
    stream.onAbort(() => {
      sites[site].clients = clients.filter((c) => c.id !== id);
      console.log(
        `Client [${id}] disconnected from stream [${site} - total clients: ${clients.length}]`
      );
    });

    stream.writeSSE({
      data: `connected to site stream [${site}] with id [${id}]`,
    });

    stream.writeSSE({
      data: JSON.stringify(await sites[site].store.getBoard(), null, 2),
      event: "board",
    });

    while (SITE_INCLUDES_CLIENT(site, id)) {
      //console.log(clients);
      await stream.writeSSE({
        data: ": keep-alive\n\n",
        event: "ping",
      });
      await stream.sleep(15000);
    }
  });
});

export default stream;
