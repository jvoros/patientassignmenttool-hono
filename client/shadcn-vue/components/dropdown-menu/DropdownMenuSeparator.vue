<script setup>
import { cn } from "@/lib/utils";
import { DropdownMenuSeparator } from "radix-vue";
import { computed } from "vue";

const props = defineProps({
  asChild: { type: Boolean, required: false },
  as: { type: null, required: false },
  class: { type: null, required: false },
});

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props;

  return delegated;
});
</script>

<template>
  <DropdownMenuSeparator v-bind="delegatedProps" :class="cn('-mx-1 h-px bg-muted', props.class)" />
</template>
