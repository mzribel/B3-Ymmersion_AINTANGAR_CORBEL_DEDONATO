<script setup>
import UserComposable from "../../composables/UserComposable.js";
import ChatComposable from "../../composables/ChatComposable.js";
const { GetCurrentUserData, GetAllUsers, GetUserByEmail } = UserComposable();
const { RenameGroup, DeleteUserFromGroupConversation, AddUserToGroupConversation, DeleteGroupConversation, CreatePrivateConversation, CreateGroupConversation, GetUserConversations } = ChatComposable();
import {computed, inject, ref} from "vue";
import {useRoute, useRouter} from "vue-router";
import {getAuth, onAuthStateChanged} from "firebase/auth";
import {onValue, ref as fbRef} from "firebase/database";
import {db} from "../../firebase.js";

const users = ref();
const currentUser = inject("user");
const groupName = ref("");
const userEmail = ref("")
const conversationList = ref([]);
const user = inject("user");
const userID = inject("userID");
const newGroupName = ref("");

onAuthStateChanged(getAuth(), async (u) => {
  conversationList.value = await GetUserConversations(u.uid);
  users.value = await GetAllUsers();


  onValue(fbRef(db, "conversations/"), async () => {
    conversationList.value = await GetUserConversations(u.uid);
  })
  onValue(fbRef(db, "users/"), async () => {
    users.value = await GetAllUsers();
  })
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

async function AddUserToGroup(groupID, email) {
  let userID = await GetUserByEmail(email);
  if (!userID) {
    return null;
  }

  await AddUserToGroupConversation(groupID, userID)
  userEmail.value = "";
}

const groupConversationsList = computed(() => {
  if (!conversationList.value) {
    return [];
  }
  return conversationList.value.filter(conversation => {
    return !conversation.isPrivate;
  })
})

const createGroup = async (userID, groupName) => {
  let newGroup = await CreateGroupConversation(userID, groupName);
  if (newGroup) {
    console.log("push?")
    await router.push("/chat/" + newGroup);
  }
}

</script>

<template>
  <div class="hero-component">
    <div class="groups-ctn">
      <h1>• Mes groupes •</h1>
      <div v-if="!groupConversationsList || !groupConversationsList.length">
        <span>Pas de groupe !</span>
      </div>
      <div v-else>
        <template v-for="conv in conversationList">
          <div v-if="!conv.isPrivate"  run devstyle="padding: 15px 0 20px; border: 1px solid black; border-width: 1px 0">
            <RouterLink :to="'/chat/'+conv.uid"><h3>>>> {{ conv.groupName ? conv.groupName : "Groupe Sans Titre"}}</h3></RouterLink>
            <div v-if="conv.isOwner">
              <button @click="DeleteGroupConversation(conv.uid)">Supprimer le groupe</button>
            </div>
            <div v-else><button @click="DeleteUserFromGroupConversation(conv.uid, userID)">Quitter le groupe</button></div>
            <span>{{ conv.members.length}} membre(s)</span>
            <span v-if="conv.messages">, {{ Object.keys(conv.messages).length }} message(s)</span>
            <span v-else>0 message</span>
          </div>
        </template>
      </div>
    </div>
    <div class="group-creation-ctn">
      <h1>• Créer un groupe •</h1>
      <form @submit.prevent="createGroup(user.uid, groupName)">
        <input v-model="groupName" type="text" placeholder="Nom du groupe" required />
        <button type="submit">Créer</button>
      </form>
    </div>

    <div class="all-users-ctn">
      <h1>• Tous les utilisateurs •</h1>
    <template v-if="users">
      <ul>
        <template v-for="user in users" :key="user.uid">
          <li v-if="user.uid != userID">
            {{ user.email }}
            <button @click="OpenPrivateMessageWithUser(user.uid)">Envoyer un MP</button>
          </li>
        </template>
      </ul>
    </template>


          </div>
  </div>
</template>

