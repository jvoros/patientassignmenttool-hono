import { reactive, toRef } from "vue";
import { ofetch } from "ofetch";

// AUTH
const authState = reactive({
  role: null,
  site: null,
  id: null,
});

export const auth = {
  role: toRef(authState.role),
  site: toRef(authState.site),
  id: toRef(authState.id),

  async login(code, site) {
    const user = await ofetch("/api/auth/login", {
      method: "POST",
      body: { site: site, code: code },
    }).catch((e) => {
      console.error("[pat] login error: ", e.data);
      throw new Error(e.data);
    });
    if (!user) return;
    state.role = user.role;
    state.site = user.site;
    state.id = user.id;
  },

  async logout() {
    const data = await ofetch("/api/auth/logout", {
      method: "POST",
    }).catch((e) => {
      console.error("[pat] logout error: ", e.data);
      return;
    });
    if (!data) return;
    console.log("[pat] logout success");
    state.id = null;
    state.role = null;
    state.site = null;
  },

  async checkLogin() {
    const data = await ofetch("/api/auth/verify", {
      method: "POST",
    }).catch((e) => {
      console.error("[pat] checkLogin error: ", e.data);
      this.loggedIn = false;
      return false;
    });
    if (!data) return false;
    state.id = data.id;
    state.site = data.site;
    state.role = data.role;
    console.log(`[pat] checkLogin id [${data.id}]`);
    return true;
  },
};

// API
const post = ofetch.create({ method: "POST" });
const apiState = reactive({
  error: null,
});

export const api = {
  post: async (endpoint, payload = {}) => {
    const res = await post(`/api/board/${endpoint}`, { body: payload }).catch((e) => {
      console.error(`[api] ${endpoint} error: `, e.data);
      apiState.error = e.data;
      return { error: e.data };
    });
    if (res.error) {
      console.error("[api] error:", res.error);
      const err = { message: res.error, time: Date.now() };
      apiState.error = err;
    }
    return res;
  },
};

// BOARD
export const board = reactive({
  board: {
    loading: true,
  },
  details: {},
});

export const updateBoard = (data) => {
  data.loading = false;
  board.board = data;
};

export const boardDetails = reactive();

export const updateDetails = (data) => {
  board.details = data;
};
