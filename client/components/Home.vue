<script setup>
import { ofetch } from "ofetch";
import { store } from "../store.js";

const logout = async () => {
  const res = await ofetch("/api/logout", {
    method: "POST",
  })
    .then(() => {
      store.logOut();
    })
    .catch((e) => {
      console.error(e.data);
    });
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
      <Button @click="logout">Logout <Icon icon="logout" /></Button>
    </nav>
  </Container>
</template>
