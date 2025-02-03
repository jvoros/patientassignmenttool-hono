import { onErrorCaptured, watch } from "vue";
import { toast } from "vue-sonner";
import { useApi } from "./api.js";
import { useSite } from "./site.js";

export const useErrorBoundary = () => {
  //catch api errors that are outside eventHandlers
  const api = useApi();
  watch(api.error, () => {
    toast.error("[api error]: " + api.error.value.message);
  });

  // watch site errors
  const site = useSite();
  watch(site.error, () => {
    toast.warning(site.error.value.message);
  });

  // catch all
  onErrorCaptured((error, vm, info) => {
    console.error("[errorBoundary]", error.message);
    console.error("[errorBoundary]", error.stack);
    console.error("[errorBoundary]", info);
    toast.error("[error captured]: " + error.message);
    return false; // stop error propagation
  });
  return;
};
