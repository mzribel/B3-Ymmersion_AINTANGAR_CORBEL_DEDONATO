<template>
  <div class="conversations-list">
    <h3>Vos Groupes</h3>
    <ul>
      <li v-for="group in groups" :key="group.id">
        {{ group.name }}
      </li>
    </ul>
  </div>
</template>

<script>
import { ref, onValue } from 'firebase/database';
import { db } from '../firebase';
import { getAuth } from 'firebase/auth';

export default {
  data() {
    return {
      groups: []
    };
  },
  created() {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      const userGroupsRef = ref(db, `users/${user.uid}/groups`);
      onValue(userGroupsRef, (snapshot) => {
        const data = snapshot.val();
        this.groups = Object.keys(data || {}).map(key => ({
          id: key,
          name: data[key].name
        }));
      });
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
  margin: 10px 0;
}
</style>
