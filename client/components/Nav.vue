<script setup>
import { ofetch } from "ofetch";
import { auth } from "../stores/auth.js";
import { useColorMode } from "@vueuse/core";

const mode = useColorMode({ disableTransition: false });

const toggleMode = () => {
  mode.value = mode.value === "light" ? "dark" : "light";
};

const logout = async () => {
  auth.logout();
};
</script>
<template>
  <Container class="border-b">
    <nav class="flex justify-between items-center py-4">
      <div class="flex gap-2 items-center">
        <img src="/assets/pat.svg" alt="Patient Assignment Tool Logo" class="w-12" />
        <h1 class="font-bold text-2xl">
          Patient Assignement Tool <span class="text-xs font-light text-slate-500">v0.1.0</span>
        </h1>
      </div>
      <div class="flex gap-4 items-center">
        <div><a href="#" class="text-sm hover:underline">Quick Reference</a></div>
        <PopoverAddProvider />
        <Button variant="secondary" @click="logout">Logout <Icon icon="logout" /></Button>
        <Button @click="toggleMode" variant="outline" size="icon">
          <Icon :icon="mode === 'light' ? 'moon' : 'sun'" />
        </Button>
      </div>
    </nav>
  </Container>
</template>
