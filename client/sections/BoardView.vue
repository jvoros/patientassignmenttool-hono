<script setup>
import { onBeforeMount, onUnmounted, onErrorCaptured, watch } from "vue";
import { toast } from "vue-sonner";
import { board, updateBoard } from "../stores/board.js";
import api from "../stores/api.js";

let stream;

watch(api.error, () => {
  toast.error("Error", { description: api.error.value.message });
});

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

onErrorCaptured((error) => {
  console.error("onErrorCapture: " + error.message);
  toast.error("Error", { description: error.message });
  return false; // stop error propagation
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
        <Zone :zone="zone">
          <template #instruction>
            <InstructionBox
              >Stroke, Trauma or Critical patients should be given to a doctor.
            </InstructionBox>
          </template>
        </Zone>
      </div>
    </template>
    <template v-slot:secondary>
      <div v-for="zone in getZoneGroup(2)">
        <Zone :zone="zone">
          <template #instruction>
            <InstructionBox>Taking ESI 4s & 5s.</InstructionBox>
          </template>
        </Zone>
      </div>
      <Zone v-if="board.zones" :zone="board.zones.off" />
    </template>
  </BoardLayout>
</template>
