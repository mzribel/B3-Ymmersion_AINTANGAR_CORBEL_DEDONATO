<script setup>
import { ref as fbRef, onValue, push, get } from 'firebase/database';
import { db } from '../../firebase';
import { watch, ref, onMounted, inject } from 'vue';
import { useRoute } from 'vue-router';
import ChatComposable from '../../composables/ChatComposable.js';
import { getAuth } from 'firebase/auth';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';

const route = useRoute();
const { SendMessageToConversation, UpdateMessageInConversation, DeleteMessageFromConversation } = ChatComposable();

const chatID = ref(route.params.groupId);
const props = defineProps({
  conversationTitle: { type: String, required: false },
  conversationMessages: { type: Object, required: true },
  conversationMembers: { type: Object, required: false },
  otherUser: { type: Object, required: false }
});

const newMessage = ref('');
const user = inject('user');
const userID = getAuth().currentUser.uid;
const addingFile = ref(false);
const selectedFile = ref(null);
const editingMessage = ref(null);


watch(() => route.params.groupId, () => {
  chatID.value = route.params.groupId;
  newMessage.value = '';
});

watch(()=> props.conversationMessages, ()=> {
    scrollToChatBottom();
})

onMounted(()=> {
    scrollToChatBottom();
})

function handleFileUpload(event) {
  const file = event.target.files[0];
  if (file) {
    selectedFile.value = file;
    console.log('Fichier sélectionné :', file);
  }
}

async function sendMessage() {
  if (addingFile.value && selectedFile.value) {
    const storage = getStorage();
    const fileRef = storageRef(storage, `uploads/${selectedFile.value.name}`);
    const snapshot = await uploadBytes(fileRef, selectedFile.value);
    const downloadURL = await getDownloadURL(fileRef);

    await SendMessageToConversation(chatID.value, user.value.uid, newMessage.value, downloadURL);

    newMessage.value = '';
    selectedFile.value = null;
    addingFile.value = false;
  } else {
    if (await SendMessageToConversation(chatID.value, user.value.uid, newMessage.value)) {
      newMessage.value = '';
      scrollToChatBottom()
    }
  }
}

function toDate(seconds) {
  return new Date(seconds).toLocaleString();
}

function editMessage(message) {
  editingMessage.value = message.uid;
}


function saveEditedMessage(message, newText) {
  if (UpdateMessageInConversation(chatID.value, message.uid, userID, newText)) {
    editingMessage.value = null; 
  }
}

const scrollToChatBottom = (smooth=false) => {
  let latestMessage = document.getElementsByClassName("latest")[0];
  if (latestMessage) {
    latestMessage.scrollIntoView({behavior: smooth ? 'smooth' : 'instant'})
  }
}

</script>

<template>
  <div class="chat-component">
    <div v-if="otherUser" class="chat-header">

    </div>
    <div v-else class="chat-header">

    </div>
    <div class="chat-content">
      <div class="messages" v-if="conversationMembers && conversationMessages">
        <template v-for="(message, index) in conversationMessages" :key="index">
          <div class="message" :class="index+1 === conversationMessages.length ? 'latest' : null">
            <strong>{{ conversationMembers[message.sender] ? conversationMembers[message.sender].email : 'Ancien membre' }}:</strong>
            <img v-if="message.fileUrl" :src="message.fileUrl" alt="Image" width="100" />

            <template v-if="editingMessage === message.uid">
              <input v-model="message.text" @keyup.enter="saveEditedMessage(message, message.text)" />
            </template>
            <template v-else>
              {{ message.text }}
            </template>

            <template v-if="message.sender == userID">
              <button v-if="editingMessage === message.uid" @click="saveEditedMessage(message, message.text)">Save</button>
              <button v-else @click="editMessage(message)">Edit</button>
              <button @click="DeleteMessageFromConversation(chatID, message.uid, userID)">Delete</button>
            </template>

            <div>Posté à {{ toDate(message.sentAt) }}</div>
            <div v-if="message.lastEditedAt">Edité à {{ toDate(message.lastEditedAt) }}</div>
          </div>
        </template>
      </div>
    </div>
    <div class="chat-input-ctn">
          <div>
      <input v-model="newMessage" @keyup.enter="sendMessage" placeholder="Tapez votre message..." />
      <button @click="addingFile = !addingFile">
        <span v-if="!addingFile">Ajouter un fichier</span>
        <span v-else>Annuler l'ajout de fichier</span>
      </button>
      <input v-if="addingFile" type="file" @change="handleFileUpload" accept="image/*" />
    </div>

    </div>
  </div>

</template>


<style scoped lang="scss">

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
  margin-left: 10px;
}
</style>
