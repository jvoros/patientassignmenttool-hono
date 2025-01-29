<script setup>
import { computed, ref } from "vue";
import { board, details } from "../stores/board.js";
import api from "../stores/api.js";
const props = defineProps(["eventId", "shift", "room"]);

const open = ref(false);

const otherShifts = computed(() =>
  Object.keys(board.value.shifts)
    .filter((key) => board.value.shifts[key].id !== props.shift.id)
    .map((key) => board.value.shifts[key])
);

const reassignPatient = (newValue) => {
  console.log("reassignPatient fired...", newValue);
  open.value = false;

  api.postApi("/reassignPatient", { eventId: props.eventId, newShiftId: newValue });
};
</script>
<template>
  <Popover :open="open" @update:open="open = !open">
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
  </Popover>
</template>
