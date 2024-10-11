<template>
  <div class="chat">
    <h2>{{ conversationTitle }}</h2>
    <div class="messages">
      <div v-for="(message, index) in messages" :key="index" class="message">
        <strong>{{ message.sender }}:</strong> {{ message.text }}
        
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
import { ref, onValue, push } from 'firebase/database';
import { db } from '../firebase'; 


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
      messages: [], 
      newMessage: '', 
      conversationTitle: '',
      displayName: 'Anonyme'
    };
  },
  watch: {
    conversationId: {
      immediate: true,
      handler(newConversationId) {
        this.loadMessages(newConversationId);
      }
    }
  },
  methods: {
    async loadMessages(conversationId) {
      this.messages = []; 

      let messagesRef;

      if (this.isGroup) {
        messagesRef = ref(db, `conversations/${conversationId}/messages`);
        const groupTitleRef = ref(db, `conversations/${conversationId}/name`);
        onValue(groupTitleRef, (snapshot) => {
          this.conversationTitle = snapshot.val();
        });
      } else {
        messagesRef = ref(db, `privateMessages/${conversationId}`);
        this.conversationTitle = "Conversation privée"; 
      }

      
      onValue(messagesRef, (snapshot) => {
        const messages = snapshot.val();
        this.messages = [];
        for (let key in messages) {
          this.messages.push({ ...messages[key], id: key }); // Ajoutez l'id du message ici
        }
      });

    },
    
    sendMessage() {
      if (this.newMessage.trim() === '') return;

      let messagesRef;
      if (this.isGroup) {
        messagesRef = ref(db, `conversations/${this.conversationId}/messages`);
      } else {
        messagesRef = ref(db, `privateMessages/${this.conversationId}`);
      }

      push(messagesRef, {
        text: this.newMessage,
        sender: this.displayName,
        timestamp: Date.now()
      });

      this.newMessage = '';
    },

    editMessage(index) {
      this.newMessage = this.messages[index].text;
      this.editIndex = index;
    },

    updateMessage() {
      if (this.editIndex !== null && this.newMessage.trim() !== '') {
        const messageId = this.messages[this.editIndex].id; 
        const messageRef = ref(db, `conversations/${this.conversationId}/messages/${messageId}`);

        update(messageRef, { text: this.newMessage })
          .then(() => {
            console.log('Message mis à jour avec succès');
            this.newMessage = '';
            this.editIndex = null; 
          })
          .catch(error => {
            console.error("Erreur lors de la mise à jour du message:", error);
        });
      }

    }, 

    deleteMessage(index) {
      const messageId = this.messages[index].id; 
      const messageRef = ref(db, `conversations/${this.conversationId}/messages/${messageId}`);

      remove(messageRef)
        .then(() => {
          console.log('Message supprimé avec succès');
        })
        .catch(error => {
          console.error("Erreur lors de la suppression du message:", error);
      });
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
button {
  margin-left: 0.5rem;
  padding: 0.25rem 0.5rem;
  width: 100px;
  font-size: 0.8rem;
  height: 50px;
}
</style>
