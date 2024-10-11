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

<script>
import { ref, onValue, get } from 'firebase/database';
import { db } from '../firebase';

export default {
  props: {
    groupId: {
      type: String,
      required: true,
    }
  },
  data() {
    return {
      members: [],        
      loading: true,    
      errorMessage: '', 
    };
  },
  created() {
    if (this.groupId) {
      this.fetchGroupMembers(this.groupId);
    }
  },
  methods: {
    async fetchGroupMembers(groupId) {
      try {
        const groupMembersRef = ref(db, `groups/${groupId}/members`);

        onValue(groupMembersRef, async (snapshot) => {
          const data = snapshot.val();
          if (data) {
            const memberIds = Object.values(data);

            this.members = await Promise.all(memberIds.map(async (uid) => {
              const userRef = ref(db, `users/${uid}`);
              const userSnapshot = await get(userRef);
              return userSnapshot.val();
            }));
          } else {
            this.members = [];
          }
          this.loading = false;
        }, (error) => {
          this.errorMessage = `Erreur lors de la récupération des membres : ${error.message}`;
          this.loading = false;
        });
      } catch (error) {
        this.errorMessage = `Erreur : ${error.message}`;
        this.loading = false;
      }
    }
  }
};
</script>

<style scoped>
ul {
  list-style: none;
  padding: 0;
}

li {
  margin: 5px 0;
}
</style>
