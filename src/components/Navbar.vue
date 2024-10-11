<script setup>
import {RouterLink} from "vue-router";
import { inject } from 'vue';

const user = inject('user');
</script>

<template>
  <header>
      <nav>
        <div class="left">
          <RouterLink to="/">Home</RouterLink>
          <RouterLink to="/chat">Chat</RouterLink>
        </div>
        <div class="right">
          <template v-if="!user">
            <RouterLink v-if="!user" to="/login">Login</RouterLink>
            <RouterLink v-if="!user" to="/register">Register</RouterLink>
          </template>
          <template v-else>
            <div>{{ user.email }}</div>
            <RouterLink v-if="user" to="/logout">Logout</RouterLink>
          </template>
        </div>
      </nav>
  </header>
</template>

<style scoped>
</style>