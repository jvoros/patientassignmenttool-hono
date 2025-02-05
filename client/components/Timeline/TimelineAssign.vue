<script setup>
const props = defineProps(["event"]);
</script>
<template>
  <div
    class="flex items-center justify-between px-4 py-2 bg-white border rounded-md dark:bg-slate-800 dark:border-slate-600 border-slate-300"
  >
    <div>
      <div class="font-mono text-xs">
        {{ event.time }}
      </div>

      <TimelineProvider :event="event" />

      <div v-if="event.supervisorShift" class="text-sm text-slate-400">
        Super: {{ event.supervisorShift.provider.first }} {{ event.supervisorShift.provider.last }}
      </div>
      <div v-if="event.type === 'reassign'" class="text-sm text-slate-400">
        {{ event.message }}
      </div>
    </div>

    <TimelineRoom :event="event" />
  </div>
</template>
