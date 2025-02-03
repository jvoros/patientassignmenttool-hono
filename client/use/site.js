import { reactive, onBeforeMount, onUnmounted, ref } from "vue";
import { useApi } from "./api.js";

const api = useApi();

const store = reactive({
  board: {
    timeline: [],
    zones: {},
    shifts: {},
    events: {},
  },
  details: {
    providers: [],
    schedule: [],
  },
});

const globalError = ref();

export const useSite = () => {
  const fetchBoard = async () => {
    const response = await api.get("/api/board/getBoard");
    if (!response) return;
    store.board = response.data;
    console.log("[useSite] fetched board");
  };

  const updateBoard = (data) => {
    data.loading = false;
    store.board = data;
  };

  const fetchDetails = async () => {
    const response = await api.get("/api/board/getSiteDetails");
    if (!response) return;
    store.details = response.data;
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

  const setError = (message) => {
    globalError.value = { message };
  };

  return {
    store,
    fetchBoard,
    updateBoard,
    fetchDetails,
    withStream,
    error: globalError,
    setError,
  };
};
