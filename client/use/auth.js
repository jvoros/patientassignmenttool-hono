import { reactive } from "vue";
import { useApi } from "./api.js";

const api = useApi();

const state = reactive({
  role: null,
  site: null,
  id: null,
});

export const useAuth = () => {
  const setState = (data) => {
    state.role = data.role;
    state.site = data.site;
    state.id = data.id;
  };

  const login = async (code, site) => {
    const data = await api.post("api/auth/login", { site: site, code: code });
    if (!data) return;
    console.log("[auth] login success");
    setState(data);
  };

  const logout = async () => {
    const data = await api.post("api/auth/logout");
    if (!data) return;
    console.log("[auth] logout success");
    state.role = null;
    state.id = null;
    state.site = null;
  };

  const checkLogin = async () => {
    const data = await api.post("api/auth/checkLogin");
    if (!data) return false;
    console.log("[auth] checkLogin success.");
    setState(data);
    return true;
  };

  return {
    details: state,
    login,
    logout,
    checkLogin,
  };
};
