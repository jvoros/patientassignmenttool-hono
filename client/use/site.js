import { reactive, onBeforeMount, onUnmounted } from "vue";
import { useApi } from "./api.js";

const api = useApi();

const site = reactive({
  board: {
    timeline: [],
  },
  details: {},
});

export const useSite = () => {
  const fetchBoard = async () => {
    const response = await api.get("/api/board/state");
    if (!response) return;
    site.board = response.data;
    console.log("[useSite] fetched board");
  };

  const updateBoard = (data) => {
    data.loading = false;
    site.board = data;
  };

  const fetchDetails = async () => {
    const response = await api.get("/api/board/site");
    if (!response) return;
    site.details = response.data;
    console.log("[useSite] fetched details");
  };

  const withStream = () => {
    let stream;
    onBeforeMount(() => {
      stream = new EventSource("/api/stream");
      stream.onmessage = (event) => {
        console.log("[stream] message:", event.data);
      };
      stream.addEventListener("board", (event) => {
        console.log("[stream] board: new board");
        updateBoard(JSON.parse(event.data));
      });
    });

    onUnmounted(() => {
      stream.close();
    });
  };

  return {
    state: site,
    fetchBoard,
    updateBoard,
    fetchDetails,
    withStream,
  };
};
