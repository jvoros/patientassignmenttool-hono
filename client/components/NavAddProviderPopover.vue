<script setup>
import { ref, onMounted, computed } from "vue";
import { Stethoscope, ChevronDown, TriangleAlert } from "lucide-vue-next";
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

const resetShiftSelected = computed(() => {
  return selectedSchedule.value
    ? selectedSchedule.value === JSON.stringify(schedule.value[0])
    : false;
});

const signIn = async () => {
  open.value = false;
  if (resetShiftSelected.value) {
    await api.postApi("boardReset");
  }
  api.postApi("signIn", {
    provider: selectedProviderParsed.value,
    schedule: selectedScheduleParsed.value,
  });
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
      <Button><Stethoscope />Add Clinician <ChevronDown /></Button>
    </PopoverTrigger>
    <PopoverContent
      @interactOutside="reset"
      class="flex flex-col gap-2 p-4 shadow-lg border-slate-200"
      align="end"
    >
      <Select v-model="selectedProvider">
        <SelectTrigger class="focus:ring-accent">
          {{
            selectedProvider
              ? `${selectedProviderParsed.last}, ${selectedProviderParsed.first}`
              : "Clinician:"
          }}
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <div v-for="provider in providers">
              <SelectItem :value="JSON.stringify(provider)">
                {{ provider.last }}, {{ provider.first }}
              </SelectItem>
              <SelectSeparator />
            </div>
          </SelectGroup>
        </SelectContent>
      </Select>

      <Select v-model="selectedSchedule">
        <SelectTrigger class="bg-white focus:ring-accent">
          {{ selectedSchedule ? selectedScheduleParsed.name : "Shift:" }}
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <div v-for="shift in schedule">
              <SelectItem :value="JSON.stringify(shift)">{{ shift.name }}</SelectItem>
              <SelectSeparator />
            </div>
          </SelectGroup>
        </SelectContent>
      </Select>

      <div v-if="resetShiftSelected">
        <Alert variant="warn">
          <AlertDescription>
            <div>
              Assigning <b>{{ schedule[0].name }}</b> shift will restart the board for a new day.<br />
            </div>
          </AlertDescription>
        </Alert>
      </div>

      <Button @click="signIn" :disabled="formIncomplete ?? null">Add to Board</Button>
    </PopoverContent>
  </Popover>
</template>
