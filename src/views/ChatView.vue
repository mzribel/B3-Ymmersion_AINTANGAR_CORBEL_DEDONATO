<script setup>

import ConversationsList from '../components/ConversationsList.vue';
import CreateGroup from '../components/CreateGroup.vue';
import UsersList from "../components/UsersList.vue";
import Chat from '../components/ChatView/Chat.vue';
import ChatTony from '../components/Chat.vue';
import {inject, ref, watch} from "vue";
import {useRoute} from "vue-router";
import UserComposable from "../composables/UserComposable.js";
import MemberList from "../components/ChatView/MemberList.vue";
import UserList from "../components/ChatView/UserList.vue";

const route = useRoute();
const user = inject("user");

const chatID = ref(route.params.groupId);
watch(() => route.params, () => {
    chatID.value = route.params.groupId;
})

</script>

<template>
<main>
  <div>
    <ConversationsList></ConversationsList>
  </div>
  <template v-if="chatID">
      <Chat :chat-i-d="chatID" user-i-d="user.uid"></Chat>
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