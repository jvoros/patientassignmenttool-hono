import { ref } from "vue";
import { useFetch } from "./fetch.js";

const error = ref(null);

export const useApi = () => {
  const post = (endpoint, payload = {}) => baseApi(endpoint, payload, "POST");
  const get = (endpoint) => baseApi(endpoint, null, "GET");

  const baseApi = async (endpoint, payload = {}, method) => {
    const { data, error } = await useFetch(endpoint, payload, method);
    if (error) {
      console.error("[api] error:", error);
      error.value = { message: error, time: Date.now() };
    }
    return data;
  };

  return {
    error,
    post,
    get,
  };
};
