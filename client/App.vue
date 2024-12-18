<script setup></script>

<template>
  <Auth>
    <template #auth>
      <Nav />
      <Board />
    </template>
    <template #noauth>
      <Login />
    </template>
  </Auth>
</template>
