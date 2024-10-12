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
import UserComposable from "../composables/UserComposable.js";
const { GetConversationByID } = ChatComposable();
const { GetUserByID } = UserComposable();

const route = useRoute();
const router = useRouter();

const userID = inject("userID");
const chatID = ref(route.params.groupId);
const conversationMessages = ref([]);
const conversationMembers = ref([]);


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
      let members = await loadMembers(snapshot.val())
      conversationMembers.value = members;
      console.log("loaded members: ")
    });

  // Messages
    onValue(fbRef(db, `conversations/${chatID.value}/messages`), (snapshot) => {
      conversationMessages.value = snapshot.val() ? ToArray(snapshot.val()) : [];
      console.log("loaded messages")
    });
  // Title
    if (!conversation.isPrivate) {
      onValue(fbRef(db, `conversations/${chatID.value}/groupName`), (snapshot) => {
        console.log("loaded title")
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
  console.log(members)
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
  let temp = await loadMembers(conversation.members);
  conversationMembers.value = temp;
  conversationMessages.value = conversationData.messages ? ToArray(conversationData.messages) : [];

}

</script>

<template>
<main>
  <div>
    <ConversationsList></ConversationsList>
  </div>
  <template v-if="chatID">
      <Chat :conversation-messages="conversationMessages" :conversation-members="conversationMembers"></Chat>
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