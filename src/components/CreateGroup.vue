<template>
  <div class="create-group">
    <h3>Créer un Groupe</h3>
    <form @submit.prevent="createGroup">
      <input v-model="groupName" type="text" placeholder="Nom du groupe" required />
      <button type="submit">Créer</button>
    </form>
  </div>
</template>

<script>
import { ref, push, set } from 'firebase/database';
import { db } from '../firebase';
import { getAuth } from 'firebase/auth';

export default {
  data() {
    return {
      groupName: ''
    };
  },
  methods: {
    createGroup() {
      const auth = getAuth();
      const user = auth.currentUser;
      const userId = user.uid;

      if (this.groupName.trim() === '') return;

      // Créer le groupe dans la base de données
      const groupsRef = ref(db, `groups`);
      const newGroupRef = push(groupsRef);

      newGroupRef.set({
        name: this.groupName,
        createdBy: userId,
        members: [userId]
      });

      // Ajouter le groupe à l'utilisateur connecté
      const userGroupsRef = ref(db, `users/${userId}/groups/${newGroupRef.key}`);
      set(userGroupsRef, { name: this.groupName });

      this.groupName = '';  // Réinitialiser l'input
    }
  }
};
</script>

<style scoped>
.create-group {
  margin: 1rem 0;
}
</style>
