<script setup>
import { useSite } from "&";
const site = useSite();
</script>
<template>
  <BoardHeader>Timeline</BoardHeader>
  <InstructionBox> Click provider or room number to change. </InstructionBox>
  <TimelineLine>
    <template v-for="(event, index) in site.getTimeline()">
      <TimelineNode :event="event" />
      <TimelineUndo v-if="index === 0" />
    </template>
  </TimelineLine>
</template>
