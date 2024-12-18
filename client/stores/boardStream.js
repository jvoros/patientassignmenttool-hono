import { ref, onMounted, onUnmounted } from "vue";

// Vue composable, not a store
const boardStream = () => {
  // reactive board
  const board = ref({});

  // EventSource
  const source = new EventSource("/api/stream");
  source.onopen = () => console.log("[pat] stream connected");
  source.onerror = (e) => console.error("[pat][stream]", e);
  source.onclose = () => console.log("[pat][stream] closed");
  // messages to handle
  source.onmessage = (e) => console.log("[pat][stream]", e.data);
  source.addEventListener("board", (e) => {
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

export default boardStream;
