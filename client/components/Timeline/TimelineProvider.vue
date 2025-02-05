<script setup>
import { ChevronDown } from "lucide-vue-next";
import { useSite, useApi } from "&";
const props = defineProps(["eventId", "shift"]);

const site = useSite();
const api = useApi();

const reassignPatient = (newShiftId) => {
  api.reassign({ eventId: props.eventId, newShiftId });
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

    <DropdownMenuContent align="start" v-if="shift">
      <DropdownMenuLabel>Reassign to:</DropdownMenuLabel>
      <DropdownMenuSeparator />
      <div v-for="shift in site.getOtherShifts(props.shift.id)">
        <DropdownMenuItem class="px-4" @click="reassignPatient(shift.id)">
          {{ shift?.provider.first }} {{ shift?.provider.last }}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
      </div>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
