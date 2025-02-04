<script setup>
import { useSite, useErrorBoundary } from "/use";

const site = useSite();
site.fetchBoard();
site.fetchDetails();
site.useStream();

useErrorBoundary();

const getZoneGroup = (group) => {
  const filteredZones = Object.values(site.store.board.zones).filter(
    (zone) => zone.order >= group * 10 && zone.order < group * 10 + 10
  );
  return filteredZones.sort((a, b) => a.order - b.order);
};
</script>

<template>
  <Nav />
  <BoardLayout>
    <template v-slot:timeline>
      <Timeline />
    </template>
    <template v-slot:main>
      <ZoneList :zones="getZoneGroup(1)" />
    </template>
    <template v-slot:secondary>
      <ZoneList :zones="getZoneGroup(2)" />
      <Zone v-if="site.store.board.zones.off" :zone="site.getZone('off')" />
    </template>
  </BoardLayout>
</template>
