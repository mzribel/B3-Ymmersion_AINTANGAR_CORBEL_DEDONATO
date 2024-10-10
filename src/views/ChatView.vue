<script setup>

import ConversationsList from '../components/ConversationsList.vue';
import CreateGroup from '../components/CreateGroup.vue';
import UsersList from "../components/UsersList.vue";
import Chat from '../components/Chat/Chat.vue';
import ChatTony from '../components/Chat.vue';
import {inject, ref, watch} from "vue";
import {useRoute} from "vue-router";
import UserComposable from "../composables/UserComposable.js";

const { GetAsyncUser, GetCurrentUserData } = UserComposable();
const route = useRoute();
const user = inject("user");

const chatID = ref(route.params.groupId);
watch(() => route.params, () => {
    chatID.value = route.params.groupId;
})

</script>

<template>
<!--  {{ user.email }}-->
<main>

  <div>
    <ConversationsList></ConversationsList>
  </div>
  <template v-if="chatID">
      <Chat :chat-i-d="chatID" user-i-d="user.uid"></Chat>
      <ChatTony :conversation-id="chatID" user-i-d="user.uid"></ChatTony>
      <UsersList></UsersList>

  </template>

</main>
</template>

<style scoped>
main {
  display: grid;
  grid-template-columns: 1fr 50% 1fr;
  height: calc(100% - 50px);
  div {
    border: 1px solid blue;
    height: 100%;
  }
}
</style>