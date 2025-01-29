<script setup>
import { computed } from "vue";
import { Info, Activity, UserPlus, Siren, Zap } from "lucide-vue-next";
const props = defineProps(["icon"]);

const styles = computed(() => {
  const icon = props.icon;
  return icon === "event"
    ? "bg-slate-100 border-slate-50 dark:bg-black"
    : icon === "ambo" || icon === "ambulance"
    ? "bg-red-300 border-red-400 text-red-600"
    : icon === "walkin"
    ? "bg-yellow-200 border-yellow-400 text-yellow-600"
    : icon === "ft"
    ? "bg-emerald-100 border-emerald-300 text-emerald-500"
    : icon === "police"
    ? "bg-blue-200 border-blue-400"
    : "";
});
</script>
<template>
  <div
    class="p-1 border rounded-xl ring-4 ring-slate-50 dark:ring-black dark:border-black"
    :class="styles"
  >
    <Info size="16" v-if="icon === 'event'" />
    <Activity size="14" v-if="icon === 'ambo' || icon === 'ambulance'" />
    <UserPlus size="14" v-if="icon === 'walkin'" />
    <Siren size="14" v-if="icon === 'police'" />
    <Zap size="14" v-if="icon === 'ft'" />
  </div>
</template>
