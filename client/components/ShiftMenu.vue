<script setup>
import { ref, computed } from "vue";
import { useApi, useSite } from "../use";
import { Menu, UserPlus, Smile, X } from "lucide-vue-next";

const props = defineProps(["shift", "zoneId"]);

const api = useApi();
const site = useSite();

// FLAGS
const isApp = computed(() => props.shift.role === "app");
const hasPatients = computed(() => Object.values(props.shift.counts).length > 0);
const cannotLeave = computed(() => {
  const zone = site.store.board.zones[props.zoneId];
  const docCount = zone.shifts.filter(
    (shiftId) => site.store.board.shifts[shiftId].role === "physician"
  ).length;
  return !isApp.value && zone.type.includes("super") && docCount < 2;
});

// DIALOGS
const deleteDialogOpen = ref(false);
const deleteDialogToggle = () => {
  deleteDialogOpen.value = !deleteDialogOpen.value;
};

const assignDialogOpen = ref(false);
const assignDialogToggle = () => {
  assignDialogOpen.value = !assignDialogOpen.value;
};

// HANDLERS
const signOut = () => {
  if (cannotLeave.value) {
    const error = "Cannot leave zone. There must be at least one doctor in this zone.";
    console.warn("[ShiftMenu.signOut]", error);
    site.setError(error);
    return;
  }
  api.post("/api/board/signOut", { shiftId: props.shift.id });
};

const deleteDialogMenuClick = () => {
  if (cannotLeave.value) {
    const error = "Cannot leave zone. There must be at least one doctor in this zone.";
    console.warn("[ShiftMenu.deleteMenu]", error);
    site.setError(error);
    return;
  }
  if (hasPatients.value) {
    const error = "Cannot Delete shift. Already has patients assigned";
    console.warn("[ShiftMenu.deleteMenu]", error);
    site.setError(error);
    return;
  }
  deleteDialogToggle();
};
</script>
<template>
  <DropdownMenu>
    <DropdownMenuTrigger>
      <div class="px-1"><Menu size="16" /></div>
    </DropdownMenuTrigger>

    <DropdownMenuContent
      align="end"
      class="w-56 bg-white shadow-lg dark:bg-background border-slate-200"
    >
      <DropdownMenuLabel>Shift Tools</DropdownMenuLabel>
      <DropdownMenuSeparator class="bg-secondary" />

      <ShiftMenuChangePosition :zoneId="props.zoneId" :shiftId="props.shift.id" />

      <DropdownMenuItem @click="assignDialogToggle"> <UserPlus />Assign Patient </DropdownMenuItem>
      <DropdownMenuSeparator class="bg-secondary" />

      <ShiftMenuPause v-if="isApp" :shiftId="props.shift.id" />

      <ShiftMenuZones
        :shiftId="props.shift.id"
        :zoneId="props.zoneId"
        :isApp="isApp"
        :cannotLeave="cannotLeave"
      />

      <DropdownMenuItem @click.stop="deleteDialogMenuClick"><X />Delete Shift </DropdownMenuItem>
      <DropdownMenuItem @click="signOut"> <Smile />Sign Out </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>

  <ShiftMenuDeleteDialog
    :open="deleteDialogOpen"
    @close="deleteDialogToggle"
    :hasPatients="hasPatients"
    :shiftId="shift.id"
  />

  <ShiftMenuAssignDialog
    :open="assignDialogOpen"
    @close="assignDialogToggle"
    :zoneId="zoneId"
    :shiftId="shift.id"
  />
</template>
