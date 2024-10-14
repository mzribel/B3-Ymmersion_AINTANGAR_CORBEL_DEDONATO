<script setup>
import { RouterLink } from "vue-router";
import { inject, ref } from 'vue';
import Profile from "./Profile.vue";

const user = inject('user');

const isProfileMenuOpen = ref(false);

const toggleUserMenu = () => {
  isProfileMenuOpen.value = !isProfileMenuOpen.value;
}
</script>

<template>
  <header>
    <nav>
      <div class="left" style="cursor: default">
        Ymmersion B3 INFODEV ♥
      </div>
      <div class="right">
        <template v-if="!user">
          <RouterLink v-if="!user" to="/login">Login</RouterLink>
          <RouterLink v-if="!user" to="/register">Register</RouterLink>
        </template>

        <template v-else>
          <button class="user-profile-btn" @click="toggleUserMenu">
            <img v-if="user.photoURL" :src="user.photoURL" alt="Photo de profil"/>
            <img v-else src="../assets/img/user_placeholder.png" alt=""  />
          </button> <div v-if="isProfileMenuOpen" class="profile-menu">
            <Profile :userUid="user.uid" />
          </div>
          <RouterLink v-if="user" to="/logout">Logout</RouterLink>
         
        </template>
      </div>
    </nav>
  </header>
</template>

<style scoped>
.profile-menu {
  position: fixed;
  top: 50px;
  right: 0;
  z-index: 100;
  border-radius: 5px;
}

.user-profile-btn {
  border: none;
  background-color: transparent;
  cursor: pointer;
}

.user-profile-btn img {
  aspect-ratio: 1;
  height: 40px;
  border-radius: 50%;
}
</style>
