<script setup>
import Toaster from "./shadcn-vue/components/sonner";
import { useSocket } from "./use";

const socket = useSocket();
</script>

<template>
  <Auth>
    <template #auth>
      <Toaster position="top-center" richColors />
      <BoardView />
    </template>
    <template #noauth>
      <Login />
    </template>
  </Auth>
</template>
