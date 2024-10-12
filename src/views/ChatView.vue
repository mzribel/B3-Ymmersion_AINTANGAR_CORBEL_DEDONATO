<script setup>
import ConversationsList from '../components/ChatView/ConversationsList.vue';
import {inject, ref, watch} from "vue";
import {useRoute, useRouter} from "vue-router";
import ChatComposable from "../composables/ChatComposable.js";
import FormatComposable from "../composables/FormatComposable.js";
const { ToArray } = FormatComposable();

import Chat from "../components/ChatView/Chat.vue";
import MemberList from "../components/ChatView/MemberList.vue";
import UserList from "../components/ChatView/Hero.vue";
import {getAuth, onAuthStateChanged} from "firebase/auth";
import {onValue, ref as fbRef} from "firebase/database";
import {db} from "../firebase.js";
const { GetConversationByID } = ChatComposable();

const route = useRoute();
const router = useRouter();

const userID = inject("userID");
const chatID = ref(route.params.groupId);
const conversationMessages = ref([]);
const conversationMembers = ref([]);


const conversation = ref(null);
onAuthStateChanged(getAuth(), async (u) => {
  if (chatID) {
      await loadConversationData();
      onValue(fbRef(db, `conversations/${chatID.value}/`), (snapshot) => {
        loadConversationData(snapshot.val());
      });
  };
  console.log(conversationMessages.value)
})

watch(() => route.params, () => {
    chatID.value = route.params.groupId;
    if (chatID.value) {
      loadConversationData();
      onValue(fbRef(db, `conversations/${chatID.value}`), (snapshot) => {
        loadConversationData(snapshot.val());
      });
    }
})

async function loadConversationData(conversationData=null) {
  if (!chatID.value) { return; }
  if (!conversationData) {
    conversationData = await GetConversationByID(chatID.value);
  }

  console.log(conversationData)

  if (!conversationData || !conversationData.members.includes(userID.value)) {
    await router.push("/chat/")
    return;
  }

  conversation.value = conversationData;
  conversationMessages.value = conversationData.messages ? ToArray(conversationData.messages) : [];
  console.log(conversationMessages.value)
  conversationMembers.value = conversationData.members;

}

</script>

<template>
<main>
  <div>
    <ConversationsList></ConversationsList>
  </div>
  <template v-if="chatID">
      <Chat :conversation-messages="conversationMessages"></Chat>
      <MemberList :group-i-d="chatID"></MemberList>
  </template>
  <template v-else>
    <UserList></UserList>
  </template>
</main>
</template>

<style scoped>
main {
  display: grid;
  grid-template-columns: 1fr 50% 1fr;
  height: calc(100% - 50px);
  div {
    border: 1px solid black;
    height: 100%;
  }
}
</style>