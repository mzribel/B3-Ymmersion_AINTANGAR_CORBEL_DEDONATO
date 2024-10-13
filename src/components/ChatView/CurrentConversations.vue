<template>
  <div class="current-conversations-component">
      <RouterLink to="/chat">
        <div class="see-all">
          <font-awesome-icon :icon="['fas', 'list']" class="icon" />
          <span>Voir tout</span>
        </div>
      </RouterLink>

    <div class="conversations-ctn">
      <h1>• Chats •</h1>
      <div class="conversations-list">
        <template v-for="(conversation, key) in orderedConversations" :key="key">
        <RouterLink :to="`/chat/${conversation.uid}`">
          <div v-if="conversation.isPrivate" class="conversation-item" :class="conversation.uid == conversationID ? 'selected' : ''">
            <div class="pfp-container">
              <div class="pfp">
                 <img v-if="conversation.otherUser.photoURL" :src="conversation.otherUser.photoURL" alt="">
                 <img v-else src="../../assets/img/user_placeholder.png" alt="">
              </div>
            </div>
            <div class="info-container">
              <div class="subtitle">
                <div class="title left single-line-ellipsis">{{ conversation.otherUser.displayName ? conversation.otherUser.displayName : conversation.otherUser.email }}</div>
                <div class="right" v-if="conversation.lastUpdateAt"> • {{ displayDate(conversation.lastUpdateAt) }}</div>
              </div>
            </div>
          </div>
          <div v-else class="conversation-item" :class="conversation.uid == conversationID ? 'selected' : ''">
            <div class="pfp-container">
              <template v-if="conversation.members.length < 2">
                <div class="pfp">
                  <img src="../../assets/img/group_placeholder.png" alt="">
                </div>
              </template>
              <template v-else>
                <div class="pfp small left">
                 <img v-if="conversation.members[0].photoURL" :src="conversation.members[0].photoURL" alt="">
                 <img v-else src="../../assets/img/group_placeholder.png" alt="">
                </div>
                <div class="pfp small right">
                 <img v-if="conversation.members[1].photoURL" :src="conversation.members[1].photoURL" alt="">
                 <img v-else src="../../assets/img/group_placeholder.png" alt="">
                </div>
              </template>
            </div>
            <div class="info-container">
              <div class="title single-line-ellipsis">{{ conversation.groupName }}</div>
              <div class="subtitle">
                <div class="left single-line-ellipsis" v-if="conversation.members.length < 2" >{{ conversation.members.length }} membre</div>
                <div class="left single-line-ellipsis" v-else>{{ conversation.members.length }} membres</div>
                <div class="right" v-if="conversation.lastUpdateAt"> • {{ displayDate(conversation.lastUpdateAt) }}</div>
              </div>
            </div>
          </div>
        </RouterLink>
        </template>
      </div>
    </div>
  </div>

</template>
<script setup>
import {ref as fbRef, onValue, set, push, get, update} from 'firebase/database';
import { db } from '../../firebase';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import ChatComposable  from "../../composables/ChatComposable.js"
import FormatComposable  from "../../composables/FormatComposable.js"

const { GetUserConversations } = ChatComposable();
const { isToday, getDateAndTimeString } = FormatComposable();

import {computed, inject, onMounted, ref} from "vue";
import {RouterLink} from "vue-router";

const conversationList = ref([]);
const userID = inject("userID");
const user = inject("user");

const props = defineProps({
  conversationID: { type: String, required: false }
});

onAuthStateChanged(getAuth(), async (u) => {
  onValue(fbRef(db, "conversations/"), async () => {
    conversationList.value = await GetUserConversations(u.uid);
  })
})

const orderedConversations = computed(()=> {
  if (!conversationList.value) { return [] }
  return conversationList.value.sort((a, b) => {
    if (a.lastUpdateAt > b.lastUpdateAt) {
      return -1;
    } else if (a.lastUpdateAt < b.lastUpdateAt) {
      return 1;
    }
    return 0;
  });
})

const displayDate = (seconds) => {
  let dateString = getDateAndTimeString(seconds);
  return isToday(seconds) ? dateString.time : dateString.date
}

</script>

