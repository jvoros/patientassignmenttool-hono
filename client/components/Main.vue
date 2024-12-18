<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import boardStore from "../stores/board.js";

const data = ref(" ");

const getBoard = async () => {
  const res = await boardStore.getBoard();
};

const getSiteDetails = async () => {
  const res = await boardStore.getSiteDetails();
};

const source = new EventSource("/api/stream");
source.onopen = () => console.log("[pat] stream connected");
source.onmessage = (e) => console.log("[pat][stream]", e.data);
source.addEventListener("board", (e) => {
  console.log(e.data);
  data.value = e.data;
});
source.onerror = (e) => {
  console.log("error from source");
  console.error(e);
};
source.onclose = () => console.log("SSE closed");

document.addEventListener("beforeunload", () => {
  source.close();
});
</script>

<template>
  <Container class="mt-4">
    <Button @click="getBoard">Get Board</Button>
    <Button @click="getSiteDetails">Get Site Details</Button>
    <div class="border rounded p-4 mt-4">{{ data }}</div>
  </Container>
</template>
