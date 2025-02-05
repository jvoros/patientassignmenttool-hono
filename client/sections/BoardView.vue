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
    <template #timeline>
      <Timeline :timeline="site.store.board.timeline" />
    </template>
    <!-- <template #main>
      <ZoneList :zones="getZoneGroup(1)" />
    </template>
    <template #secondary>
      <ZoneList :zones="getZoneGroup(2)" />

      <BoardHeader>Off Rotation</BoardHeader>
      <Zone v-if="site.store.board.zones.off" :zone="site.getZone('off')" />
    </template> -->
  </BoardLayout>
</template>
