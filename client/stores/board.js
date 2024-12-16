import { reactive } from "vue";
import { ofetch } from "ofetch";

const boardStore = reactive({
  error: null,
  board: {},
  details: {},
  async getSiteDetails() {
    const data = await ofetch("/api/board/site").catch((e) => {
      console.error("[pat] getSiteDetails error: ", e.data);
      this.error = e.data;
    });
    if (!data) return;
    console.log("[pat] site details received: ", data);
    this.details = data;
  },
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
