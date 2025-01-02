<script setup>
import { ref, onBeforeMount, onUnmounted } from "vue";
import { board, updateBoard } from "../stores/board.js";
import api from "../stores/api.js";

let stream;

onBeforeMount(() => {
  stream = new EventSource("/api/stream");
  stream.onmessage = (event) => {
    console.log("[stream] message:", event.data);
  };
  stream.addEventListener("board", (event) => {
    console.log("[stream] board: new board");
    updateBoard(JSON.parse(event.data));
  });
});

onUnmounted(() => {
  stream.close();
});
</script>

<template>
  <Container class="mt-4">
    <h2>Timeline</h2>
    <ul>
      <li v-for="(eventId, index) in board.timeline">
        <small class="mr-2">{{ board.events[eventId].time }}</small>
        {{ board.events[eventId].message }}
        <Button v-if="index === 0" variant="link" @click="api.undo">(undo)</Button>
      </li>
    </ul>

    <h2>Zones</h2>
    <h3>Main</h3>
    <div v-if="board.loading">Loading...</div>
    <div v-else>
      <ul>
        <li v-for="shiftId in board.zones.main.shifts">
          <small class="mr-2">{{ board.shifts[shiftId].name }}</small>
          {{ board.shifts[shiftId].provider.last }}
        </li>
      </ul>
    </div>
  </Container>
</template>
