<script setup>
import { ref } from "vue";
import boardStore from "../stores/board.js";

const getBoard = async () => {
  const res = await boardStore.getBoard();
};
</script>

<template>
  <Container class="mt-4">
    <Button @click="getBoard">Get Board</Button>
    <div class="border rounded p-4 mt-4">{{ boardStore.board }}</div>
  </Container>
</template>
