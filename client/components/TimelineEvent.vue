<script setup>
import { Info } from "lucide-vue-next";
const props = defineProps(["event"]);
</script>
<template>
  <div class="flex items-start gap-4 py-2 mb-4 -ml-[22px] text-slate-400">
    <TimelineIcon icon="event" />
    <div>
      <div class="font-mono text-xs">{{ event.time }}</div>
      <div class="font-mono text-xs">{{ event.message }}</div>
    </div>
  </div>
</template>
