<script setup>
import { computed } from "vue";
import { ChevronDown } from "lucide-vue-next";
import { useSite } from "../use/site.js";
import { useApi } from "../use/api.js";

const site = useSite();
const api = useApi();

const props = defineProps(["eventId", "shift"]);

const otherShifts = computed(() => {
  const shifts = site.store.board.shifts;
  return Object.keys(shifts)
    .filter((key) => shifts[key].id !== props.shift.id)
    .map((key) => shifts[key]);
});

const reassignPatient = (newShiftId) => {
  api.post("/api/board/reassignPatient", { eventId: props.eventId, newShiftId });
};
</script>
<template>
  <DropdownMenu>
    <DropdownMenuTrigger class="group">
      <div class="text-xl font-bold">
        {{ shift?.provider.first }} {{ shift?.provider.last }}
        <ChevronDown class="invisible inline group-hover:visible" size="14" />
      </div>
    </DropdownMenuTrigger>

    <!-- PROVIDER -->
    <DropdownMenuContent align="start" v-if="shift">
      <DropdownMenuLabel>Reassign to:</DropdownMenuLabel>
      <DropdownMenuSeparator />
      <div v-for="shift in otherShifts">
        <DropdownMenuItem class="px-4" @click="reassignPatient(shift.id)">
          {{ shift?.provider.first }} {{ shift?.provider.last }}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
      </div>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
