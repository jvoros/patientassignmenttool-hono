<script setup>
import { computed, ref } from "vue";
import { ChevronDown } from "lucide-vue-next";
import { board, details } from "../stores/board.js";
import api from "../stores/api.js";
const props = defineProps(["eventId", "shift", "room"]);

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
      <div class="text-xl font-bold" v-if="shift">
        {{ shift?.provider.first }} {{ shift?.provider.last }}
        <ChevronDown class="invisible inline group-hover:visible" size="14" />
      </div>
      <div class="text-xl font-bold" v-if="room">
        {{ room }}
        <ChevronDown class="invisible inline group-hover:visible" size="14" />
      </div>
    </DropdownMenuTrigger>
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

    <DropdownMenuContent align="end" v-if="room" class="w-4">
      <!-- <DropdownMenuLabel>New room:</DropdownMenuLabel>
      <DropdownMenuSeparator /> -->
      <!-- <DropdownMenuItem class="justify-end px-4" v-for="room in details.rooms">{{
        room
      }}</DropdownMenuItem> -->
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

  <!-- <Popover :open="open" @update:open="open = !open">
    <PopoverTrigger as-child>
      <div class="text-xl font-bold hover:cursor-pointer">
        <span v-if="shift">{{ shift?.provider.first }} {{ shift?.provider.last }}</span>
        <span v-if="room">{{ room }} </span>
      </div>
    </PopoverTrigger>
    <PopoverContent align="start" class="-ml-4 w-60 dark:bg-background" v-if="shift">
      <div>
        <Select @update:modelValue="reassignPatient">
          <SelectTrigger class="font-bold">Reassign to:</SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem v-for="shift in otherShifts" :value="shift.id">
                {{ shift?.provider.first }} {{ shift?.provider.last }}
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </PopoverContent>
    <PopoverContent align="end" class="w-40 -mr-4 dark:bg-background" v-if="room">
      <div>
        <Select v-model="newRoom">
          <SelectTrigger class="font-bold">New Room:</SelectTrigger>
          <SelectContent position="popper" class="max-h-80">
            <SelectGroup>
              <SelectItem v-for="rm in details.rooms" :value="rm">{{ rm }}</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </PopoverContent>
  </Popover> -->
</template>
