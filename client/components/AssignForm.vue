<script setup>
import { ref, computed, onUnmounted } from "vue";
import { details } from "../stores/board.js";
import api from "../stores/api.js";
import { UserPlus, Activity, Zap, Siren } from "lucide-vue-next";

const props = defineProps(["zoneId", "shiftId"]);
const emit = defineEmits(["assignFired"]);

const selectedType = ref();
const selectedRoom = ref();

const formIncomplete = computed(() => {
  return !selectedType.value || !selectedRoom.value;
});

const assign = () => {
  if (!props.shiftId) {
    api.postApi("assignToZone", {
      zoneId: props.zoneId,
      patient: { mode: selectedType.value, room: selectedRoom.value },
    });
  } else {
    api.postApi("assignToShift", {
      zoneId: props.zoneId,
      shiftId: props.shiftId,
      patient: { mode: selectedType.value, room: selectedRoom.value },
    });
  }
  reset();
  emit("assignFired");
};

const reset = () => {
  selectedType.value = null;
  selectedRoom.value = null;
};

onUnmounted(() => {
  reset();
});
</script>
<template>
  <ToggleGroup type="single" variant="outline" class="justify-left" v-model="selectedType">
    <ToggleGroupItem value="walkin" aria-label="walkin" class="bg-white dark:bg-background">
      <UserPlus class="w-4 h-4" />
    </ToggleGroupItem>
    <ToggleGroupItem value="ambo" aria-label="ambulance" class="bg-white dark:bg-background">
      <Activity class="w-4 h-4" />
    </ToggleGroupItem>
    <ToggleGroupItem value="police" aria-label="police" class="bg-white dark:bg-background">
      <Siren class="w-4 h-4" />
    </ToggleGroupItem>
    <ToggleGroupItem value="ft" aria-label="fast track" class="bg-white dark:bg-background">
      <Zap class="w-4 h-4" />
    </ToggleGroupItem>
  </ToggleGroup>

  <Select v-model="selectedRoom">
    <SelectTrigger class="bg-white">{{ selectedRoom ? selectedRoom : "Room:" }}</SelectTrigger>
    <SelectContent class="max-h-80">
      <SelectGroup>
        <div v-for="room in details.rooms">
          <SelectItem :value="room">{{ room }}</SelectItem>
          <SelectSeparator />
        </div>
      </SelectGroup>
    </SelectContent>
  </Select>

  <Button @click="assign" :disabled="formIncomplete ?? null">Assign Patient</Button>
</template>
