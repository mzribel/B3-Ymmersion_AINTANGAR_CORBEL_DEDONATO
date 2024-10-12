<template>
  <Navbar></Navbar>
  <RouterView />
</template>

<script setup>
import { ref, provide } from "vue";
import UserComposable from "./composables/UserComposable.js"
import Navbar from "./components/Navbar.vue";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import ChatComposable from "./composables/ChatComposable.js";
import FormatComposable from "./composables/FormatComposable.js";

const { GetCurrentUserData } = UserComposable();
const { GetPrivateConversationBetweenUsers } = ChatComposable();
const { ToArray } = FormatComposable();
const userData = ref();
const userID = ref();
const loading = ref(true);
provide("userID", userID)
provide("user", userData)

const auth = getAuth();
onAuthStateChanged(auth, async (u) => {
  if (u) {
    userData.value = await GetCurrentUserData(u.uid);
    userID.value = u.uid;
    loading.value = false;
  } else {
    userData.value = null;
    userID.value = null;
  }
});

</script>

<style lang="scss">
@import "assets/css/main.scss";

.loading-screen {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  z-index: 1000;
  background-color: white;
}
</style>
