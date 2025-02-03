<script setup>
const props = defineProps(["event"]);
</script>
<template>
  <div class="flex items-start gap-4 pt-4 pb-8 -ml-[22px] text-slate-400">
    <TimelineIcon icon="event" />
    <div>
      <div class="font-mono text-xs">{{ event.time }}</div>
      <div class="font-mono text-xs">{{ event.message }}</div>
    </div>
  </div>
</template>
