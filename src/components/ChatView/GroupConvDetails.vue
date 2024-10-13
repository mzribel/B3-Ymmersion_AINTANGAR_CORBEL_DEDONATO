<template>
  <div class="group-conv-details-components" v-if="conversationMembers && groupAdmin">
      <div class="group-profile">
      <div class="user-info">
        <div class="pfp-container">
          <div class="pfp" >
            <img src="../../assets/img/group_placeholder.png" alt="" height="100px">
          </div>
        </div>
      </div>
      <div class="user-info">
        <span class="username">{{ conversationTitle }}</span>
        <span class="email">{{ Object.keys(conversationMembers).length }} membre(s)</span>
      </div>
    <div class="conv-buttons">
      <button v-if="groupAdmin.uid == userID" @click="DeleteGroupAndRedirect(conversationID)">Supprimer le groupe</button>
      <button v-else @click="DeleteUserFromGroupConversation(conversationID, userID)">Quitter le groupe</button></div>
    </div>
    <div class="group-details-ctn">
      <div class="group-details-item">
        <div class="title">
        Crée le
        </div>
<!--        TODO: changer la date !-->
        <div class="content">11/10/2024 18:34:46</div>
      </div>
      <div v-if="groupAdmin" class="group-details-item">
        <div class="title">Administré par</div>
          <div class="small-profile">
            <div class="pfp-container">
              <div class="pfp">
                <img v-if="groupAdmin.photoURL" :src="groupAdmin.photoURL" alt="">
                <img v-else src="../../assets/img/user_placeholder.png" alt="">
              </div>
            </div>
            <div class="user-details" v-if="groupAdmin.displayName">
              <div class="username">{{ groupAdmin.displayName }}</div>
              <div class="email"> {{ groupAdmin.email }} </div>
            </div>
            <div class="user-details" v-else>
              <div class="username">{{ groupAdmin.email }}</div>
            </div>
            <RouterLink to="" v-if="groupAdmin.uid !== userID"><div class="message-icon"><font-awesome-icon :icon="['far', 'envelope']" /></div></RouterLink>
          </div>
        </div>
        <div class="group-details-item">
          <div class="title">Membres</div>
          <div class="content profiles">
            <div v-for="member in conversationMembers" class="small-profile">
              <div class="pfp-container">
                <div class="pfp">
                  <img v-if="member.photoURL" :src="member.photoURL" alt="">
                  <img v-else src="../../assets/img/user_placeholder.png" alt="">
                </div>
              </div>
              <div class="user-details" v-if="member.displayName">
                <div class="username">{{ member.displayName }}</div>
                <div class="email"> {{ member.email }} </div>
              </div>
              <div class="user-details" v-else>
                <div class="username">{{ member.email }}</div>
              </div>
              <div v-if="userID != member.uid" @click="OpenPrivateMessageWithUser(userID, member.uid, router)" class="message icon"><font-awesome-icon :icon="['far', 'envelope']" /></div>
              <div v-if="userID === conversationOwners && userID != member.uid" @click="DeleteUserFromGroupConversation(conversationID, member.uid)" class="delete icon"><font-awesome-icon :icon="['fas', 'right-from-bracket']" /></div>
            </div>
          </div>
        </div>
        <div v-if="conversationOwners === userID" class="group-details-item">
          <div class="title">Ajouter un membre</div>
          <div class="content">
            <form @submit.prevent="AddUserEmailToGroupConversation(conversationID, newMemberEmail)">
              <input v-model="newMemberEmail" type="text" placeholder="Entrez une adresse mail" required />
              <button type="submit">Ajouter</button>
            </form>
          </div>
        </div>
        <div v-if="conversationOwners === userID" class="group-details-item">
          <div class="title">Renommer le groupe</div>
          <div class="content">
            <form @submit.prevent="RenameGroup(conversationID, newGroupName)">
              <input v-model="newGroupName" type="text" placeholder="Entrez un nouveau nom" required />
              <button type="submit">Renommer</button>
            </form>
          </div>
        </div>
    </div>
  </div>
</template>
<script setup>
import ChatComposable from "../../composables/ChatComposable.js";
const { OpenPrivateMessageWithUser, AddUserEmailToGroupConversation, DeleteUserFromGroupConversation, DeleteGroupConversation, RenameGroup, CreatePrivateConversation } = ChatComposable();
import {computed, inject, ref} from "vue";
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
  conversationOwners: {type: String, required: true},
})

const groupAdmin = computed(()=> {
  for (let key of Object.keys(props.conversationMembers)) {
    if (key == props.conversationOwners) {
      return props.conversationMembers[key];
    }
  }
  return "";
})

</script>

<style lang="scss">
.group-conv-details-components {
  width: 500px;
  min-height: 100%;
  max-height: 100%;
  overflow-y: auto;
  flex-shrink: 0;
}

</style>