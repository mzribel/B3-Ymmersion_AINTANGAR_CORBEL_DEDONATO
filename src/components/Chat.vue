<template>
  <div class="chat">
    <h2>{{ conversationTitle }}</h2>
    <div class="messages">
      <div v-for="(message, index) in messages" :key="index" class="message">
        <strong>{{ message.senderName }}:</strong> {{ message.text }}

        <img v-if="message.fileUrl" :src="message.fileUrl" alt="Image" width="100" />
        <button class="crud" @click="editMessage(index)">Modifier</button>
        <button class="crud" @click="deleteMessage(index)">Supprimer</button>
        
      </div>
    </div>
    <div class="input-container">
      <div class="input-wrapper">
        <input type="file" @change="handleFileUpload" />

        <input 
          v-model="newMessage" 
          @keyup.enter="sendMessage" 
          placeholder="Tapez votre message..." 
        />
        <button 
          @click="sendMessage()" 
          class="spacing">
          <span>Envoyer</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onValue, push } from 'firebase/database';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';

import { db } from '../firebase'; 
import { getAuth } from 'firebase/auth';

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
      username: 'Anonyme',
      selectedFile: null
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
        messagesRef = ref(db, `groups/${conversationId}/messages`);
        const groupTitleRef = ref(db, `groups/${conversationId}/name`);
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
          this.messages.push({ ...messages[key], id: key }); 
        }
      });

    },
    
    handleFileUpload(event) {
      const file = event.target.files[0];
      if (file) {
        this.selectedFile = file;
        console.log("Fichier sélectionné :", file);
      }
    },

    sendMessage() {
      if (this.newMessage.trim() === '' && !this.selectedFile) return;

      const auth = getAuth();
      const user = auth.currentUser;
      const messageData = {
        text: this.newMessage.trim(),
        senderName: user.displayName || 'Anonyme',
        timestamp: Date.now(),
      };

      let messagesRef;
      if (this.isGroup) {
        messagesRef = ref(db, `groups/${this.conversationId}/messages`);
      } else {
        messagesRef = ref(db, `privateMessages/${this.conversationId}`);
      }

      if (this.selectedFile) {
        const storage = getStorage();
        const fileRef = storageRef(storage, `uploads/${this.selectedFile.name}`);

        uploadBytes(fileRef, this.selectedFile)
          .then(() => getDownloadURL(fileRef))
          .then((downloadURL) => {
            messageData.fileUrl = downloadURL;  
            if (!this.newMessage.trim()) {
              delete messageData.text;
            }
            return push(messagesRef, messageData);
          })
          .then(() => {
            this.newMessage = '';
            this.selectedFile = null;  
          })
          .catch((error) => {
            console.error("Erreur lors du téléchargement du fichier :", error);
          });
      } else if (this.newMessage.trim() !== '') {
        push(messagesRef, messageData);
        this.newMessage = '';  
      }
    },

    editMessage(index) {
      this.newMessage = this.messages[index].text;
      this.editIndex = index;
    },

    updateMessage() {
      if (this.editIndex !== null && this.newMessage.trim() !== '') {
        const messageId = this.messages[this.editIndex].id; 
        const messageRef = ref(db, `groups/${this.conversationId}/messages/${messageId}`);

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
      const messageRef = ref(db, `groups/${this.conversationId}/messages/${messageId}`);

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
/* input {
  padding: 0.5rem;
  border: 1px solid #ccc;
  width: 100%;
} */
input {
  padding: 10px;
  border: 1px solid #ccc;
  width: 60%;
  margin: 10px 0;
}
button {
  margin-left: 0.5rem;
  padding: 0.25rem 0.5rem;
  width: 100px;
  font-size: 0.8rem;
  height: 50px;
}
.input-wrapper {
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  align-items: center;
}
.spacing {
  margin: 10px;
  width: 70px;
}

</style>
