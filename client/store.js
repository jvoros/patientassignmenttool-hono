import { reactive } from "vue";
import { ofetch } from "ofetch";

export const store = reactive({
  loggedIn: false,
  logIn() {
    this.loggedIn = true;
  },
  logOut() {
    this.loggedIn = false;
  },
  async checkLogin() {
    ofetch("/api/verify", {
      method: "POST",
      body: { password: "7800" },
    })
      .then(() => {
        this.loggedIn = true;
      })
      .catch((e) => {
        this.loggedIn = false;
      });
  },
});
