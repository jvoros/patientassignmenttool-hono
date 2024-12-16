import { reactive } from "vue";
import { ofetch } from "ofetch";

const boardStore = reactive({
  error: null,
  board: {},
  async getBoard() {
    const data = await ofetch("/api/board").catch((e) => {
      console.error("[pat] getBoard error: ", e.data);
      this.error = e.data;
    });
    if (!data) return;
    console.log("[pat] board received: ", data);
    this.board = data;
  },
});

export default boardStore;
