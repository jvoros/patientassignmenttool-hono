import { onErrorCaptured, watch } from "vue";
import { toast } from "vue-sonner";
import { useApi } from "./api.js";

export const useErrorBoundary = () => {
  //catch api errors that are outside eventHandlers
  const api = useApi();
  watch(api.error, () => {
    toast.error("Error", { description: apiError.value.message });
  });

  // catch all
  onErrorCaptured((error, vm, info) => {
    console.error("[errorBoundary]", error.message);
    console.error("[errorBoundary]", error.stack);
    console.error("[errorBoundary]", info);
    toast.error("Error: " + error.message);
    return false; // stop error propagation
  });
  return;
};
