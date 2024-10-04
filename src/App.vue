<script setup>
  import {getAuth} from "firebase/auth";
  const auth = getAuth();
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <RouterView />
</template>

<style scoped>

</style>
