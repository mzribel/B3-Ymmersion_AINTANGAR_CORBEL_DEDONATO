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
  console.log(props.otherUser)
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
    <div>
      <div v-if="conversationMembers && otherUser" class="user-info">
        <div v-if="otherUser.photoURL" class="pfp" >
          <img :src="otherUser.photoURL" alt="" height="100px">
        </div>
      </div>
      <div v-if="otherUser.displayName">
        <span style="font-size: 28px; font-weight: bold">{{ otherUser.displayName }}</span>
        <span>({{ otherUser.email }})</span>
      </div>
      <div v-else>
        <span style="font-size: 28px; font-weight: bold">{{ otherUser.email }}</span>
      </div>
      Membre depuis le {{ toDate(otherUser.createdAt) }}
    </div>
      <br>
      <h3>Groupes en commun</h3>
      <div v-if="commonGroups.length === 0">Pas de groupe en commun !</div>
      <ul v-else>
        <li v-for="group in commonGroups"><RouterLink :to="'/chat/'+group.uid">{{ group.groupName }}</RouterLink></li>
      </ul>
    </div>
</div>

</template>

<style scoped lang="scss">
.group-conv-details-components {
  width: 500px;
  flex-shrink: 0;
}
</style>