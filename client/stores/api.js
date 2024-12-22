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
    const providers = res.data.providers.sort((a, b) => a.last.localeCompare(b.last));
    return {
      providers,
      schedule: res.data.schedule,
    };
  },

  async getBoard() {
    await ofetch("/api/board").catch((e) => {
      console.error("[pat] getBoard error: ", e.data);
      this.error = e.data;
    });
    return;
  },

  async signIn(provider, schedule) {
    const res = await ofetch("/api/board/signin", {
      method: "POST",
      body: { provider: provider, schedule: schedule },
    }).catch((e) => {
      console.error("[pat] signIn error: ", e.data);
      this.error = e.data;
    });
    return;
  },
});

export default api;
