<script setup>
import { onBeforeMount } from "vue";
import { store } from "../store.js";
import HelloWorld from "./HelloWorld.vue";

onBeforeMount(() => {
  store.checkLogin();
});
</script>
<template>
  <slot name="auth" v-if="store.loggedIn"></slot>
  <slot name="noauth" v-else></slot>
</template>
