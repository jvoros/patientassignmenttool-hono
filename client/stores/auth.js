import { reactive } from "vue";
import { ofetch } from "ofetch";

const auth = reactive({
  role: null,
  site: null,
  id: null,

  async login(code, site) {
    const user = await ofetch("/api/auth/login", {
      method: "POST",
      body: { site: site, code: code },
    }).catch((e) => {
      console.error("[pat] login error: ", e.data);
      throw new Error(e.data);
    });
    if (!user) return;
    this.role = user.role;
    this.site = user.site;
    this.id = user.id;
  },

  async logout() {
    const data = await ofetch("/api/auth/logout", {
      method: "POST",
    }).catch((e) => {
      console.error("[pat] logout error: ", e.data);
      return;
    });
    if (!data) return;
    this.id = null;
    this.role = null;
    this.site = null;
  },

  async checkLogin() {
    const data = await ofetch("/api/auth/verify", {
      method: "POST",
    }).catch((e) => {
      console.error("[pat] checkLogin error: ", e.data);
      this.loggedIn = false;
      return;
    });
    if (!data) return;
    this.id = data.id;
    this.site = data.site;
    this.role = data.role;
    console.log(`[pat] checkLogin id [${data.id}]`);
    return;
  },
});

export default auth;
