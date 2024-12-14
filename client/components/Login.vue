<script setup>
import { ref } from "vue";
import { ofetch } from "ofetch";
import { auth } from "../stores/auth.js";

const code = ref();
const site = ref("smh");
const error = ref();

const login = async (e) => {
  e.preventDefault();
  try {
    await auth.login(code.value, site.value);
  } catch (e) {
    error.value = e.message;
  }
};
</script>
<template>
  <form>
    <Card class="w-full max-w-sm mx-auto mt-12">
      <CardHeader>
        <img src="/assets/pat.svg" alt="Patient Assignment Tool Logo" class="w-24 mb-4" />
        <CardTitle class="text-4xl font-bold">Welcome to the Rotation.</CardTitle>
      </CardHeader>
      <CardContent class="grid gap-4">
        <div class="grid gap-2">
          <Label for="code"
            >Access Code
            <span v-if="error" class="text-red-500 text-sm float-right">{{ error }}</span>
          </Label>
          <Input id="code" type="password" v-model="code" />
        </div>
      </CardContent>
      <CardFooter>
        <Button class="w-full" type="submit" @click="login">Login</Button>
      </CardFooter>
    </Card>
  </form>
</template>
