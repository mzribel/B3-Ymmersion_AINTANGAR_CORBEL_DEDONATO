<script setup>
import {ref as fbRef, onValue, push, get} from 'firebase/database';
import { db } from '../../firebase';
import {watch, ref, onMounted, inject} from "vue";
import {useRoute} from "vue-router";
const route = useRoute()


const chatID = ref(route.params.groupId);
const props = defineProps({
  conversationTitle: {type: String, required: false},
  conversationMessages: {type: Object, required: true},
  conversationMembers: {type: Array, required: false},
})

const messages = ref([]);
const newMessage = ref("");
const chatTitle = ref("Nouveau Groupe")
const members = ref([]);
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

      // const groupTitleRef = fbRef(db, `conversations/${conversationId}/name`);
      // onValue(groupTitleRef, (snapshot) => {
      //   chatTitle.value = snapshot.val();
      // });


      messagesRef = fbRef(db, `conversations/${conversationId}/messages`);
      onValue(messagesRef, (snapshot) => {
        const messagesSnap = snapshot.val();
        messages.value = [];
        for (let key in messagesSnap) {
          messages.value.push({ ...messagesSnap[key], id: key });
        }
      });

      let membersRef = fbRef(db, `conversations/${conversationId}/members`);
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

      let messagesRef = fbRef(db, `conversations/${chatID.value}/messages`);

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