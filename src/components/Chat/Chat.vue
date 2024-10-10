<script setup>
import {ref as fbRef, onValue, push, get} from 'firebase/database';
import { db } from '../../firebase';
import {watch, ref, onMounted, inject} from "vue";
import {useRoute} from "vue-router";

const props = defineProps({
  userID: {type: String, required: true},
  isPrivate: {type: Boolean, default: false},
})

const route = useRoute()
const chatID = ref(route.params.groupId);
const messages = ref([]);
const newMessage = ref("");
const chatTitle = ref("Nouveau Groupe")
const members = ref([]);
const isPrivate = ref(false);
const username = ref("Prout");

const user = inject("user")

watch(() => route.params.groupId, () => {
    chatID.value = route.params.groupId;
    newMessage.value = "";
    loadMessages(chatID.value)
})

onMounted(() => {
  loadMessages(chatID.value)
})

async function loadMessages(conversationId) {
      messages.value = [];
      members.value = [];

      let messagesRef;


      if (props.isPrivate) {
        messagesRef = fbRef(db, `groups/${conversationId}/messages`);
        const groupTitleRef = fbRef(db, `groups/${conversationId}/name`);
        onValue(groupTitleRef, (snapshot) => {
          chatTitle.value = snapshot.val();
        });
      } else {
        messagesRef = fbRef(db, `privateMessages/${conversationId}`);
        const groupTitleRef = get(fbRef(db, `groups/${conversationId}/name`));
        chatTitle.value = "";
      }


      onValue(messagesRef, (snapshot) => {
        const messagesSnap = snapshot.val();
        messages.value = [];
        for (let key in messagesSnap) {
          messages.value.push({ ...messagesSnap[key], id: key });
        }
      });

      let membersRef = fbRef(db, `groups/${conversationId}/members`);
      onValue(membersRef, (snapshot) => {
        const membersSnap = snapshot.val();
        members.value = [];
        for (let key in membersSnap) {
          members.value.push({ ...membersSnap[key], id: key });
        }
      });

    }

    function sendMessage() {
      if (newMessage.value.trim() === '') return;

      let messagesRef;
      if (props.isPrivate) {
        messagesRef = fbRef(db, `groups/${chatID.value}/messages`);
      } else {
        messagesRef = fbRef(db, `privateMessages/${chatID.value}`);
      }

      push(messagesRef, {
        text: newMessage.value,
        sender: user.value.email,
        timestamp: Date.now()
      });

      newMessage.value= '';
    }


</script>

<template>
  <div class="chat">
    <h2>Conversation</h2>
    <div class="messages">
      <div v-for="(message, index) in messages" :key="index" class="message">
        <strong>{{ message.sender }}:</strong> {{ message.text }}
        <div>

        </div>
      </div>
                {{ members }}
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
button {
  margin-left: 0.5rem;
  padding: 0.25rem 0.5rem;
  width: 100px;
  font-size: 0.8rem;
  height: 50px;
}
</style>