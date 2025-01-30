<script setup>
import { computed } from "vue";
import { board } from "../stores/board.js";
const props = defineProps(["event"]);

const shift = computed(() => board.value.shifts[props.event.shift]);
const supervisor = computed(() => board.value.shifts[props.event.supervisorShift]?.provider);
</script>
<template>
  <div class="flex items-center gap-4 py-2 -ml-[22px] text-slate-500 dark:text-slate-400">
    <TimelineIcon :icon="event.patient.mode" />

    <!-- BOX -->
    <div
      class="flex items-center justify-between w-full px-4 py-2 bg-white border rounded-md dark:bg-slate-800 dark:border-slate-600 border-slate-300"
    >
      <!-- NAME & MESSAGES -->
      <div>
        <div class="font-mono text-xs">{{ event.time }}</div>

        <TimelineReassignProvider :eventId="event.id" :shift="shift" />
        <div v-if="supervisor" class="text-sm text-slate-400">
          Super: {{ supervisor.first }} {{ supervisor.last }}
        </div>
        <div v-if="event.type === 'reassign'" class="text-sm text-slate-400">
          {{ event.message }}
        </div>
      </div>

      <!-- ROOM -->
      <TimelineReassignRoom :eventId="event.id" :room="event.patient.room" />
    </div>
  </div>
</template>
