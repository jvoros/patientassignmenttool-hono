<script setup>
import { computed } from "vue";
import { board } from "../stores/board.js";
import api from "../stores/api.js";
import { Undo2 } from "lucide-vue-next";

const events = computed(() => {
  return board.value.timeline?.map((eventId) => board.value.events[eventId]);
});

const undo = () => {
  api.postApi("undo");
};
</script>
<template>
  <div class="flex items-center gap-4 px-4 py-2 mb-4 text-sm border rounded-md text-slate-400">
    Click provider or room number to change.
  </div>
  <div
    v-for="(event, index) in events"
    class="pl-2 ml-3 border-l-2 border-slate-200 dark:border-slate-700"
  >
    <TimelineEvent :event="event" v-if="!event.type.includes('assign')" />
    <TimelineAssign :event="event" v-if="event.type.includes('assign')" />
    <div class="flex justify-end pb-4" v-if="index === 0">
      <Button variant="secondary" @click="undo"> <Undo2 class="mb-1" />Undo </Button>
    </div>
  </div>
</template>
