<script setup>
import { computed, onBeforeMount, onUnmounted } from "vue";
import { board, updateBoard } from "../stores/board.js";
import api from "../stores/api.js";

let stream;

const undo = (e) => {
  e.preventDefault();
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
  <Container class="mt-4">
    <div class="sm:grid sm:grid-cols-2 sm:gap-4 md:grid-cols-10">
      <div class="p-4 rounded-sm sm:row-span-2 md:col-span-3 bg-slate-100">
        <BoardHeader>Timeline</BoardHeader>
        <ul>
          <li v-for="(eventId, index) in board.timeline">
            <small class="mr-2">{{ board.events[eventId].time }}</small>
            {{ board.events[eventId].message }}
            <Button v-if="index === 0" variant="link" @click="undo">(undo)</Button>
          </li>
        </ul>
      </div>

      <div class="p-4 md:col-span-4">
        <div v-for="zone in getZoneGroup(1)">
          <BoardZone :zone="zone" />
        </div>
      </div>

      <div class="p-4 sm:col-start-2 md:col-span-3">
        <div v-for="zone in getZoneGroup(2)">
          <BoardZone :zone="zone" />
        </div>
        <BoardZone v-if="board.zones" :zone="board.zones.off" />
      </div>
    </div>
  </Container>
</template>
