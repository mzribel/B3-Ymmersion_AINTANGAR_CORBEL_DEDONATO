<template>
  <div class="create-group">
    <h3>Créer un Groupe</h3>

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
