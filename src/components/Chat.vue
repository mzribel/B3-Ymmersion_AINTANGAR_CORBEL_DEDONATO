<template>
  <div class="chat">
    <h2>{{ conversationTitle }}</h2>
    <div class="messages">
      <div v-for="(message, index) in messages" :key="index" class="message">
        <strong>{{ message.senderName }}:</strong> {{ message.text }}
      </div>
    </div>
    <input 
      v-model="newMessage" 
      @keyup.enter="sendMessage" 
      placeholder="Tapez votre message..." 
    />
  </div>
</template>

<script>
import { ref, onValue, push } from 'firebase/database'; // Utilise les méthodes de Firebase
import { db } from '../firebase'; // Base de données Firebase

export default {
  props: {
    conversationId: {
      type: String,
      required: true
    },
    isGroup: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      messages: [],  // Liste des messages de la conversation
      newMessage: '',  // Nouveau message à envoyer
      conversationTitle: '',  // Titre de la conversation
      username: 'Anonyme'  // Nom d'utilisateur par défaut (à modifier selon l'authentification)
    };
  },
  watch: {
    // Charger les messages à chaque fois que la conversation change
    conversationId: {
      immediate: true,
      handler(newConversationId) {
        this.loadMessages(newConversationId);
      }
    }
  },
  methods: {
    // Fonction pour charger les messages en fonction de la conversation sélectionnée
    async loadMessages(conversationId) {
      this.messages = [];  // Réinitialiser les messages

      let messagesRef;

      if (this.isGroup) {
        messagesRef = ref(db, `groups/${conversationId}/messages`);
        const groupTitleRef = ref(db, `groups/${conversationId}/name`);
        onValue(groupTitleRef, (snapshot) => {
          this.conversationTitle = snapshot.val();
        });
      } else {
        messagesRef = ref(db, `privateMessages/${conversationId}`);
        this.conversationTitle = "Conversation privée";  // Peut être personnalisé en fonction des utilisateurs
      }

      // Récupérer les messages en temps réel
      onValue(messagesRef, (snapshot) => {
        const messages = snapshot.val();
        this.messages = [];
        for (let key in messages) {
          this.messages.push(messages[key]);
        }
      });
    },
    // Envoyer un nouveau message
    sendMessage() {
      if (this.newMessage.trim() === '') return;

      let messagesRef;
      if (this.isGroup) {
        messagesRef = ref(db, `groups/${this.conversationId}/messages`);
      } else {
        messagesRef = ref(db, `privateMessages/${this.conversationId}`);
      }

      push(messagesRef, {
        text: this.newMessage,
        sender: this.username,
        timestamp: Date.now()
      });

      this.newMessage = ''; // Vider l'input
    }
  }
};
</script>

<style scoped>
.chat {
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
