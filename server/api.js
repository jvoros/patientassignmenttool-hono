import { Hono } from "hono";
import auth from "./auth.js";

const api = new Hono();

api.route("/auth", auth);

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
