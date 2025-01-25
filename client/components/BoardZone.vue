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
        :zoneId="zone.id"
        :zoneType="zone.type"
      />
    </template>
  </div>
  <div v-if="zone.type.includes('rotation')" class="flex justify-between mb-2">
    <Button variant="outline"><span class="font-light">&larr; Rotation back</span></Button>
    <Button variant="outline"><span class="font-light">Rotation skip &rarr;</span></Button>
  </div>
  <div v-if="zone.type.includes('super')" class="flex justify-between">
    <Button variant="outline"><span class="font-light">&larr; Super back</span></Button>
    <Button variant="outline"><span class="font-light">Super skip &rarr;</span></Button>
  </div>
</template>
