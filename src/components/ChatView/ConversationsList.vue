<template>
  <div class="conversations-list">
    <h1>Chat</h1>

  </div>
</template>
<script setup>
import {ref as fbRef, onValue, set, push, get, update} from 'firebase/database';
import { db } from '../../firebase';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import ChatComposable  from "../../composables/ChatComposable.js"

const { GetUserConversations } = ChatComposable();

import {inject, onMounted, ref} from "vue";

const conversationList = ref([]);
const loading = ref(true);
const user = inject("user");

onAuthStateChanged(getAuth(), async (u) => {
  await GetUserConversations(u.uid);

});


</script>