<script setup>
defineProps(["zones"]);
</script>
<template>
  <div v-for="zone in zones">
    <Zone :zone="zone">
      <template #instruction>
        <InstructionBox v-if="zone.instruction">
          {{ zone.instruction }}
        </InstructionBox>
      </template>
    </Zone>
  </div>
</template>
