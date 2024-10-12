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

</script>

<template>
  <div>
    <h2>Utilisateurs</h2>
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
    <br>
    <h2>Nouveau groupe</h2>
    <form @submit.prevent="CreateGroupConversation(user.uid, groupName)">
      <input v-model="groupName" type="text" placeholder="Nom du groupe" required />
      <button type="submit">Créer</button>
    </form>

    <br>
    <h2>Liste des groupes</h2>
    <br>
    <template v-for="conv in conversationList">
      <div v-if="!conv.isPrivate"  run devstyle="padding: 15px 0 20px; border: 1px solid black; border-width: 1px 0">
        <RouterLink :to="'/chat/'+conv.uid"><h3>>>> {{ conv.groupName ? conv.groupName : "Groupe Sans Titre"}}</h3></RouterLink>
        <div v-if="conv.isOwner">
          <form @submit.prevent="RenameGroup(conv.uid, newGroupName)">
          <input v-model="newGroupName" type="text" placeholder="Entrez un nouveau nom" required />
          <button type="submit">Renommer le groupe</button>
        </form>
        <button @click="DeleteGroupConversation(conv.uid)">Supprimer le groupe</button>
        </div>
        <div v-else><button @click="DeleteUserFromGroupConversation(conv.uid, userID)">Quitter le groupe</button></div>
        <h4>Membres</h4>
        <ul>
          <li v-for="member in conv.members">
            <span v-if="member.uid == conv.ownerID">👑</span>
            {{ member.displayName ? member.displayName+" - " : ""}}
            {{ member.email}}

            <span v-if="conv.isOwner && member.uid != conv.ownerID">
              <button @click="DeleteUserFromGroupConversation(conv.uid, member.uid)">Delete</button>
            </span>

          </li>
          <li>
            <form @submit.prevent="AddUserToGroup(conv.uid, userEmail)">
              <input v-model="userEmail" type="text" placeholder="Entrez une adresse mail" required />
              <button type="submit">Ajouter au groupe</button>
            </form>
          </li>
        </ul>
      </div>

    </template>
  </div>
</template>

<style scoped>

</style>