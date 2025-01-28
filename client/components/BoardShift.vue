<script setup>
import { computed } from "vue";
import { UserPlus, Users } from "lucide-vue-next";
const props = defineProps(["shift", "zone"]);

// TAGS
const tags = computed(() => {
  const { shift, zone } = props;
  const tags = [];
  if (zone.type.includes("rotation")) {
    tags.push("rotation");
  }
  if (zone.type.includes("ft")) {
    tags.push("ft");
  }
  if (
    (zone.active.patient === shift.id && zone.type.includes("rotation")) ||
    (zone.shifts[0] === shift.id && zone.type.includes("zone_patient"))
  ) {
    tags.push("next");
  }
  if (zone.active.supervisor === shift.id) {
    tags.push("supervisor");
  }
  if (zone.id === "off") {
    tags.push("off");
  }
  if (shift.skip === 1) {
    tags.push("skipped");
  }
  if (shift.skip > 1) {
    tags.push("paused");
  }
  return tags;
});

// CLASSES
const getClasses = () => {
  if (tags.value.includes("off")) {
    return { box: "bg-slate-100 border-slate-200 dark:bg-slate-800", content: "text-slate-500" };
  }
  if (tags.value.includes("rotation") && tags.value.includes("next")) {
    return {
      box: "border-amber-300 ring-amber-100 ring-0 bg-amber-50 dark:bg-black dark:border-amber-300",
      content: "",
    };
  }
  if (tags.value.includes("ft")) {
    return {
      box: "bg-green-50 border-green-600 dark:bg-black dark:border-green-400",
      content: "text-green-800 dark:text-green-300",
    };
  }
  return { box: "", content: "" };
};

// COUNTS
const patientTotal = () =>
  Object.keys(props.shift.counts).reduce((acc, curr) => acc + props.shift.counts[curr], 0);
const supervisorTotal = () => props.shift.counts.supervisor ?? 0;
</script>

<template>
  <div class="my-4 border rounded-md dark:border-slate-400" :class="getClasses().box">
    <!-- NEXT FLAG -->
    <div
      class="font-bold text-white uppercase bg-amber-300 rounded-t-sm text-[0.7rem] text-center dark:bg-amber-400 dark:text-amber-100"
      v-if="tags.includes('next') && tags.includes('rotation')"
    >
      next
    </div>
    <!-- SHIFT NAME & MENU -->
    <div
      class="flex items-start items-center justify-between px-2 py-1 bg-slate-500/10 dark:bg-white/20 dark:text-slate-400 first:rounded-t-md text-slate-500"
    >
      <div class="text-[.8rem] font-bold uppercase">
        {{ shift.name }}
      </div>
      <ShiftMenu :shift="shift" :zoneId="zone.id" />
    </div>

    <!-- CONTENT  -->
    <div
      class="flex items-start justify-between px-2 pt-2 rounded-b-md"
      :class="getClasses().content"
    >
      <!-- PROVIDER NAME & COUNT -->
      <div class="rounded-b-md">
        <h4 class="text-2xl font-bold">{{ shift.provider.first }} {{ shift.provider.last }}</h4>

        <div class="my-2 font-mono text-xs text-slate-500 dark:text-slate-300">
          Total: {{ patientTotal() }} &#x2022; Supervisor: {{ supervisorTotal() }}
        </div>
      </div>
      <!-- ROTATION FLAGS & ASSIGN BUTTON -->
      <div class="flex items-center gap-2 mt-2">
        <div
          v-if="tags.includes('supervisor')"
          class="px-2 py-1 text-[0.6rem] font-bold text-white bg-sky-400 rounded-xl"
        >
          <Users size="14" class="inline mr-2" />NEXT SUP
        </div>
        <div
          class="px-2 py-1 text-[0.6rem] font-bold text-white bg-slate-400 rounded-xl"
          v-if="tags.includes('paused') && tags.includes('rotation')"
        >
          PAUSED
        </div>
        <div
          class="px-2 py-1 text-[0.6rem] font-bold text-white bg-slate-400 rounded-xl"
          v-if="tags.includes('skipped') && tags.includes('rotation')"
        >
          SKIP NEXT
        </div>
        <div v-if="tags.includes('next')">
          <Button><UserPlus />Assign</Button>
        </div>
      </div>
    </div>
  </div>
</template>
