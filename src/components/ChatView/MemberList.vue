<script setup>
import { ref as fbRef, onValue, get } from 'firebase/database';
import { db } from '../../firebase';
import {ref, watch} from "vue";
import {useRoute} from "vue-router";

// const props = defineProps({
//   groupID: {type: String, required: true}
// })

const route = useRoute();
const members = ref([]);
const loading = ref(true);
const errorMessage = ref("");
const chatID = ref(route.params.groupId);


fetchGroupMembers(chatID.value);

async function fetchGroupMembers(groupId) {
    try {
      const groupMembersRef = fbRef(db, `conversations/${groupId}/members`);
      // Récupérer la liste des membres du groupe
      onValue(groupMembersRef, async (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const memberIds = Object.values(data);  // Récupérer les IDs des membres
          // Parcourir chaque membre et récupérer les infos associées
          members.value = await Promise.all(memberIds.map(async (uid) => {
            const userRef = fbRef(db, `users/${uid}`);
            const userSnapshot = await get(userRef);
            return userSnapshot.val();
          }));
        } else {
          members.value = [];  // Aucun membre trouvé
        }
        loading.value = false;
      }, (error) => {
        errorMessage.value = `Erreur lors de la récupération des membres : ${error.message}`;
        loading.value = false;
      });
    } catch (error) {
      errorMessage.value = `Erreur : ${error.message}`;
      loading.value = false;
    }
  }

watch(() => route.params.groupId, () => {
    chatID.value = route.params.groupId;
    fetchGroupMembers(chatID.value)
})

</script>

<template>
  <div class="members-list">
    <h3>Membres du groupe</h3>
    <ul v-if="members.length > 0">
      <li v-for="member in members" :key="member.id">
        {{ member.displayName || member.email }}
      </li>
    </ul>
    <p v-if="loading">Chargement des membres...</p>
    <p v-if="errorMessage">{{ errorMessage }}</p>
    <p v-if="!loading && members.length === 0">Aucun membre dans ce groupe.</p>
  </div>
</template>

<style scoped>

</style>