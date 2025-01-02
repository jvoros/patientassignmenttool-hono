import { ofetch } from "ofetch";

const postFetch = ofetch.create({ method: "POST" });

const api = {
  error: null,

  // SETUP & SIGNIN
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

  async signIn(provider, schedule) {
    const res = await postFetch("/api/board/signin", {
      body: { provider: provider, schedule: schedule },
    }).catch((e) => {
      console.error("[pat] signIn error: ", e.data);
      this.error = e.data;
    });
    return;
  },

  // TIMELINE
  async undo() {
    const res = await postFetch("/api/board/undo").catch((e) => {
      console.error("[pat] undo error: ", e.data);
      this.error = e.data;
    });
  },
};

export default api;
