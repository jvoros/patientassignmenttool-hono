<script setup>
import { onBeforeMount, onUnmounted } from "vue";
import { board, updateBoard } from "../stores/board.js";
import api from "../stores/api.js";

let stream;

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
      <Timeline />
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
