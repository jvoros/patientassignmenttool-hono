<script setup>
import { computed, onBeforeMount, onUnmounted } from "vue";
import { useThrottleFn } from "@vueuse/core";
import { board, updateBoard } from "../stores/board.js";
import api from "../stores/api.js";

let stream;

// const undo = useThrottleFn(() => {
//   api.undo();
// }, 3000);

const undo = () => {
  api.undo();
};

const getZoneGroup = (group) => {
  if (board.value.zones) {
    const filteredZones = Object.values(board.value.zones).filter(
      (zone) => zone.order >= group * 10 && zone.order < group * 10 + 10
    );
    const zones = [];
    filteredZones.forEach((zone) => zones.push(zone));
    return zones.sort((a, b) => a.order - b.order);
  }
  return;
};

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
  <Nav />
  <BoardLayout>
    <template v-slot:timeline>
      <BoardHeader>Timeline</BoardHeader>
      <ul>
        <li v-for="(eventId, index) in board.timeline">
          <small class="mr-2">{{ board.events[eventId].time }}</small>
          {{ board.events[eventId].message }}
          <Button v-if="index === 0" variant="link" @click="undo">(undo)</Button>
        </li>
      </ul>
    </template>
    <template v-slot:main>
      <div v-for="zone in getZoneGroup(1)">
        <BoardZone :zone="zone" />
      </div>
    </template>
    <template v-slot:secondary>
      <div v-for="zone in getZoneGroup(2)">
        <BoardZone :zone="zone" />
      </div>
      <BoardZone v-if="board.zones" :zone="board.zones.off" />
    </template>
  </BoardLayout>
</template>
