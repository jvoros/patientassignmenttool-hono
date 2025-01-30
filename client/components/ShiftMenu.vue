<script setup>
import { ref, computed } from "vue";
import {
  Menu,
  UserPlus,
  ArrowRightLeft,
  SquarePlus,
  SquareArrowOutUpLeft,
  RedoDot,
  CirclePause,
  RotateCcw,
  Smile,
  X,
} from "lucide-vue-next";
import api from "../stores/api.js";
import { board } from "../stores/board.js";

const props = defineProps(["shift", "zoneId"]);
const isApp = () => props.shift.role === "app";
const isSkipped = computed(() => props.shift.skip === 1);
const isPaused = computed(() => props.shift.skip > 1);

const otherZones = Object.keys(board.value.zones).filter(
  (key) => key !== props.zoneId && key !== "off"
);

const numberOfZones = () => {
  let count = 0;
  Object.keys(board.value.zones).forEach((zone) => {
    if (board.value.zones[zone].shifts.includes(props.shift.id)) count++;
  });
  return count;
};

const deleteDialogOpen = ref(false);
const assignDialogOpen = ref(false);

const deleteDialogToggle = () => {
  deleteDialogOpen.value = !deleteDialogOpen.value;
};

const assignDialogToggle = () => {
  assignDialogOpen.value = !assignDialogOpen.value;
};

const apiFn = (method, payload) => {
  api.postApi(method, payload);
};

// generic fn for any actions that just take shiftId
const shiftAction = (method) => {
  apiFn(method, { shiftId: props.shift.id });
};

const changePosition = (dir) => {
  apiFn("changePosition", { zoneId: props.zoneId, shiftId: props.shift.id, direction: dir });
};

const switchZone = (joinZoneId) => {
  apiFn("switchZone", {
    leaveZoneId: props.zoneId,
    joinZoneId: joinZoneId,
    shiftId: props.shift.id,
  });
};

const joinZone = (joinZoneId) => {
  apiFn("joinZone", {
    joinZoneId,
    shiftId: props.shift.id,
  });
};

const leaveZone = (leaveZoneId) => {
  apiFn("leaveZone", {
    leaveZoneId: props.zoneId,
    shiftId: props.shift.id,
  });
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

      <DropdownMenuItem class="data-[highlighted]:bg-accent" @click="changePosition(-1)"
        >&uarr; &nbsp;Move Up</DropdownMenuItem
      >
      <DropdownMenuItem class="data-[highlighted]:bg-accent" @click="changePosition(1)"
        >&darr; &nbsp;Move Down</DropdownMenuItem
      >

      <DropdownMenuSeparator class="bg-secondary" />

      <DropdownMenuItem @click="assignDialogToggle" class="data-[highlighted]:bg-accent">
        <UserPlus />Assign Patient
      </DropdownMenuItem>

      <DropdownMenuSeparator class="bg-secondary" />

      <template v-if="isApp()">
        <DropdownMenuItem
          class="data-[highlighted]:bg-accent"
          v-if="!isSkipped && !isPaused"
          @click="shiftAction('pauseShift')"
        >
          <CirclePause />Pause Shift
        </DropdownMenuItem>
        <DropdownMenuItem
          class="data-[highlighted]:bg-accent"
          v-if="isPaused"
          @click="shiftAction('unpauseShift')"
        >
          <RotateCcw />Unpause Shift
        </DropdownMenuItem>
        <DropdownMenuItem
          class="data-[highlighted]:bg-accent"
          v-if="isSkipped"
          @click="shiftAction('unpauseShift')"
        >
          <RotateCcw />Cancel Skip
        </DropdownMenuItem>
        <DropdownMenuSeparator class="bg-secondary" />
      </template>

      <DropdownMenuItem
        class="data-[highlighted]:bg-accent"
        v-if="numberOfZones() > 1"
        @click="leaveZone"
      >
        <SquareArrowOutUpLeft />Leave this Zone
      </DropdownMenuItem>

      <DropdownMenuSub>
        <DropdownMenuSubTrigger class="data-[highlighted]:bg-accent">
          <ArrowRightLeft size="14" class="mr-2" />Switch Zones
        </DropdownMenuSubTrigger>
        <DropdownMenuSubContent class="bg-white dark:bg-background">
          <DropdownMenuItem
            v-for="zoneId in otherZones"
            @click="switchZone(zoneId)"
            class="data-[highlighted]:bg-accent"
          >
            {{ board.zones[zoneId].name }}
          </DropdownMenuItem>
        </DropdownMenuSubContent>
      </DropdownMenuSub>

      <DropdownMenuSub>
        <DropdownMenuSubTrigger class="data-[highlighted]:bg-accent">
          <SquarePlus size="16" class="mr-2" />Join Additional Zone
        </DropdownMenuSubTrigger>
        <DropdownMenuSubContent class="bg-white dark:bg-background">
          <DropdownMenuItem
            v-for="zoneId in otherZones"
            @click="joinZone(zoneId)"
            class="data-[highlighted]:bg-accent"
          >
            {{ board.zones[zoneId].name }}
          </DropdownMenuItem>
        </DropdownMenuSubContent>
      </DropdownMenuSub>

      <DropdownMenuSeparator class="bg-secondary" />

      <DropdownMenuItem class="data-[highlighted]:bg-accent" @click="deleteDialogToggle">
        <X />Delete Shift
      </DropdownMenuItem>

      <DropdownMenuItem @click="shiftAction('signOut')" class="data-[highlighted]:bg-accent">
        <Smile />Sign Out
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>

  <Dialog v-model:open="deleteDialogOpen">
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogDescription>
          <p>This will <b>delete</b> the shift from the board.</p>
          <p>If you just want to leave the rotation, use Sign Out.</p>
        </DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <DialogClose asChild><Button variant="outline">Cancel Delete</Button></DialogClose>
        <Button @click="deleteDialogToggle" variant="destructive">Confirm Delete</Button>
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
