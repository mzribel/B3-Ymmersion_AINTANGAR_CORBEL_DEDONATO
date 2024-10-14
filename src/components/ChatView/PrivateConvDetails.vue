<script setup>
import {computed, inject, onMounted, ref, watch} from "vue";
import ChatComposable from "../../composables/ChatComposable.js"
import FormatComposable from "../../composables/FormatComposable.js"
const { toDate } = FormatComposable();

const { GetGroupsIncludingUsers } = ChatComposable();

const userID = inject("userID")
const props = defineProps({
  conversationMembers: {type: Object, required: true, default: {}},
  otherUser: { type: Object, required: false }
})

watch(() => props.conversationMembers, async () => {
  commonGroups.value = await GetGroupsIncludingUsers(Object.keys(props.conversationMembers));
})

const commonGroups = ref([])

onMounted(async () => {
  // otherUser.value = getOtherUser();
  commonGroups.value = await GetGroupsIncludingUsers(Object.keys(props.conversationMembers));
})

</script>

<template>
  <div class="group-conv-details-components">
    <div v-if="otherUser">
    <div class="group-profile">
      <div v-if="conversationMembers && otherUser" class="user-info">
        <div class="pfp-container">
          <div class="pfp" >
            <img v-if="otherUser.photoURL" :src="otherUser.photoURL" alt="" height="100px">
            <img v-else src="../../assets/img/user_placeholder.png" alt="" height="100px">
          </div>
        </div>
      </div>
      <div class="user-info" v-if="otherUser.displayName">
        <span class="username">{{ otherUser.displayName }}</span>
        <span class="email">{{ otherUser.email }}</span>
      </div>
      <div v-else>
        <span style="font-size: 28px; font-weight: bold">{{ otherUser.email }}</span>
      </div>
    </div>
    <div class="group-details-ctn">
      <div class="group-details-item">
        <div class="title">
        Membre depuis le
        </div>
        <div class="content">{{ toDate(otherUser.createdAt) }}</div>
      </div>
      <div class="group-details-item">
        <div class="title">Groupes en commun</div>
        <template v-if="commonGroups.length === 0">
          <div class="content empty">Aucun groupe en commun !</div>
        </template>
        <div class="content">
          <li class="underline" v-for="group in commonGroups"><RouterLink :to="'/chat/'+group.uid">{{ group.groupName }}</RouterLink></li>
        </div>
      </div>

    </div>
</div>
</div>

</template>

<style scoped lang="scss">
.group-conv-details-components {
  width: 500px;
  flex-shrink: 0;
}
</style>