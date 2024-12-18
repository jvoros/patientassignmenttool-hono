import { ref, onMounted, onUnmounted } from "vue";

// Vue composable, not a store
const stream = () => {
  // reactive board
  const board = ref({});

  // EventSource
  const source = new EventSource("/api/stream");
  source.onopen = () => console.log("[stream] connected");
  source.onerror = (e) => console.error("[stream]", e);
  source.onclose = () => console.log("[stream] closed");
  // messages to handle
  source.onmessage = (e) => console.log("[stream]", e.data);
  source.addEventListener("board", (e) => {
    console.log("[stream] new board received");
    board.value = e.data;
  });

  // close the stream when the user navigates away
  onMounted(() => {
    document.addEventListener("beforeunload", source.close);
  });

  onUnmounted(() => {
    document.removeEventListener("beforeunload", source.close);
  });

  return { board };
};

export default stream;
