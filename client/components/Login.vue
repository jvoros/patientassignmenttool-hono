<script setup>
import { ref } from "vue";
import { ofetch } from "ofetch";
import { store } from "../store.js";

const code = ref();
const error = ref();

const login = async () => {
  const res = await ofetch("/api/login", {
    method: "POST",
    body: { password: code.value },
  })
    .then(() => {
      store.logIn();
    })
    .catch((e) => {
      error.value = e.data;
      console.error(e.data);
    });
};
</script>
<template>
  <div>
    <h1>Login</h1>
    <p v-if="error">{{ error }}</p>
    <input v-model="code" />
    <button @click="login">Login</button>
  </div>
</template>
<style scoped>
div {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
input {
  padding: 10px;
  margin: 10px;
  border: 1px solid lightgray;
  border-radius: 8px;
  display: block;
  decoration: none;
}
</style>
