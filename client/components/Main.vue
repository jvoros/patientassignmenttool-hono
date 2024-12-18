<script setup>
import { ref } from "vue";
import boardStore from "../stores/board.js";
import boardStream from "../stores/boardStream.js";

const { board } = boardStream();

const getBoard = async () => {
  const res = await boardStore.getBoard();
};

const getSiteDetails = async () => {
  const res = await boardStore.getSiteDetails();
};
</script>

<template>
  <Container class="mt-4">
    <Button @click="getBoard">Get Board</Button>
    <Button @click="getSiteDetails">Get Site Details</Button>
    <div class="border rounded p-4 mt-4">{{ board }}</div>
  </Container>
</template>
