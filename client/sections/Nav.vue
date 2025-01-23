<script setup>
import { useColorMode } from "@vueuse/core";
import auth from "../stores/auth.js";

// dark mode
const mode = useColorMode({ disableTransition: false });
const toggleMode = () => {
  mode.value = mode.value === "light" ? "dark" : "light";
};

const logout = async () => {
  auth.logout();
};
</script>
<template>
  <Container class="py-4">
    <nav class="flex items-center justify-between py-4">
      <div class="flex items-center gap-2">
        <img src="/assets/pat.svg" alt="Patient Assignment Tool Logo" class="w-12" />
        <h1 class="text-2xl font-bold">
          Patient Assignment Tool <span class="text-xs font-light text-slate-500">v1.0.0</span>
        </h1>
      </div>
      <div class="flex items-center gap-4">
        <div><a href="#" class="text-sm hover:underline">Quick Reference</a></div>
        <PopoverAddProvider />
        <Button variant="secondary" @click="logout">Logout <Icon icon="logout" /></Button>
        <Button @click="toggleMode" variant="outline" size="icon">
          <Icon :icon="darkMode === false ? 'moon' : 'sun'" />
        </Button>
      </div>
    </nav>
  </Container>
</template>
