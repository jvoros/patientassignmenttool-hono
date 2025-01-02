<script setup>
import { board } from "../stores/board.js";

const props = defineProps({
  zone: { type: String, required: true },
});
</script>
<template>
  <h2>Shifts</h2>
  <ul>
    <li v-for="shiftId in board[zone].shifts">
      <strong>{{ board.shifts[shiftId].name }}</strong>
      <!-- <small>{{ shift.provider.last }}, {{ shift.provider.first }}</small> -->
    </li>
  </ul>
</template>
