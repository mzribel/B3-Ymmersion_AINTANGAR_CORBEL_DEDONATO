<script setup>
import UserComposable from "../../composables/UserComposable.js";
import ChatComposable from "../../composables/ChatComposable.js";
import FormatComposable from "../../composables/FormatComposable.js";
const { GetAllUsers, GetUserByEmail } = UserComposable();
const { toDate } = FormatComposable();
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
  onValue(fbRef(db, "conversations/"), async () => {
    conversationList.value = await GetUserConversations(userID.value);
  })
  onValue(fbRef(db, "users/"), async () => {
    users.value = await GetAllUsers();
  })
})

const router = useRouter()

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
    await router.push("/chat/" + newGroup);
  }
}

const sortedGroups = computed(() => {
  if (!groupConversationsList.value) { return null;}
  return groupConversationsList.value.sort((a, b) => {
        if (a.groupName < b.groupName) return -1;
        else if (b.groupName < a.groupName) return 1;
        return 0;
      })
})

</script>

<template>
  <div v-if="user" class="hero-component">
    <section class="current-user">
      <div class="pfp-container">
          <div class="pfp">
             <img v-if="!user.photoURL" src="../../assets/img/user_placeholder.png" alt="">
              <img v-else :src="user.photoURL" alt="">
          </div>
      </div>
      <div class="right">
        <h1>Bienvenue, <span>{{ user.displayName }}</span> !</h1>
        <span class="subtitle">{{ user.email }}</span><br>
        <span class="subtitle">Membre depuis aujourd'hui</span>
      </div>
    </section>

    <section class="groups">
    <div class="group-details-ctn">
      <div class="group-details-item">
        <div class="title">Créer un nouveau groupe</div>
        <div class="content">
          <form @submit.prevent="createGroup(user.uid, groupName)">
            <input v-model="groupName" type="text" placeholder="Entrez un nouveau nom" required />
            <button type="submit">Créer</button>
          </form>
        </div>
      </div>
      <div class="group-details-item">
        <div class="title">Mes groupes</div>
        <div v-if="!sortedGroups" class="content empty">
          Pas de groupe à afficher !
        </div>
        <div v-else class="group-ctn">
          <template v-for="group in sortedGroups">
            <RouterLink :to="'/chat/'+group.uid">
              <div class="group-item" >
                <div class="group-title">{{ group.groupName}}</div>
                <div class="group-details">
                  <span>{{ group.members.length}} membre(s)
                  <template v-if="group.messages">{{ Object.keys(group.messages).length }} message(s)</template>
                  <template v-else>0 message</template></span>
                  <span>Dernière activité le {{ toDate( group.lastUpdateAt)}}</span>
                </div>
              </div>
            </RouterLink>
          </template>
        </div>
      </div>
    </div>
    </section>


  </div>
</template>

