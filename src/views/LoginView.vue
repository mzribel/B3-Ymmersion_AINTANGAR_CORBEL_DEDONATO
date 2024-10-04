<script setup>
  import { ref } from 'vue'

  import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

  import { useRouter } from 'vue-router';
  import Navbar from "@/components/Navbar.vue";
  const email = ref('');
  const password = ref('')
  const router = useRouter();
  const auth = getAuth();

  const register = () => {
      signInWithEmailAndPassword(auth, email.value, password.value)
      .then((data) => {
        console.log('Successfully logged in!');
        console.log(auth)
        router.push('/') // redirect to the feed
      })
      .catch(error => {
        console.log(error.code)
        alert(error.message);
      });
  }
</script>

<template>
    <h1>Login</h1>
    <p><input type="text" placeholder="Email" v-model="email" /></p>
    <p><input type="password" placeholder="Password" v-model="password" /></p>
    <p><button @click="register">Submit</button></p>
    <br>
    <p>No account ? <RouterLink to="/register">Register here !</RouterLink></p>
    <p>Password forgotten ? <RouterLink to="#">Fuck you !</RouterLink></p>
</template>

<style scoped>

</style>