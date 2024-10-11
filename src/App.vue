<template>
  <Navbar></Navbar>
  <RouterView />
</template>

<script setup>
import { ref, provide } from "vue";
import UserComposable from "./composables/UserComposable.js"
import Navbar from "./components/Navbar.vue";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const { GetCurrentUserData, GetAllUsers } = UserComposable();

const user = ref();
provide("user", user)

const auth = getAuth();
onAuthStateChanged(auth, async (u) => {
  if (u) {
    user.value = await GetCurrentUserData(u.uid);;
  }
});

</script>

<style lang="scss">
@import "assets/css/main.scss";
</style>
