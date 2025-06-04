import { reactive } from "vue";
import io from "socket.io-client";

export const state = reactive({
  connected: false,
});

export const socket = io();

socket.on("connection", (msg) => {
  state.connected = true;
  console.log("[socket][connection]", msg);
});

socket.on("disconnect", () => {
  state.connected = false;
});

socket.on("message", (msg) => {
  console.log("[socket][message]", msg);
});
