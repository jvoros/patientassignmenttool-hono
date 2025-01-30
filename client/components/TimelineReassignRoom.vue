<script setup>
import { ChevronDown } from "lucide-vue-next";
import { details } from "../stores/board.js";
import api from "../stores/api.js";
const props = defineProps(["eventId", "shift", "room"]);

const reassignPatient = (newShiftId) => {
  api.postApi("/reassignPatient", { eventId: props.eventId, newShiftId });
};
</script>
<template>
  <DropdownMenu>
    <DropdownMenuTrigger class="group">
      <div class="text-xl font-bold">
        {{ room }}
        <ChevronDown class="invisible inline group-hover:visible" size="14" />
      </div>
    </DropdownMenuTrigger>

    <DropdownMenuContent align="end" v-if="room" class="w-4">
      <DropdownMenuLabel>New room:</DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuItem class="p-0 focus:bg-white dark:focus:bg-background">
        <ScrollArea class="w-full h-44">
          <div v-for="room in details.rooms" :key="tag">
            <div class="py-1 pl-6 text-sm hover:bg-secondary hover:cursor-pointer">
              {{ room }}
            </div>
            <DropdownMenuSeparator />
          </div>
        </ScrollArea>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
