<script setup>
import ConversationsList from '../components/ChatView/ConversationsList.vue';
import {inject, ref, watch} from "vue";
import {useRoute} from "vue-router";
import ChatComposable from "../composables/ChatComposable.js";
import MemberList from "../components/ChatView/MemberList.vue";
import UserList from "../components/ChatView/AllUsers.vue";
const { GetConversationByID } = ChatComposable();

const route = useRoute();
const user = inject("user");


const conversation = ref(null);
const chatID = ref(route.params.groupId);
loadConversationData();

watch(() => route.params, () => {
    chatID.value = route.params.groupId;
    loadConversationData();
})

async function loadConversationData() {
  GetConversationByID(chatID.value).then((result) => {
      conversation.value = result;
  })
}

</script>

<template>
<main>
  <div>
    <ConversationsList></ConversationsList>
  </div>
  <template v-if="chatID">
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