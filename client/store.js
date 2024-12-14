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
    ofetch("/api/auth/verify", {
      method: "POST",
    })
      .then(() => {
        this.loggedIn = true;
      })
      .catch((e) => {
        this.loggedIn = false;
      });
  },
});
