<script setup>
import { useSite } from "&";
const props = defineProps(["zone", "loading"]);
const site = useSite();
</script>
<template>
  <Loading v-if="site.store.board.loading" />
  <ZoneEmpty v-if="zone.shifts.length === 0" />
  <Shift v-for="shiftId in zone.shifts" :shift="site.getShift(shiftId)" :zone="zone" />
  <ZoneControls :zoneType="zone.type" />
  <div class="mb-12"></div>
</template>
