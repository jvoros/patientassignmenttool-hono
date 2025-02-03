import { ref } from "vue";
import { useFetch } from "./fetch.js";

const globalError = ref("no error");

export const useApi = () => {
  const post = (endpoint, payload = {}) => baseApi(endpoint, payload, "POST");
  const get = (endpoint) => baseApi(endpoint, null, "GET");

  const baseApi = async (endpoint, payload = {}, method) => {
    const { data, error } = await useFetch(endpoint, payload, method);
    if (error) {
      console.error("[api] error:", error);
      globalError.value = { message: error, time: Date.now() };
    }
    return data;
  };

  return {
    error: globalError,
    post,
    get,
  };
};
