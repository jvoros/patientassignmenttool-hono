<script setup></script>

<template>
  <Auth>
    <template #auth>
      <Home />
    </template>
    <template #noauth>
      <Login />
    </template>
  </Auth>
</template>
