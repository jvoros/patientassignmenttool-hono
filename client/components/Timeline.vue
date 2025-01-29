<script setup>
import { computed } from "vue";
import { board } from "../stores/board.js";
import api from "../stores/api.js";
import { Undo2 } from "lucide-vue-next";

const events = computed(() => {
  return board.value.timeline.map((eventId) => board.value.events[eventId]);
});

const undo = () => {
  api.postApi("undo");
};
</script>
<template>
  <div
    v-for="(event, index) in events"
    class="pl-2 ml-3 border-l-2 border-slate-200 dark:border-slate-700"
  >
    <TimelineEvent :event="event" v-if="event.type !== 'assign'" />
    <TimelineAssign v-if="event.type === 'assign'" :event="event" />
    <div class="flex justify-end">
      <Button v-if="index === 0" variant="outline" size="sm" @click="undo">
        <Undo2 class="mb-1" />Undo
      </Button>
    </div>
  </div>
</template>
