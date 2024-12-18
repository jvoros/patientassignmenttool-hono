<script setup>
import { ref } from "vue";
import api from "../stores/api.js";
import stream from "../stores/stream.js";

const { board } = stream();

const getBoard = async () => {
  const res = await api.getBoard();
};

const getSiteDetails = async () => {
  const res = await api.getSiteDetails();
};
</script>

<template>
  <Container class="mt-4">
    <Button @click="getBoard">Get Board</Button>
    <Button @click="getSiteDetails">Get Site Details</Button>
    <div class="border rounded p-4 mt-4">{{ board }}</div>
  </Container>
</template>
