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
  // BOARD ITEMS
  const getBoardItem = (item, id) => {
    const found = store.board[item][id];
    if (!found) {
      const error = `${item} [${id}] not found`;
      console.error(error);
      throw Error(error);
    }
    return found;
  };

  const getShift = (id) => getBoardItem("shifts", id);
  const getZone = (id) => getBoardItem("zones", id);
  const getEvent = (id) => getBoardItem("events", id);

  // FETCH FROM DB
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

  // STREAM
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
    getShift,
    getZone,
    getEvent,
    fetchBoard,
    fetchDetails,
    useStream,
    error: globalError,
    setError,
  };
};
