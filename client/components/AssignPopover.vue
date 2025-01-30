<script setup>
import { ref, computed } from "vue";
import { details } from "../stores/board.js";
import api from "../stores/api.js";
import { UserPlus, Activity, Zap, Siren, ChevronDown } from "lucide-vue-next";

const props = defineProps(["zoneId"]);

const selectedType = ref();
const selectedRoom = ref();

const open = ref(false);

const formIncomplete = computed(() => {
  return !selectedType.value || !selectedRoom.value;
});

const assign = () => {
  open.value = false;
  api.postApi("assignToZone", {
    zoneId: props.zoneId,
    patient: { mode: selectedType.value, room: selectedRoom.value },
  });
};

const reset = () => {
  selectedType.value = null;
  selectedRoom.value = null;
};
</script>
<template>
  <Popover :open="open" @update:open="open = !open" modal>
    <PopoverTrigger>
      <Button>Assign <ChevronDown /></Button>
    </PopoverTrigger>
    <PopoverContent
      align="end"
      @interactOutside="reset"
      class="flex flex-col gap-2 shadow-lg w-52 border-slate-200"
    >
      <ToggleGroup type="single" variant="outline" class="justify-left" v-model="selectedType">
        <ToggleGroupItem value="walkin" aria-label="walkin">
          <UserPlus class="w-4 h-4" />
        </ToggleGroupItem>
        <ToggleGroupItem value="ambo" aria-label="ambulance">
          <Activity class="w-4 h-4" />
        </ToggleGroupItem>
        <ToggleGroupItem value="police" aria-label="police">
          <Siren class="w-4 h-4" />
        </ToggleGroupItem>
        <ToggleGroupItem value="ft" aria-label="fast track">
          <Zap class="w-4 h-4" />
        </ToggleGroupItem>
      </ToggleGroup>

      <Select v-model="selectedRoom">
        <SelectTrigger class="bg-white">{{ selectedRoom ? selectedRoom : "Room:" }}</SelectTrigger>
        <SelectContent class="max-h-80">
          <SelectGroup>
            <SelectItem v-for="room in details.rooms" :value="room">{{ room }}</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>

      <Button @click="assign" :disabled="formIncomplete ?? null">Assign</Button>
    </PopoverContent>
  </Popover>
</template>
