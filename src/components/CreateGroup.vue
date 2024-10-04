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

      
      const groupsRef = ref(db, `groups`);
      const newGroupRef = push(groupsRef);

      set(newGroupRef, {
        name: this.groupName,
        createdBy: userId,
        members: [userId]
      });

      
      this.groupName = '';
    }
  }
};
</script>

<style scoped>
.create-group {
  margin: 1rem 0;
}
</style>
