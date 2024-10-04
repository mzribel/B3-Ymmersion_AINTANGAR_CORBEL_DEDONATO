<template>
  <div class="users-list">
    <h3>Utilisateurs</h3>
    <ul>
      <li v-for="user in users" :key="user.id">
        <a @click="startConversation(user.id)">
          {{ user.username }}
        </a>
      </li>
    </ul>
  </div>
</template>

<script>
import { ref, onValue } from 'firebase/database';
import { db } from '../firebase';

export default {
  data() {
    return {
      users: []
    };
  },
  mounted() {
    this.fetchUsers();
  },
  methods: {
    fetchUsers() {
      const usersRef = ref(db, `users`);
      
      onValue(usersRef, snapshot => {
        const usersData = snapshot.val();
        this.users = [];
        for (let key in usersData) {
          this.users.push({ id: key, username: usersData[key].username });
        }
      });
    },
    startConversation(userId) {
      this.$emit('start-conversation', userId);
    }
  }
};
</script>

<style scoped>
.users-list {
  margin: 1rem;
}
</style>
