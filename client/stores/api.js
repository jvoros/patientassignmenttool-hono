import { ref } from "vue";
import { ofetch } from "ofetch";
import { updateDetails } from "./board.js";

const postFetch = ofetch.create({ method: "POST" });

const api = {
  error: ref(),
  // HELPERS
  // this will just pass through the payload to the endpoint
  // another HOF on server passes that to core on server
  // easy to use this generic api call from within components
  async postApi(endpoint, payload = {}) {
    const res = await postFetch(`/api/board/${endpoint}`, { body: payload }).catch((e) => {
      console.error(`[api] ${endpoint} error: `, e.data);
      this.error.value = e.data;
      return { error: e.data };
    });
    if (res.error) {
      console.error("[api] error:", res.error);
      const err = { message: res.error, time: Date.now() };
      this.error.value = err;
    }
    return res;
  },

  // SETUP & SIGNIN
  async getSiteDetails() {
    const res = await ofetch("/api/board/site").catch((e) => {
      console.error("[api] getSiteDetails error: ", e.data);
      this.error = e.data;
    });
    if (!res) return;
    updateDetails(res.data);
    return {
      providers: res.data.providers,
      schedule: res.data.schedule,
    };
  },
};

export default api;
