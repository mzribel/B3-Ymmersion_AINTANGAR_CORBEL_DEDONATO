<script setup>
import ConversationsList from '../components/ChatView/CurrentConversations.vue';
import {inject, ref, watch} from "vue";
import {useRoute, useRouter} from "vue-router";
import ChatComposable from "../composables/ChatComposable.js";
import FormatComposable from "../composables/FormatComposable.js";
const { ToArray } = FormatComposable();

import Chat from "../components/ChatView/Chat.vue";
import Hero from "../components/ChatView/Hero.vue";
import {getAuth, onAuthStateChanged} from "firebase/auth";
import {onValue, ref as fbRef} from "firebase/database";
import {db} from "../firebase.js";
import UserComposable from "../composables/UserComposable.js";
import GroupConvDetails from "../components/ChatView/GroupConvDetails.vue";
import PrivateConvDetails from "../components/ChatView/PrivateConvDetails.vue";
const { GetConversationByID } = ChatComposable();
const { GetUserByID } = UserComposable();

const route = useRoute();
const router = useRouter();

const userID = inject("userID");
const chatID = ref(route.params.groupId);
const conversationMessages = ref([]);
const conversationMembers = ref();
const conversationIsPrivate = ref(false);

const conversation = ref(null);
onAuthStateChanged(getAuth(), async (u) => {
  if (chatID.value) {
      await loadConversationData();
      createConversationListeners();
  };
})

watch(() => route.params, async () => {
  chatID.value = route.params.groupId;
  if (chatID.value) {
    await loadConversationData();
    createConversationListeners()
  }
})

function createConversationListeners() {
      onValue(fbRef(db, `conversations/${chatID.value}/members`), async (snapshot) => {
        loadMembers(snapshot.val()).then(result=> {
          conversationMembers.value = result;
        })
    });

  // Messages
    onValue(fbRef(db, `conversations/${chatID.value}/messages`), (snapshot) => {
      conversationMessages.value = snapshot.val() ? ToArray(snapshot.val()) : [];
    });
  // Title
    if (!conversation.isPrivate) {
      onValue(fbRef(db, `conversations/${chatID.value}/groupName`), (snapshot) => {
      });
    }

}

async function loadMembers(memberIDs) {
  let members = {};
  if (!memberIDs) {
    return;
  }
  for (const id of memberIDs) {
    members[id] = (await GetUserByID(id))
  }
  return members;
}

async function loadConversationData() {
  if (!chatID.value) { return; }
  let conversationData = await GetConversationByID(chatID.value);

  if (!conversationData || !conversationData.members.includes(userID.value)) {
    await router.push("/chat/")
    return;
  }

  conversation.value = conversationData;
  conversationIsPrivate.value = conversationData.isPrivate;
  loadMembers(conversation.members).then(result=> {
    conversationMembers.value = result;
  })

  conversationMessages.value = conversationData.messages ? ToArray(conversationData.messages) : [];
}
</script>

<template>
<main class="chat-view">
  <ConversationsList :conversation-i-d="chatID"></ConversationsList>
  <template v-if="chatID && conversation">
      <Chat :conversation-messages="conversationMessages" :conversation-members="conversationMembers"></Chat>
      <GroupConvDetails :conversation-i-d="conversation.uid" :conversation-title="conversation.groupName" :conversation-members="conversationMembers" :conversation-owners="conversation.ownerID" v-if="!conversationIsPrivate"></GroupConvDetails>
      <PrivateConvDetails :conversation-members="conversationMembers" v-else-if="conversationIsPrivate && conversationMembers"></PrivateConvDetails>
  </template>
  <template v-else>
    <Hero></Hero>
  </template>
</main>
</template>

<style scoped>
main {
  display: flex;
  height: calc(100% - 50px);
  div {
    border: 1px solid black;
    height: 100%;
  }
}
</style>