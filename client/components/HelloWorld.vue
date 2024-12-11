<script setup>
import { ref } from "vue";
import { ofetch } from "ofetch";
import { store } from "../store.js";

defineProps({
  msg: String,
});

const count = ref(0);
const x = ref();

const testLogin = async () => {
  const res = await ofetch("/api/login", {
    method: "POST",
    body: { password: "7800" },
  }).catch((e) => {
    console.error(e.data);
  });
  x.value = res;
  store.logIn();
};

const testHono = async () => {
  const res = await ofetch("/api/hello");
  x.value = res;
};

const testLogout = async () => {
  const res = await ofetch("/api/logout", {
    method: "POST",
  });
  x.value = res;
  store.logOut();
};

const getCookie = async () => {
  console.log(document.cookie);
};
</script>

<template>
  <h1>{{ msg }}</h1>
  <h2>API Response: {{ x }}</h2>
  <p><button @click="testHono">Test Hono</button></p>
  <p><button @click="testLogin">Test Login</button></p>
  <p><button @click="testLogout">Test Logout</button></p>
  <p><button @click="getCookie">Test Cookie</button></p>

  <div class="card">
    <button type="button" @click="count++">count is {{ count }}</button>
    <p>
      Edit
      <code>components/HelloWorld.vue</code> to test HMR
    </p>
  </div>

  <p>
    Check out
    <a href="https://vuejs.org/guide/quick-start.html#local" target="_blank">create-vue</a>, the
    official Vue + Vite starter
  </p>
  <p>
    Learn more about IDE Support for Vue in the
    <a href="https://vuejs.org/guide/scaling-up/tooling.html#ide-support" target="_blank"
      >Vue Docs Scaling up Guide</a
    >.
  </p>
  <p class="read-the-docs">Click on the Vite and Vue logos to learn more</p>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
