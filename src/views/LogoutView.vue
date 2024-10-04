<script setup>
import {getAuth} from "firebase/auth";
import router from "../router/index";

getAuth().signOut();
router.push("/login");

</script>

<template></template>
