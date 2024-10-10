<template>
  <div class="group-chat">
    <h2>Groupe : {{ groupName }}</h2>
    <div class="messages">
      <div v-for="(message, index) in messages" :key="index" class="message">
        <strong>{{ message.username }}:</strong> {{ message.text }}
        
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
          placeholder="Tapez votre message ici..." 
          class="message-input"
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
import { ref, onValue, push, update, remove } from 'firebase/database';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db } from '../firebase';
import { getAuth } from 'firebase/auth';

export default {
  data() {
    return {
      messages: [],
      newMessage: '',
      groupName: '',
      groupId: '',
      selectedFile: null
    };
  },
  created() {
    const auth = getAuth();
    const user = auth.currentUser;

    this.groupId = this.$route.params.groupId;

    
    const messagesRef = ref(db, `groups/${this.groupId}/messages`);
    onValue(messagesRef, (snapshot) => {
      const data = snapshot.val();
      this.messages = []; 
      if (data) {
        Object.keys(data).forEach((key) => {
          this.messages.push({ ...data[key], id: key });
        });
      }
    });

    const groupRef = ref(db, `groups/${this.groupId}`);
    onValue(groupRef, (snapshot) => {
      const data = snapshot.val();
      this.groupName = data ? data.name : 'Groupe inconnu';
    });

  },
  methods: {
    handleFileUpload(event) {
      const file = event.target.files[0];
      if (file) {
        this.selectedFile = file;
        console.log("Fichier sélectionné :", file);
      }    
    },

    sendMessage() {
      const auth = getAuth();
      const user = auth.currentUser;
      const messageData = {
        text: this.newMessage.trim(),
        username: user.email,
        userId: user.uid,
        timestamp: Date.now(),
      };

      const messagesRef = ref(db, `groups/${this.groupId}/messages`);
      if (this.selectedFile) {
        const storage = getStorage();
        const fileRef = storageRef(storage, `uploads/${this.selectedFile.name}`);

        uploadBytes(fileRef, this.selectedFile)
          .then((snapshot) => {
            console.log("Fichier téléchargé avec succès :", snapshot);
            return getDownloadURL(fileRef);
          })
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
          push(messagesRef, messageData)
          this.newMessage = '';
        }
    },


    editMessage(index) {
      const message = this.messages[index];
      const newText = prompt('Modifier le message :', message.text);

      if (newText && newText.trim() !== '') {
        const messageRef = ref(db, `groups/${this.groupId}/messages/${message.id}`);
        update(messageRef, {
          text: newText
        }).then(() => {
          console.log("Message modifié avec succès");
        }).catch((error) => {
          console.error("Erreur lors de la modification du message :", error);
        });
      }
      const fileInput = document.createElement('input');
      fileInput.type = 'file';
      fileInput.accept = 'image/*';
      fileInput.onchange = (event) => {
        const file = event.target.files[0];
        if (file) {
          const storage = getStorage();
          const fileRef = storageRef(storage, `uploads/${file.name}`);
          uploadBytes(fileRef, file)
            .then((snapshot) => {
              console.log("Fichier téléchargé avec succès :", snapshot);
              return getDownloadURL(fileRef);
            })
            .then((downloadURL) => {
              update(messageRef, { fileUrl: downloadURL });
            })
            .catch((error) => {
              console.error("Erreur lors du téléchargement du fichier :", error);
            });
        }
      };
      fileInput.click();
    },

    deleteMessage(index) {
      const message = this.messages[index];
      const isConfirmed = confirm('Voulez-vous vraiment supprimer ce message ?');

      console.log("Message à supprimer :", message); 

      if (!message || !message.id) {
        console.error("ID du message est manquant !");
        return; 
      }
      console.log("Référence pour suppression :", `groups/${this.groupId}/messages/${message.id}`); // Log avant suppression

      if (isConfirmed) {
        const messageRef = ref(db, `groups/${this.groupId}/messages/${message.id}`);
        remove(messageRef)
          .then(() => {
            console.log("Message supprimé avec succès");
          })
          .catch((error) => {
            console.error("Erreur lors de la suppression du message :", error);
          });
      }
    },


    updateMessages(snapshot) {
      const data = snapshot.val();
      this.messages = []; 

      if (data) {
        Object.keys(data).forEach((key) => {
          this.messages.push({ ...data[key], id: key });
        });
      }
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
  padding: 10px;
  border: 1px solid #ccc;
  width: 60%;
  margin: 10px 0;
}
.spacing {
  margin: 10px;
  width: 70px;
}
.crud {
  margin: 10px;
}

.input-wrapper {
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  align-items: center;
}

</style>
