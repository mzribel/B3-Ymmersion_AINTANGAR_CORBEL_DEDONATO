<template>
  <div class="conversations-list">
    <h1>Chat</h1>

    <ul>


      <li v-for="(conversation, key) in conversationList" :key="key">
        <RouterLink :to="`/chat/${conversation.uid}`">
          {{ conversation.isPrivate ? "DM - " : "Groupe - "}}
          <template v-if="conversation.isPrivate">
            <template v-for="member in conversation.members">
              <span v-if="member.email != user.email"> {{ member.email }}</span>
            </template>
          </template>
          <template v-else>
            <span v-if="conversation.groupName">{{ conversation.groupName }}</span>
            <span v-else>{{ conversation.members.map(member=>member.email).join(", ")}}</span>
          </template>
        </RouterLink>
      </li>
    </ul>
  </div>
</template>
<script setup>
import {ref as fbRef, onValue, set, push, get, update} from 'firebase/database';
import { db } from '../../firebase';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import ChatComposable  from "../../composables/ChatComposable.js"

const { GetUserConversations } = ChatComposable();

import {computed, inject, onMounted, ref} from "vue";
import {RouterLink} from "vue-router";

const conversationList = ref([]);
const user = inject("user");

onAuthStateChanged(getAuth(), async (u) => {
  conversationList.value = await GetUserConversations(u.uid);

  onValue(fbRef(db, "groups/"), async () => {
    conversationList.value = await GetUserConversations(u.uid);
  })
})


</script>