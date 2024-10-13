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
  } else {
    selectedFile.value = null;
  }
}

function emptyFile() {
  selectedFile.value = null;
}

async function sendMessage() {
  console.log(selectedFile.value)
  if (selectedFile.value) {
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

      <div class="pfp-container">
        <div class="pfp">
          <img src="../../assets/img/user_placeholder.png" alt="">
        </div>
      </div>
      <div class="title">{{ otherUser.displayName ? otherUser.displayName : otherUser.email}}</div>

      </div>
      <div v-else class="chat-header">
      <div class="pfp-container">
          <div class="pfp small left">
            <img src="../../assets/img/group_placeholder.png" alt="">
          </div>
          <div class="pfp small right">
            <img src="../../assets/img/group_placeholder.png" alt="">
          </div>
      </div>
      <div class="title">{{ conversationTitle ? conversationTitle : "Conversation sans Titre"}}</div>

      </div>
    <div class="chat-content">



      <div class="messages" v-if="conversationMembers && conversationMessages">
        <template v-for="(message, index) in conversationMessages" :key="index">
          <div class="message-ctn" :class="index+1 === conversationMessages.length ? 'latest' : null">
            <div class="pfp-container">
            <div class="pfp">
              <img v-if="conversationMembers[message.sender] && conversationMembers[message.sender].photoURL" :src="conversationMembers[message.sender].photoURL" alt="">
              <img v-else src="../../assets/img/user_placeholder.png" alt="">

            </div>
            </div>
            <div class="message-item">
              <div class="message-data">
                <span class="username">{{ conversationMembers[message.sender] ? conversationMembers[message.sender].displayName : 'Ancien membre' }}</span>
                <span class="date">({{ toDate(message.sentAt) }}{{message.lastEditedAt ? ", édité" : ""}})</span>
              </div>
              <div class="message-data-gp">
                <div v-if="message.text" class="message-content" :class="userID == message.sender ? 'self' : ''">
                  {{ message.text }}
                </div>
                <div v-if="message.fileUrl" class="message-content image" :class="userID == message.sender ? 'self' : ''">
                  <img v-if="message.fileUrl" :src="message.fileUrl" alt="Image" height="100" />
                </div>
                <div class="edit">
                  <template v-if="editingMessage === message.uid">
                    <input v-model="message.text" @keyup.enter="saveEditedMessage(message, message.text)" />
                  </template>

                  <template v-if="message.sender == userID">
                    <button v-if="editingMessage === message.uid" @click="saveEditedMessage(message, message.text)">Save</button>
                    <button v-else @click="editMessage(message)">Edit</button>
                    <button @click="DeleteMessageFromConversation(chatID, message.uid, userID)">Delete</button>
                  </template>
                </div>
              </div>
            </div>

          </div>


        </template>
      </div>
    </div>


    <div class="chat-footer">
      <div class="attached-file" v-show="selectedFile">
        <input id="message-file" type="file" @change="handleFileUpload" accept="image/*" />
        <div class="icon" @click="emptyFile()"><font-awesome-icon :icon="['fas', 'xmark']" /></div>
      </div>
      <div class="chat-input-ctn">
        <label for="message-file" class="icon"><font-awesome-icon :icon="['fas', 'paperclip']" /></label>
        <div class="text-area"><input class="chat-area" v-model="newMessage" @keyup.enter="sendMessage" placeholder="Tapez votre message..." /></div>
        <label class="icon" @click="sendMessage"><font-awesome-icon :icon="['fas', 'paper-plane']" /></label>
      </div>
    </div>
  </div>
</template>

