<script setup>
import { onBeforeMount } from "vue";
import auth from "../stores/auth.js";

onBeforeMount(() => {
  auth.checkLogin();
});
</script>
<template>
  <slot name="auth" v-if="auth.loggedIn"></slot>
  <slot name="noauth" v-else></slot>
</template>
