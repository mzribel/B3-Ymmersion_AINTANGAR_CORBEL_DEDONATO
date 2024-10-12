<template>
  <div v-if="conversationMembers">
    <h2 v-if="conversationTitle">{{ conversationTitle }}</h2>
    <h2 v-else>Groupe Sans Titre</h2>

    <div v-if="conversationOwners === userID">
      <form @submit.prevent="RenameGroup(conversationID, newGroupName)">
        <input v-model="newGroupName" type="text" placeholder="Entrez un nouveau nom" required />
        <button type="submit">Renommer le groupe</button>
      </form>
      <button @click="DeleteGroupAndRedirect(conversationID)">Supprimer le groupe</button>
    </div>
    <div v-else><button @click="DeleteUserFromGroupConversation(conversationID, userID)">Quitter le groupe</button></div>
    <br>
    <h4>Membres</h4>
    <ul>
      <li v-for="member in conversationMembers">
        <span v-if="member.uid === conversationOwners">👑</span>
        {{ member.displayName ? member.displayName+" - " : ""}}
        {{ member.email}}

        <span v-if="conversationOwners && member.uid !== conversationOwners">
          <button @click="DeleteUserFromGroupConversation(conversationID, member.uid)">Delete</button>
        </span>
      </li>
      <li>
        <form @submit.prevent="AddUserEmailToGroupConversation(conversationID, newMemberEmail)">
          <input v-model="newMemberEmail" type="text" placeholder="Entrez une adresse mail" required />
          <button type="submit">Ajouter au groupe</button>
        </form>
      </li>
    </ul>
  </div>


</template>
<script setup>
import ChatComposable from "../../composables/ChatComposable.js";
const { AddUserEmailToGroupConversation, DeleteUserFromGroupConversation, DeleteGroupConversation, RenameGroup } = ChatComposable();
import {inject, ref} from "vue";
import {useRouter} from "vue-router";

const router = useRouter();
const userID = inject("userID")
const newGroupName = ref("");
const newMemberEmail = ref("");

const DeleteGroupAndRedirect = async (convID) => {
  await DeleteGroupConversation(convID);
  await router.push("/chat")
}

const props = defineProps({
  conversationID: {type: String, required:true},
  conversationTitle: {type: String, required: false},
  conversationMembers: {type: Object, required: true, default: {}},
  conversationOwners: {type: String, required: false},
})


</script>