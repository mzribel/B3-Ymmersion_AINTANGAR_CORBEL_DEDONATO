<script setup>
import UserComposable from "../../composables/UserComposable.js";
import ChatComposable from "../../composables/ChatComposable.js";
const { GetCurrentUserData, GetAllUsers } = UserComposable();
const { CreatePrivateConversation } = ChatComposable();
import {inject, ref} from "vue";
import MembersList from "../../components/MembersList.vue";
import {useRoute, useRouter} from "vue-router";

const users = ref();
const currentUser = inject("user");

GetAllUsers().then((res) => {
  users.value = res;
})
const router = useRouter()
async function OpenPrivateMessageWithUser(userID) {
  if (userID == currentUser.value.uid) {
    console.log("On ne peut pas ouvrir un MP avec soi même")
    return;
  }
  const conversationID = await CreatePrivateConversation([currentUser.value.uid, userID]);
  if (conversationID) {
    await router.push("/chat/" + conversationID);
  }
}


</script>

<template>
  <template v-if="users">
    <ul>
      <li v-for="user in users" :key="user.uid">
        {{ user.email }}
        <button @click="OpenPrivateMessageWithUser(user.uid)">Envoyer un MP</button>
      </li>
    </ul>
  </template>
</template>

<style scoped>

</style>