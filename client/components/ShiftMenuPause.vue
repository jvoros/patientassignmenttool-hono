<script setup>
import { computed } from "vue";
import { CirclePause, RotateCcw } from "lucide-vue-next";
import { useApi, useSite } from "../use";

const props = defineProps(["shiftId"]);
const site = useSite();
const shift = computed(() => site.getShift(props.shiftId));
const isSkipped = computed(() => shift.value.skip === 1);
const isPaused = computed(() => shift.value.skip > 1);

const api = useApi();
const togglePause = () => {
  const payload = { shiftId: props.shiftId };
  if (isPaused.value || isSkipped.value) {
    api.post("/api/board/unpauseShift", payload);
  } else {
    api.post("/api/board/pauseShift", payload);
  }
};
</script>
<template>
  <DropdownMenuItem v-if="!isSkipped && !isPaused" @click="togglePause">
    <CirclePause />Pause Shift
  </DropdownMenuItem>

  <DropdownMenuItem v-if="isPaused" @click="togglePause">
    <RotateCcw />Unpause Shift
  </DropdownMenuItem>

  <DropdownMenuItem v-if="isSkipped" @click="togglePause">
    <RotateCcw />Cancel Skip
  </DropdownMenuItem>

  <DropdownMenuSeparator class="bg-secondary" />
</template>
