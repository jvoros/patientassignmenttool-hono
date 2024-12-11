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
  <div>
    <h1 class="mb-8 bg-slate-600">Home</h1>
    <button @click="logout">Logout</button>
    <Button>Shadcn</Button>
  </div>
  <Card>
    <CardHeader>
      <CardTitle>Card Title</CardTitle>
    </CardHeader>
    <CardContent>Content</CardContent>
    <CardFooter>Footer</CardFooter>
  </Card>
</template>
