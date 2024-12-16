import { Hono } from "hono";
import auth from "./auth.js";
import board from "./board.js";

const api = new Hono();

api.route("/auth", auth);

api.route("/board", board);

// try {
//   authorize(event);
// } catch (error) {
//   return {
//     statusCode: 400,
//     body: JSON.stringify({ error: error.message }),
//   };
// }

// // logic
// const { mongoUri } = useRuntimeConfig(event);
// const board = await createBoardStore("stmarks", mongoUri);
// const data = await board.getBoard();
// return {
//   statusCode: 200,
//   body: JSON.stringify({ data }),
// };

export default api;
