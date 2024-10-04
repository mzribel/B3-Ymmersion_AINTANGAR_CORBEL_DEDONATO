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

function logout() {
  signOut(auth)
    .then(() => {
      console.log('Utilisateur déconnecté');
      window.location.href = '/login';  // Rediriger vers la page de connexion après déconnexion
    })
    .catch((error) => {
      console.error('Erreur lors de la déconnexion:', error);
    });
}
</script>

<template>
  <div>
    <h2>Bienvenue, {{ user.displayName }}</h2>
    <button @click="logout">Déconnexion</button>
    <button @click="toggleCreateGroupForm">
      {{ showCreateGroupForm ? 'Fermer' : 'Créer un nouveau groupe' }}
    </button>

    <CreateGroup v-if="showCreateGroupForm" />
    <ConversationsList />
  </div>
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
