import { Hono } from "hono";
import auth from "./authRoutes.js";
import board from "./boardRoutes.js";

const api = new Hono();

api.route("/auth", auth);

api.route("/board", board);

export default api;
