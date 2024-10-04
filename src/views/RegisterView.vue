<template>
  <main>
    <h1>Register</h1>
    <p><input type="text" placeholder="Email" v-model="email" /></p>
    <p><input type="password" placeholder="Password" v-model="password" /></p>
    <p><button @click="register">Submit</button></p>
    <br>
    <p><RouterLink to="/login">Already have an account ?</RouterLink></p>
  </main>
</template>

<script setup>
  import { ref } from 'vue'

  import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

  import { useRouter } from 'vue-router';
  import Navbar from "@/components/Navbar.vue";
  const email = ref('');
  const password = ref('')
  const router = useRouter();
  const auth = getAuth();

  const register = () => {
      createUserWithEmailAndPassword(auth, email.value, password.value)
      .then((data) => {
        console.log('Successfully registered!');
        console.log(auth)
        router.push('/') // redirect to the feed
      })
      .catch(error => {
        console.log(error.code)
        alert(error.message);
      });
  }
</script>


<style scoped>
</style>