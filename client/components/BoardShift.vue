<script setup>
import { computed, reactive } from "vue";
const props = defineProps(["shift", "isSup", "isNext", "zoneType"]);

const classObject = reactive({
  "bg-white": !props.isNext,
  "bg-amber-50": props.isNext,
  "border-amber-300 border-2": props.isNext,
});

const getConditionalClasses = () => {
  const isNext =
    props.isNext && props.zoneType.includes("rotation")
      ? "bg-amber-50 border-2 border-amber-300"
      : "bg-white";
  return [isNext].join(" ");
};

const patientTotal = computed(() =>
  Object.keys(props.shift.counts).reduce((acc, curr) => acc + props.shift.counts[curr], 0)
);

const supervisorTotal = computed(() => props.shift.counts.supervisor ?? 0);
</script>
<template>
  <div class="my-4 border rounded-md" :class="getConditionalClasses()">
    <!-- <div class="p-1 text-xs font-bold text-white rounded-t-md bg-slate-900">flag</div> -->
    <div
      class="flex items-start items-center justify-between px-2 py-1 rounded-md text-slate-600 bg-slate-100"
    >
      <div>
        <h3 class="text-sm font-light">{{ shift.name }}</h3>
      </div>
      <div><Icon icon="menu" /></div>
    </div>
    <div class="px-2 mt-2">
      <div class="flex items-start justify-between">
        <div>
          <h4 class="text-2xl font-bold">{{ shift.provider.first }} {{ shift.provider.last }}</h4>
          <div v-if="isSup" class="mt-1">
            <span class="px-2 py-1 text-xs font-light text-white bg-purple-400 rounded-xl"
              >NEXT SUP</span
            >
          </div>

          <div class="my-2 font-mono text-xs text-slate-500">
            Total: {{ patientTotal }} &#x2022; Supervisor: {{ supervisorTotal }}
          </div>
        </div>
        <div v-if="isNext">
          <Button class="mt-2"><span class="text-lg">Assign</span></Button>
        </div>
      </div>
    </div>
  </div>
</template>
