<script setup>
import {getAuth} from "firebase/auth";
import router from "../router/index";
import {inject} from "vue";

const user = inject("user");

getAuth().signOut();
user.value = null;
router.push("/login");

</script>

<template></template>
