<script setup>
import { ref, computed } from "vue";
import {
  Menu,
  UserPlus,
  ArrowRightLeft,
  SquarePlus,
  SquareArrowOutUpLeft,
  CirclePause,
  RotateCcw,
  Smile,
  X,
} from "lucide-vue-next";
import api from "../stores/api.js";
import { board } from "../stores/board.js";

const props = defineProps(["shift", "zoneId"]);
const zones = board.value.zones;

// FLAGS
const isApp = props.shift.role === "app";
const isSkipped = props.shift.skip === 1;
const isPaused = props.shift.skip > 1;
const hasPatients = Object.values(props.shift.counts).length > 0;
const isInOtherZones =
  Object.keys(zones).filter((zoneId) => zones[zoneId].shifts.includes(props.shift.id)).length > 1;

const cannotLeave = computed(() => {
  const zone = zones[props.zoneId];
  const docCount = zone.shifts.filter(
    (shiftId) => board.value.shifts[shiftId].role === "physician"
  ).length;
  return !isApp && zone.type.includes("super") && docCount < 2;
});

const otherZones = Object.keys(zones).filter((key) => key !== props.zoneId && key !== "off");

// DIALOGS
const deleteDialogOpen = ref(false);
const assignDialogOpen = ref(false);
const deleteDialogToggle = () => {
  deleteDialogOpen.value = !deleteDialogOpen.value;
};
const assignDialogToggle = () => {
  assignDialogOpen.value = !assignDialogOpen.value;
};

// HANDLERS

const togglePause = () => {
  const payload = { shiftId: props.shift.id };
  if (isPaused || isSkipped) {
    api.postApi("unpauseShift", payload);
  } else {
    api.postApi("pauseShift", payload);
  }
};

const changePosition = (dir) => {
  api.postApi("changePosition", { zoneId: props.zoneId, shiftId: props.shift.id, direction: dir });
};

const switchZone = (joinZoneId) => {
  if (cannotLeave.value) {
    throw Error("Cannot leave zone. There must be at least one doctor in this zone.");
  }
  api.postApi("switchZone", {
    leaveZoneId: props.zoneId,
    joinZoneId: joinZoneId,
    shiftId: props.shift.id,
  });
};

const joinZone = (joinZoneId) => {
  api.postApi("joinZone", {
    joinZoneId,
    shiftId: props.shift.id,
  });
};

const leaveZone = () => {
  if (cannotLeave.value) {
    throw Error("Cannot leave zone. There must be at least one doctor in this zone.");
  }
  api.postApi("leaveZone", {
    leaveZoneId: props.zoneId,
    shiftId: props.shift.id,
  });
};

const signOut = () => {
  if (cannotLeave.value) {
    throw Error("Cannot leave zone. There must be at least one doctor in this zone.");
  }
  api.postApi("signOut", { shiftId: props.shift.id });
};

const deleteDialogMenuClick = () => {
  if (cannotLeave.value) {
    throw Error("Cannot leave zone. There must be at least one doctor in this zone.");
  }
  if (hasPatients) {
    throw Error("Cannot Delete shift. Already has patients assigned");
  }
  deleteDialogToggle();
};

const deleteShiftConfirm = () => {
  api.postApi("deleteShift", { shiftId: props.shift.id });
  deleteDialogToggle();
};
</script>
<template>
  <DropdownMenu>
    <DropdownMenuTrigger>
      <div class="px-1"><Menu size="16" /></div>
    </DropdownMenuTrigger>

    <DropdownMenuContent align="end" class="bg-white shadow-lg dark:bg-background border-slate-200">
      <DropdownMenuLabel>Shift Tools</DropdownMenuLabel>
      <DropdownMenuSeparator class="bg-secondary" />

      <DropdownMenuItem @click="changePosition(-1)">&uarr; &nbsp;Move Up</DropdownMenuItem>
      <DropdownMenuItem @click="changePosition(1)">&darr; &nbsp;Move Down</DropdownMenuItem>

      <DropdownMenuSeparator class="bg-secondary" />

      <DropdownMenuItem @click="assignDialogToggle"> <UserPlus />Assign Patient </DropdownMenuItem>

      <DropdownMenuSeparator class="bg-secondary" />

      <template v-if="isApp">
        <DropdownMenuItem v-if="!isSkipped && !isPaused" @click="togglePause">
          <CirclePause />Pause Shift
        </DropdownMenuItem>
        <DropdownMenuItem v-if="isPaused" @click="togglePause">
          <RotateCcw />Unpause Shift
        </DropdownMenuItem>
        <DropdownMenuItem v-if="isSkipped" @click="togglePause">
          <RotateCcw />Cancel Skip
        </DropdownMenuItem>
        <DropdownMenuSeparator class="bg-secondary" />
      </template>

      <DropdownMenuItem v-if="isInOtherZones" @click="leaveZone">
        <SquareArrowOutUpLeft />Leave this Zone
      </DropdownMenuItem>

      <DropdownMenuSub>
        <DropdownMenuSubTrigger>
          <ArrowRightLeft size="14" class="mr-2" />Switch Zones
        </DropdownMenuSubTrigger>
        <DropdownMenuSubContent class="bg-white dark:bg-background">
          <DropdownMenuItem v-for="zoneId in otherZones" @click="switchZone(zoneId)">
            {{ board.zones[zoneId].name }}
          </DropdownMenuItem>
        </DropdownMenuSubContent>
      </DropdownMenuSub>

      <DropdownMenuSub>
        <DropdownMenuSubTrigger>
          <SquarePlus size="16" class="mr-2" />Join Additional Zone
        </DropdownMenuSubTrigger>
        <DropdownMenuSubContent class="bg-white dark:bg-background">
          <DropdownMenuItem v-for="zoneId in otherZones" @click="joinZone(zoneId)">
            {{ board.zones[zoneId].name }}
          </DropdownMenuItem>
        </DropdownMenuSubContent>
      </DropdownMenuSub>

      <DropdownMenuSeparator class="bg-secondary" />

      <DropdownMenuItem @click.stop="deleteDialogMenuClick"> <X />Delete Shift </DropdownMenuItem>

      <DropdownMenuItem @click="signOut"> <Smile />Sign Out </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>

  <Dialog v-model:open="deleteDialogOpen">
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogDescription> This will erase the shift from the board. </DialogDescription>
      </DialogHeader>

      <Alert variant="warn" v-if="hasPatients">
        <AlertDescription>
          <div>Cannot delete shift. Already has patients assigned.</div>
        </AlertDescription>
      </Alert>
      <DialogFooter>
        <DialogClose asChild><Button variant="outline">Cancel Delete</Button></DialogClose>
        <Button @click="deleteShiftConfirm" variant="destructive" :disabled="hasPatients"
          >Confirm Delete</Button
        >
      </DialogFooter>
    </DialogContent>
  </Dialog>

  <Dialog v-model:open="assignDialogOpen">
    <DialogContent class="w-80">
      <DialogHeader>
        <DialogTitle>Assign Patient Out of Rotation</DialogTitle>
        <DialogDescription>
          Assigning the patient here will not affect the rotation.
        </DialogDescription>
      </DialogHeader>
      <AssignForm :zoneId="zoneId" :shiftId="shift.id" @assignFired="assignDialogToggle" />
    </DialogContent>
  </Dialog>
</template>
