<template>
  <Navbar></Navbar>
  <RouterView />
</template>

<script setup>
import {watch, ref, provide} from "vue";
import {useRoute, useRouter} from "vue-router";
import UserComposable from "./composables/UserComposable.js"
import Navbar from "./components/Navbar.vue";
import {getAuth, onAuthStateChanged} from "firebase/auth";
const route = useRoute();

const { GetCurrentUserData } = UserComposable();

const user = ref();
provide("user", user)


const router = useRouter();
const auth = getAuth();
onAuthStateChanged(auth, async (u) => {
  if (u) {
    const test = await GetCurrentUserData("Sa4ctDv12AQNzWIC8bMM24fnlzR2");
    console.log(test)
    user.value = test;
  }
});

</script>

<style lang="scss">
@import "assets/css/main.scss";
</style>
