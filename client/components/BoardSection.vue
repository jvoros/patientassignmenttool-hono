<script setup>
defineProps(["title"]);
</script>
<template>
  <div>
    <BoardHeader>{{ title }}</BoardHeader>
    <div><slot /></div>
  </div>
</template>
