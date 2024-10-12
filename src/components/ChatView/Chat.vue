<script setup>
import {ref as fbRef, onValue, push, get} from 'firebase/database';
import { db } from '../../firebase';
import {watch, ref, onMounted, inject} from "vue";
import {useRoute} from "vue-router";
const route = useRoute()
import ChatComposable from "../../composables/ChatComposable.js";
import {getAuth} from "firebase/auth";

const { SendMessageToConversation, UpdateMessageInConversation, DeleteMessageFromConversation } = ChatComposable();

const chatID = ref(route.params.groupId);
const props = defineProps({
  conversationTitle: {type: String, required: false},
  conversationMessages: {type: Object, required: true},
  conversationMembers: {type: Object, required: false},
})

const messages = ref(props.conversationMessages);
const newMessage = ref("");
const chatTitle = ref("")
const members = ref([]);
const user = inject("user")
const userID = getAuth().currentUser.uid;
const editingMessage = ref(null); // Référence pour stocker l'ID du message en cours d'édition

watch(() => route.params.groupId, () => {
    chatID.value = route.params.groupId;
    newMessage.value = "";
})

function sendMessage() {
  if (SendMessageToConversation(chatID.value, user.value.uid, newMessage.value)) {
    newMessage.value= '';
  }
}

function toDate(seconds) {
  return (new Date(seconds)).toLocaleString();
}

// Entrer en mode d'édition pour un message
function editMessage(message) {
  editingMessage.value = message.uid; // Identifie le message en cours d'édition
}


function saveEditedMessage(message, newText) {
  if (UpdateMessageInConversation(chatID.value, message.uid, userID, newText)) {
    editingMessage.value = null; 
  }
}

</script>

<template>
  <div class="chat">
    <h2>Conversation</h2>
    <div class="messages" v-if="conversationMembers && conversationMessages">
      <div v-for="(message, index) in conversationMessages" :key="index" class="message">
        <strong>{{ conversationMembers[message.sender] ? conversationMembers[message.sender].email : "Ancien membre" }}:</strong>

        <template v-if="editingMessage === message.uid">
          <input v-model="message.text" @keyup.enter="saveEditedMessage(message, message.text)" />
        </template>
        <template v-else>
          {{ message.text }}
        </template>

        <template v-if="message.sender == userID">
          <button v-if="editingMessage == message.uid" @click="saveEditedMessage(message, message.text)">Save</button>

          <button v-if="editingMessage !== message.uid" @click="editMessage(message)">Edit</button>
          <button @click="DeleteMessageFromConversation(chatID, message.uid, userID)">Delete</button>
        </template>

        <div>Posté à {{toDate(message.sentAt) }}</div>
        <div v-if="message.lastEditedAt">Edité à {{toDate(message.lastEditedAt) }}</div>
      </div>
    </div>
    <input
      v-model="newMessage"
      @keyup.enter="sendMessage"
      placeholder="Tapez votre message..."
    />
  </div>
</template>

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
