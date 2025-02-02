<script setup>
import { board } from "../stores/board.js";
import api from "../stores/api.js";
const props = defineProps(["zone", "loading"]);
const advanceRotation = (which, dir) => {
  api.postApi("advanceRotation", { zoneId: props.zone.id, whichActive: which, direction: dir });
};
</script>
<template>
  <!-- ZONE SHIFTS -->
  <BoardHeader>{{ zone.name }}</BoardHeader>
  <slot name="instruction" />
  <div v-if="board.loading">Loading...</div>
  <InstructionBox variant="blank" v-else-if="zone.shifts.length === 0">
    No shifts in zone.
  </InstructionBox>
  <div v-else>
    <template v-for="shiftId in zone.shifts">
      <Shift :shift="board.shifts[shiftId]" :zone="zone" />
    </template>
  </div>

  <!-- ROTATION CONTROLS -->
  <div v-if="zone.type.includes('rotation')" class="flex justify-between mb-2">
    <Button variant="outline" @click="advanceRotation('patient', -1)">&larr; Rotation back</Button>
    <Button variant="outline" @click="advanceRotation('patient', 1)">Rotation skip &rarr;</Button>
  </div>
  <div v-if="zone.type.includes('super')" class="flex justify-between">
    <Button variant="outline" @click="advanceRotation('supervisor', -1)">&larr; Super back</Button>
    <Button variant="outline" @click="advanceRotation('supervisor', 1)">Super skip &rarr;</Button>
  </div>
</template>
