<script setup>
import ConversationsList from '../components/ChatView/ConversationsList.vue';
import {inject, ref, watch} from "vue";
import {useRoute, useRouter} from "vue-router";
import ChatComposable from "../composables/ChatComposable.js";
import Chat from "../components/ChatView/Chat.vue";
import MemberList from "../components/ChatView/MemberList.vue";
import UserList from "../components/ChatView/AllUsers.vue";
import {getAuth, onAuthStateChanged} from "firebase/auth";
const { GetConversationByID } = ChatComposable();

const route = useRoute();
const router = useRouter();
const user = inject("user");

const chatID = ref(route.params.groupId);
const conversationMessages = ref({});
const conversationMembers = ref([]);

const conversation = ref(null);
onAuthStateChanged(getAuth(), async (u) => {
  if (chatID) { await loadConversationData() };
})

watch(() => route.params, () => {
    chatID.value = route.params.groupId;
    loadConversationData();
})

async function loadConversationData() {
  if (!chatID.value) { return; }

  GetConversationByID(chatID.value).then((result) => {
      if (!result.members.includes(getAuth().currentUser.uid)) {
        router.push("/chat/")
      }

      conversation.value = result;
      conversationMessages.value = result.messages ? result.messages : [];
      conversationMembers.value = result.members;
  })
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