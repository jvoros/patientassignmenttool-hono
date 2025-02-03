<script setup>
import { computed } from "vue";
import { useSite } from "../use/site.js";
import { useApi } from "../use/api.js";
import { Undo2 } from "lucide-vue-next";

const site = useSite();
const api = useApi();

const events = computed(() =>
  site.store.board.timeline.map((eventId) => site.store.board.events[eventId])
);

const undo = () => {
  api.post("/api/board/undo");
};
</script>
<template>
  <BoardHeader>Timeline</BoardHeader>
  <InstructionBox> Click provider or room number to change. </InstructionBox>
  <div
    v-for="(event, index) in events"
    class="pl-2 ml-3 border-l-2 border-slate-200 dark:border-slate-700"
  >
    <TimelineEvent :event="event" v-if="!event.type.includes('assign')" />
    <TimelineAssign :event="event" v-if="event.type.includes('assign')" />
    <div class="flex justify-end pb-4" v-if="index === 0">
      <Button variant="outline" @click="undo"> <Undo2 class="mb-1" />Undo </Button>
    </div>
  </div>
</template>
