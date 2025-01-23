<script setup>
import { board } from "../stores/board.js";
const props = defineProps(["zone", "loading"]);
</script>
<template>
  <BoardHeader>{{ zone.name }}</BoardHeader>
  <div v-if="board.loading">Loading...</div>
  <div v-else>
    <template v-for="(shiftId, index) in zone.shifts">
      <BoardShift
        :shift="board.shifts[shiftId]"
        :isSup="shiftId === zone.active.supervisor"
        :isNext="
          (zone.type.includes('rotation') && shiftId === zone.active.patient) ||
          (zone.type === 'zone_patient' && index === 0)
        "
        :zoneType="zone.type"
      />
    </template>
  </div>
</template>
