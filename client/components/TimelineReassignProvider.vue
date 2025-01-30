<script setup>
import { computed } from "vue";
import { ChevronDown } from "lucide-vue-next";
import { board } from "../stores/board.js";
import api from "../stores/api.js";
const props = defineProps(["eventId", "shift"]);

const otherShifts = computed(() =>
  Object.keys(board.value.shifts)
    .filter((key) => board.value.shifts[key].id !== props.shift.id)
    .map((key) => board.value.shifts[key])
);

const reassignPatient = (newShiftId) => {
  api.postApi("/reassignPatient", { eventId: props.eventId, newShiftId });
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
