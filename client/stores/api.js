import { ofetch } from "ofetch";
import { useThrottleFn } from "@vueuse/core";

const postFetch = ofetch.create({ method: "POST" });

const api = {
  error: null,

  // HELPERS
  // this will just pass through the payload to the endpoint
  // another HOF on server passes that to core on server
  async postApi(endpoint, payload = {}) {
    const res = await postFetch(`/api/board/${endpoint}`, { body: payload }).catch((e) => {
      console.error(`[pat] ${endpoint} error: `, e.data);
      this.error = e.data;
    });
    return res;
  },

  // SETUP & SIGNIN
  async getSiteDetails() {
    const res = await ofetch("/api/board/site").catch((e) => {
      console.error("[pat] getSiteDetails error: ", e.data);
      this.error = e.data;
    });
    if (!res) return;
    const providers = res.data.providers;
    return {
      providers,
      schedule: res.data.schedule,
    };
  },

  async signIn(provider, schedule) {
    await this.postApi("signin", { provider, schedule });
    return;
  },

  // TIMELINE
  async undo() {
    await this.postApi("undo");
    return;
  },
};

export default api;
