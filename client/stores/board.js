import { ref } from "vue";

export const board = ref({
  loading: true,
});
export const updateBoard = (data) => {
  data.loading = false;
  board.value = data;
};

export const details = ref({});
export const updateDetails = (data) => {
  details.value = data;
};
