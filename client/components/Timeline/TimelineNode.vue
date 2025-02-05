<script setup>
import { computed } from "vue";

const props = defineProps(["event"]);
const type = computed(() => (props.event.type.includes("assign") ? "assign" : "info"));
const icon = computed(() => (type.value === "assign" ? props.event.patient.mode : "event"));

const styles = {
  base: "flex gap-4 -ml-[22px]",
  info: "items-start pt-4 pb-8  text-slate-400",
  assign: "items-center py-2 text-slate-500 dark:text-slate-400",
};
const classes = computed(() => styles.base + " " + styles[type.value]);
</script>
<template>
  <div :class="classes">
    <TimelineIcon :icon="icon" />
    <div class="w-full">
      <TimelineAssign :event="props.event" v-if="type.includes('assign')" />
      <TimelineInfo :event="props.event" v-else />
    </div>
  </div>
</template>
