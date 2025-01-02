<script setup></script>

<template>
  <Auth>
    <template #auth>
      <Nav />
      <BoardView />
    </template>
    <template #noauth>
      <Login />
    </template>
  </Auth>
</template>
