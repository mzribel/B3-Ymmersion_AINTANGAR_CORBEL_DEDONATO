<template>
  <div class="create-group">
    <h3>Créer un Groupe</h3>
    <form @submit.prevent="CreateGroupConversation(user.uid, groupName)">
      <input v-model="groupName" type="text" placeholder="Nom du groupe" required />
      <button type="submit">Créer</button>
    </form>
  </div>
</template>

<script setup>
import { ref as fbRef, push, set } from 'firebase/database';
import { db } from '../firebase';
import { getAuth } from 'firebase/auth';
import ChatComposable from "../composables/ChatComposable.js"
import {inject, ref} from "vue";
const { CreateGroupConversation } = ChatComposable();
const user = inject("user");


const groupName = ref("");
</script>

<style scoped>
.create-group {
  margin: 1rem 0;
}
</style>
