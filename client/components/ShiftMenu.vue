<script setup>
import { ref } from "vue";
import api from "../stores/api.js";
import { board } from "../stores/board.js";

const props = defineProps(["shiftId", "zoneId"]);

const otherZones = Object.keys(board.value.zones).filter(
  (key) => key !== props.zoneId && key !== "off"
);

const deleteDialogOpen = ref(false);
const assignDialogOpen = ref(false);

const deleteDialogToggle = () => {
  deleteDialogOpen.value = !deleteDialogOpen.value;
};

const assignDialogToggle = () => {
  assignDialogOpen.value = !assignDialogOpen.value;
};

const signOut = () => {
  console.log("SHIFTID: ", props.shiftId);
  api.signOut(props.shiftId);
};
</script>
<template>
  <DropdownMenu>
    <DropdownMenuTrigger>
      <div class="flex items-center">
        <div class="mr-2 text-xs">TOOLS</div>
        <Icon icon="menu" />
      </div>
    </DropdownMenuTrigger>

    <DropdownMenuContent class="bg-slate-100">
      <DropdownMenuLabel>Shift Tools</DropdownMenuLabel>
      <DropdownMenuItem @click="assignDialogToggle" class="data-[highlighted]:bg-slate-200">
        <Icon icon="walkin" />Assign Patient
      </DropdownMenuItem>

      <DropdownMenuSeparator />

      <DropdownMenuItem class="data-[highlighted]:bg-slate-200">&uarr; Move Up</DropdownMenuItem>
      <DropdownMenuItem class="data-[highlighted]:bg-slate-200">&darr; Move Down</DropdownMenuItem>

      <DropdownMenuSeparator />

      <DropdownMenuSub>
        <DropdownMenuSubTrigger class="data-[highlighted]:bg-slate-200">
          <Icon icon="switch" />&nbsp;Switch Zones&nbsp;&nbsp;
        </DropdownMenuSubTrigger>
        <DropdownMenuSubContent class="bg-slate-100">
          <DropdownMenuItem v-for="zoneId in otherZones" class="data-[highlighted]:bg-slate-200">
            {{ board.zones[zoneId].name }}
          </DropdownMenuItem>
        </DropdownMenuSubContent>
      </DropdownMenuSub>
      <DropdownMenuItem @click="signOut" class="data-[highlighted]:bg-slate-200"
        ><Icon icon="exit" />Sign Out</DropdownMenuItem
      >

      <DropdownMenuSeparator />

      <DropdownMenuItem
        class="text-red-400 data-[highlighted]:bg-slate-200"
        @click="deleteDialogToggle"
      >
        &otimes; Delete
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
        <Button @click="deleteDialogToggle" class="bg-red-500 hover:bg-red-400"
          >Confirm Delete</Button
        >
      </DialogFooter>
    </DialogContent>
  </Dialog>

  <Dialog v-model:open="assignDialogOpen">
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Assign Patient Out of Rotation</DialogTitle>
        <DialogDescription
          >Assigning the patient here will not affect the rotation.</DialogDescription
        >
      </DialogHeader>
      <DialogFooter>
        <DialogClose asChild><Button variant="outline">Cancel Delete</Button></DialogClose>
        <Button @click="assignDialogToggle">Confirm Delete</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
