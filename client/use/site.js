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
    const { data, error } = await api.get("/api/board/getBoard");
    if (!data) return;
    store.board = data.data;
    console.log("[site] fetched board");
  };

  const fetchDetails = async () => {
    const { data, error } = await api.get("/api/board/getSiteDetails");
    if (!data) return;
    store.details = data.data;
    console.log("[site] fetched details");
  };

  const updateBoard = (data) => {
    data.loading = false;
    store.board = data;
  };

  const useStream = () => {
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
    fetchDetails,
    useStream,
    error: globalError,
    setError,
  };
};
