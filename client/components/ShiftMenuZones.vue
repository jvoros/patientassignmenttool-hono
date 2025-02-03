<script setup>
import { computed } from "vue";
import { SquareArrowOutUpLeft, ArrowRightLeft, SquarePlus } from "lucide-vue-next";
import { useSite, useApi } from "../use";

const props = defineProps(["zoneId", "shiftId", "isApp", "cannotLeave"]);
const site = useSite();

const isInOtherZones = computed(() => {
  const zones = site.store.board.zones;
  return (
    Object.keys(zones).filter((zoneId) => zones[zoneId].shifts.includes(props.shiftId)).length > 1
  );
});

const otherZones = computed(() =>
  Object.keys(site.store.board.zones).filter((key) => key !== props.zoneId && key !== "off")
);

const api = useApi();
const leaveZone = () => {
  if (props.cannotLeave) {
    const error = "Cannot leave zone. There must be at least one doctor in this zone.";
    console.warn("[ShiftMenu.leaveZone]", error);
    site.setError(error);
    return;
  }
  api.post("/api/board/leaveZone", {
    leaveZoneId: props.zoneId,
    shiftId: props.shiftId,
  });
};

const switchZone = (joinZoneId) => {
  if (props.cannotLeave) {
    const error = "Cannot leave zone. There must be at least one doctor in this zone.";
    console.warn("[ShiftMenu.switchZone]", error);
    site.setError(error);
    return;
  }
  api.post("/api/board/switchZone", {
    leaveZoneId: props.zoneId,
    joinZoneId: joinZoneId,
    shiftId: props.shiftId,
  });
};

const joinZone = (joinZoneId) => {
  api.post("/api/board/joinZone", {
    joinZoneId,
    shiftId: props.shiftId,
  });
};
</script>
<template>
  <DropdownMenuItem v-if="isInOtherZones" @click="leaveZone">
    <SquareArrowOutUpLeft />Leave this Zone
  </DropdownMenuItem>

  <DropdownMenuSub v-if="otherZones.length > 0">
    <DropdownMenuSubTrigger>
      <ArrowRightLeft size="14" class="mr-2" />Switch Zones
    </DropdownMenuSubTrigger>
    <DropdownMenuSubContent class="bg-white dark:bg-background">
      <DropdownMenuItem v-for="zoneId in otherZones" @click="switchZone(zoneId)">
        {{ site.store.board.zones[zoneId].name }}
      </DropdownMenuItem>
    </DropdownMenuSubContent>
  </DropdownMenuSub>

  <DropdownMenuSub v-if="otherZones.length > 0 && props.zoneId !== 'off'">
    <DropdownMenuSubTrigger>
      <SquarePlus size="14" class="mr-2" />Join Additional Zone
    </DropdownMenuSubTrigger>
    <DropdownMenuSubContent class="bg-white dark:bg-background">
      <DropdownMenuItem v-for="zoneId in otherZones" @click="joinZone(zoneId)">
        {{ site.store.board.zones[zoneId].name }}
      </DropdownMenuItem>
    </DropdownMenuSubContent>
  </DropdownMenuSub>

  <DropdownMenuSeparator class="bg-secondary" />
</template>
