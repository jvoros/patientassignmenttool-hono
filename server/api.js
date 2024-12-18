import { Hono } from "hono";
import auth from "./auth.js";
import board from "./board.js";
import stream from "./stream.js";

const api = new Hono();

api.route("/auth", auth);

api.route("/board", board);

api.route("/stream", stream);

export default api;
