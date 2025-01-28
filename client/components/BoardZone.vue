<script setup>
import { board } from "../stores/board.js";
const props = defineProps(["zone", "loading"]);
</script>
<template>
  <!-- ZONE SHIFTS -->
  <BoardHeader>{{ zone.name }}</BoardHeader>
  <div v-if="board.loading">Loading...</div>
  <div v-else>
    <template v-for="shiftId in zone.shifts">
      <BoardShift :shift="board.shifts[shiftId]" :zone="zone" />
    </template>
  </div>

  <!-- ROTATION CONTROLS -->
  <div v-if="zone.type.includes('rotation')" class="flex justify-between mb-2">
    <Button variant="outline"><span class="font-light">&larr; Rotation back</span></Button>
    <Button variant="outline"><span class="font-light">Rotation skip &rarr;</span></Button>
  </div>
  <div v-if="zone.type.includes('super')" class="flex justify-between">
    <Button variant="outline"><span class="font-light">&larr; Super back</span></Button>
    <Button variant="outline"><span class="font-light">Super skip &rarr;</span></Button>
  </div>
</template>
