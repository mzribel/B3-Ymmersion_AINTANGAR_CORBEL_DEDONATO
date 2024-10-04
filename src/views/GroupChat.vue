<template>
  <div class="group-chat">
    <h2>Groupe : {{ groupName }}</h2>
    <div class="messages">
      <div v-for="(message, index) in messages" :key="index" class="message">
        <strong>{{ message.username }}:</strong> {{ message.text }}
      </div>
    </div>
    <input v-model="newMessage" @keyup.enter="sendMessage" placeholder="Tapez votre message..." />
  </div>
</template>

<script>
import { ref, onValue, push } from 'firebase/database';
import { db } from '../firebase';
import { getAuth } from 'firebase/auth';

export default {
  data() {
    return {
      messages: [],
      newMessage: '',
      groupName: '',
      groupId: ''
    };
  },
  created() {
    const auth = getAuth();
    const user = auth.currentUser;

    this.groupId = this.$route.params.groupId;

    
    const messagesRef = ref(db, `groups/${this.groupId}/messages`);
    onValue(messagesRef, (snapshot) => {
      const data = snapshot.val();
      this.messages = data ? Object.values(data) : [];
    });

    const groupRef = ref(db, `groups/${this.groupId}`);
    onValue(groupRef, (snapshot) => {
      const data = snapshot.val();
      this.groupName = data ? data.name : 'Groupe inconnu';
    });
  },
  methods: {
    sendMessage() {
      if (this.newMessage.trim() === '') return;

      const auth = getAuth();
      const user = auth.currentUser;

      const messagesRef = ref(db, `groups/${this.groupId}/messages`);
      push(messagesRef, {
        text: this.newMessage,
        username: user.displayName || 'Anonyme',
        userId: user.uid,
        timestamp: Date.now()
      });

      this.newMessage = '';
    }
  }
};
</script>

<style scoped>
.group-chat {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.messages {
  flex: 1;
  overflow-y: auto;
  margin-bottom: 1rem;
}

.message {
  margin: 0.5rem 0;
}

input {
  padding: 0.5rem;
  border: 1px solid #ccc;
  width: 100%;
}
</style>
