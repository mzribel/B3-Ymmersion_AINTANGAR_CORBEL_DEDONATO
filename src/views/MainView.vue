<script setup>
import { getAuth, signOut } from 'firebase/auth';
import ConversationsList from '../components/ConversationsList.vue';
import CreateGroup from '../components/CreateGroup.vue';
import { ref } from 'vue';

const auth = getAuth();
const user = auth.currentUser;
const showCreateGroupForm = ref(false);

function toggleCreateGroupForm() {
  showCreateGroupForm.value = !showCreateGroupForm.value;
}

</script>

<template>
  <div>
    <h2>Bienvenue, {{ user.email }}</h2>
    <button @click="toggleCreateGroupForm">
      {{ showCreateGroupForm ? 'Fermer' : 'Créer un nouveau groupe' }}
    </button>

    <CreateGroup v-if="showCreateGroupForm" />
    <ConversationsList />
  </div>
</template>

<style scoped>

</style>
