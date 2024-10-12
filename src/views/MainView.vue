<script setup>
import { getAuth, signOut } from 'firebase/auth';
import ConversationsList from '../components/ConversationsList.vue';
import CreateGroup from '../components/CreateGroup.vue';
import { ref } from 'vue';
import Profile from "../components/Profile.vue";

const auth = getAuth();
const user = auth.currentUser;
const showCreateGroupForm = ref(false);

function toggleCreateGroupForm() {
  showCreateGroupForm.value = !showCreateGroupForm.value;
}

</script>

<template>
  <h2>Bienvenue, {{ user.email }}</h2>
  <Profile :userUid="user.uid" />
  
</template>

<style scoped>
h2 {
  margin-bottom: 1rem;
}

button {
  margin-bottom: 1rem;
  display: block;
}

</style>
