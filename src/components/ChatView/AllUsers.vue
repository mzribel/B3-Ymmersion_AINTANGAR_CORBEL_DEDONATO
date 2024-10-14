<template>
  <div class="all-users-component">
    <div class="header">
      <h2>• Tous les utilisateurs •</h2>
    </div>
    <div class="all-users">
      <div v-for="member in sortedUsers" class="small-profile">
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
        <div v-if="userID != member.uid" @click="OpenPrivateMessageWithUser(member.uid, userID, router)" class="message icon"><font-awesome-icon :icon="['far', 'envelope']" /></div>
      </div>
    </div>
  </div>

</template>

<script setup>
import {computed, inject, ref} from "vue";
import UserComposable from "../../composables/UserComposable.js";
import ChatComposable from "../../composables/ChatComposable.js";
const { OpenPrivateMessageWithUser } = ChatComposable();
import {getAuth, onAuthStateChanged} from "firebase/auth";
import {onValue, ref as fbRef} from "firebase/database";
import {db} from "../../firebase.js";
import {useRouter} from "vue-router";
const { GetAllUsers } = UserComposable();
const allUsers = ref();
const userID = inject("userID")
const router = useRouter();

onAuthStateChanged(getAuth(), async (u) => {
  onValue(fbRef(db, "users/"), async () => {
    allUsers.value = await GetAllUsers();
  })
})

const sortedUsers = computed(()=> {
  if (!allUsers.value) { return [] }
  return Object.values(allUsers.value).sort((a, b) => {
    let nameA = a.displayName ? a.displayName.toLowerCase() : a.email.toLowerCase();
    let nameB = b.displayName ? b.displayName.toLowerCase() : b.email.toLowerCase();

    if (nameA < nameB) return -1;
    else if (nameB < nameA) return 1;
    return 0;
  })
})


</script>