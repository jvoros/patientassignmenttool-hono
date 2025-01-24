<script setup></script>

<template>
  <Auth>
    <template #auth>
      <BoardView />
    </template>
    <template #noauth>
      <Login />
    </template>
  </Auth>
</template>
