<script setup>
import { useSite } from "../use/site.js";
import { useErrorBoundary } from "../use/errorBoundary.js";

const site = useSite();
const board = site.board;

const getZoneGroup = (group) => {
  if (board.value?.zones) {
    const filteredZones = Object.values(board.value?.zones).filter(
      (zone) => zone.order >= group * 10 && zone.order < group * 10 + 10
    );
    const zones = [];
    filteredZones.forEach((zone) => zones.push(zone));
    return zones.sort((a, b) => a.order - b.order);
  }
  return;
};

site.fetchBoard();
site.fetchDetails();
site.withStream();
useErrorBoundary();
</script>

<template>
  <Nav />
  <BoardLayout>
    <template v-slot:timeline>
      <BoardHeader>Timeline</BoardHeader>
      <Timeline />
    </template>
    <template v-slot:main>
      <!-- <div v-for="zone in getZoneGroup(1)">
        <Zone :zone="zone">
          <template #instruction>
            <InstructionBox
              >Stroke, Trauma or Critical patients should be given to a doctor.
            </InstructionBox>
          </template>
        </Zone>
      </div> -->
    </template>
    <template v-slot:secondary>
      <!-- <div v-for="zone in getZoneGroup(2)">
        <Zone :zone="zone">
          <template #instruction>
            <InstructionBox>Taking ESI 4s & 5s.</InstructionBox>
          </template>
        </Zone>
      </div> -->
      <!-- <Zone v-if="board?.value.zones" :zone="board.value.zones.off" /> -->
    </template>
  </BoardLayout>
</template>
