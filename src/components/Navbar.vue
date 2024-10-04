<script setup>

import {RouterLink} from "vue-router";
</script>

<template>
  <header>
      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/login">Login</RouterLink>
        <RouterLink to="/register">Register</RouterLink>
        <RouterLink to="/logout">Logout</RouterLink>
      </nav>
  </header>
</template>

<style scoped>

</style>