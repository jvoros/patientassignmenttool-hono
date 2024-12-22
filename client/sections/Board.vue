<script setup>
import { ref, computed } from "vue";
import api from "../stores/api.js";
import stream from "../stores/stream.js";

const { board } = stream();
const siteDetails = ref(null);

const getBoard = async () => {
  const res = await api.getBoard();
};

const getSiteDetails = async () => {
  const res = await api.getSiteDetails();
  siteDetails.value = res;
};
</script>

<template>
  <Container class="mt-4">
    <Button @click="getBoard">Get Board</Button>
    <Button @click="getSiteDetails">Get Site Details</Button>
    <h2>Board</h2>
    <div class="border rounded p-4 mt-4">
      <pre>{{ board }}</pre>
    </div>
    <h2>Site Details</h2>
    <div class="border rounded p-4 mt-4">
      <pre>{{ siteDetails }}</pre>
    </div>
  </Container>
</template>
