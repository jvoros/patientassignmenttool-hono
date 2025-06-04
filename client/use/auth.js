import { ref, reactive } from "vue";
import { useApi } from "./api.js";
import { socket } from "./socket.js";

const api = useApi();

const details = reactive({
  role: null,
  site: null,
  id: null,
});

const authError = ref();

export const useAuth = () => {
  const setState = (data) => {
    details.role = data.role;
    details.site = data.site;
    details.id = data.id;
  };

  const login = async (code, site) => {
    const { data, error } = await api.post("api/auth/login", { site: site, code: code });
    if (error) {
      authError.value = error;
    }
    if (!data) return;
    setState(data);
    authError.value = null;
    socket.emit("room", details.site);
    console.log("[auth] login success");
  };

  const logout = async () => {
    const { data } = await api.post("api/auth/logout");
    if (!data) return;
    console.log("[auth] logout success");
    details.role = null;
    details.id = null;
    details.site = null;
  };

  const checkLogin = async () => {
    const { data } = await api.post("api/auth/checkLogin");
    if (!data) return false;
    setState(data);
    socket.emit("room", details.site);
    console.log("[auth] checkLogin success.");
    return true;
  };

  return {
    details,
    error: authError,
    login,
    logout,
    checkLogin,
  };
};
