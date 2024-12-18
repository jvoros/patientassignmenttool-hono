import { reactive } from "vue";
import { ofetch } from "ofetch";

const api = reactive({
  error: null,

  async getSiteDetails() {
    const res = await ofetch("/api/board/site").catch((e) => {
      console.error("[pat] getSiteDetails error: ", e.data);
      this.error = e.data;
    });
    if (!res) return;
    return res.data;
  },
  async getBoard() {
    await ofetch("/api/board").catch((e) => {
      console.error("[pat] getBoard error: ", e.data);
      this.error = e.data;
    });
    return;
  },
});

export default api;
