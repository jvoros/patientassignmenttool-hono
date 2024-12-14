import { reactive } from "vue";
import { ofetch } from "ofetch";

export const auth = reactive({
  loggedIn: false,
  role: null,
  site: null,

  async login(code, site) {
    const user = await ofetch("/api/auth/login", {
      method: "POST",
      body: { site: site, code: code },
    }).catch((e) => {
      console.error("[pat] login error: ", e.data);
      throw new Error(e.data);
      return;
    });
    if (!user) return;
    this.role = user.role;
    this.site = user.site;
    this.loggedIn = true;
  },

  async logout() {
    const data = await ofetch("/api/auth/logout", {
      method: "POST",
    }).catch((e) => {
      console.error("[pat] logout error: ", e.data);
      return;
    });
    if (!data) return;
    console.log("[pat] logged out: ", data);
    this.loggedIn = false;
    this.role = null;
    this.site = null;
  },

  async checkLogin() {
    console.log("[pat] checkLogin");
    const data = await ofetch("/api/auth/verify", {
      method: "POST",
    }).catch((e) => {
      console.log("[pat] checkLogin error: ", e.data);
      this.loggedIn = false;
      return;
    });
    if (!data) return;
    console.log("[pat] logged in: ", data);
    this.loggedIn = true;
    this.site = data.site;
    this.role = data.role;
    return;
  },
});
