<script setup>
import { ref, onMounted, computed } from "vue";
import api from "../stores/api.js";

const open = ref(false);
const providers = ref([]);
const schedule = ref([]);

const selectedProvider = ref(null);
const selectedProviderParsed = computed(() => {
  return selectedProvider.value ? JSON.parse(selectedProvider.value) : null;
});

const selectedSchedule = ref(null);
const selectedScheduleParsed = computed(() => {
  return selectedSchedule.value ? JSON.parse(selectedSchedule.value) : null;
});

const formIncomplete = computed(() => {
  return !selectedProvider.value || !selectedSchedule.value;
});

const signIn = async () => {
  open.value = false;
  api.signIn(selectedProviderParsed.value, selectedScheduleParsed.value);
  reset();
};

const reset = () => {
  selectedProvider.value = null;
  selectedSchedule.value = null;
};

onMounted(async () => {
  const res = await api.getSiteDetails();
  providers.value = res.providers;
  schedule.value = res.schedule;
});
</script>

<template>
  <Popover :open="open" @update:open="open = !open">
    <PopoverTrigger>
      <Button> <Icon icon="provider" />Add Clinician</Button>
    </PopoverTrigger>
    <PopoverContent @interactOutside="reset" class="flex flex-col gap-2">
      <Select v-model="selectedProvider">
        <SelectTrigger>
          {{
            selectedProvider
              ? `${selectedProviderParsed.last}, ${selectedProviderParsed.first}`
              : "Select a provider"
          }}
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem v-for="provider in providers" :value="JSON.stringify(provider)">
              {{ provider.last }}, {{ provider.first }}
            </SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>

      <Select v-model="selectedSchedule">
        <SelectTrigger>
          {{ selectedSchedule ? selectedScheduleParsed.name : "Select a schedule" }}
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem v-for="shift in schedule" :value="JSON.stringify(shift)">{{
              shift.name
            }}</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>

      <Button @click="signIn" :disabled="formIncomplete ?? null">Add to Board</Button>
    </PopoverContent>
  </Popover>
</template>
