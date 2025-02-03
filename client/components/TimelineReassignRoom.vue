<script setup>
import { computed } from "vue";
import { ChevronDown } from "lucide-vue-next";
import { useSite } from "../use/site";
import { useApi } from "../use/api";
const props = defineProps(["eventId", "shift", "room"]);
const site = useSite();
const api = useApi();
const details = computed(() => site.state.details);
const changeRoom = (newRoom) => {
  api.post("/api/board/changeRoom", { eventId: props.eventId, newRoom });
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
          <div v-for="room in details.rooms">
            <div
              class="py-1 pl-6 text-sm hover:bg-secondary hover:cursor-pointer"
              @click="changeRoom(room)"
            >
              {{ room }}
            </div>
            <DropdownMenuSeparator />
          </div>
        </ScrollArea>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
