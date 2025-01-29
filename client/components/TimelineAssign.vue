<script setup>
import { computed } from "vue";
import { board } from "../stores/board.js";
const props = defineProps(["event"]);

const provider = computed(() => board.value.shifts[props.event.shift]?.provider);
const supervisor = computed(() => board.value.shifts[props.event.supervisorShift]?.provider);
</script>
<template>
  <div class="flex items-center gap-4 py-2 mb-4 -ml-[22px] text-slate-500 dark:text-slate-400">
    <TimelineIcon :icon="event.patient.mode" />

    <!-- BOX -->
    <div
      class="flex items-center justify-between w-full px-4 py-2 bg-white border rounded-md dark:bg-slate-800 dark:border-slate-600 border-slate-300"
    >
      <!-- NAME & SUPER -->
      <div>
        <div class="font-mono text-xs">{{ event.time }}</div>
        <div class="text-xl font-bold">{{ provider.first }} {{ provider.last }}</div>
        <div v-if="supervisor" class="text-sm uppercase text-slate-400">
          super: {{ supervisor.first }} {{ supervisor.last }}
        </div>
      </div>
      <!-- ROOM -->
      <div class="text-xl font-bold">{{ event.patient.room }}</div>
    </div>
  </div>
</template>
