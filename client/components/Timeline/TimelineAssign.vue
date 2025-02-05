<script setup>
import { computed } from "vue";
import { useSite } from "&";

const props = defineProps(["event"]);
const site = useSite();

const shift = computed(() => site.getShift(props.event.shift));
const supervisor = computed(() => site.getSupervisor(props.event));
</script>
<template>
  <div
    class="flex items-center justify-between px-4 py-2 bg-white border rounded-md dark:bg-slate-800 dark:border-slate-600 border-slate-300"
  >
    <div>
      <div class="font-mono text-xs">
        {{ event.time }}
      </div>

      <TimelineProvider :eventId="event.id" :shift="shift" />

      <div v-if="supervisor" class="text-sm text-slate-400">
        Super: {{ supervisor.first }} {{ supervisor.last }}
      </div>
      <div v-if="event.type === 'reassign'" class="text-sm text-slate-400">
        {{ event.message }}
      </div>
    </div>

    <TimelineRoom :eventId="event.id" :room="event.patient.room" />
  </div>
</template>
