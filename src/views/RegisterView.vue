<template>
  <main>
    <h1>Register</h1>
    <p><input type="text" placeholder="Email" v-model="email" /></p>
    <p><input type="password" placeholder="Password" v-model="password" /></p>
    <p><button @click="registerWithEmail">Submit</button></p>
    <br>
    <p><RouterLink to="/login">Already have an account ?</RouterLink></p>
  </main>
</template>

<script setup>
  import { ref } from 'vue'

  import {getAuth, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup} from "firebase/auth";

  import { useRouter } from 'vue-router';
  import UserComposable from "../composables/UserComposable.js"


  const { CreateUserData } = UserComposable();


  const email = ref('');
  const password = ref('')
  const router = useRouter();
  const auth = getAuth();

  const registerWithEmail = () => {
      createUserWithEmailAndPassword(auth, email.value, password.value)
      .then((data) => {
        CreateUserData(data);
        console.log('Successfully registered!');
        console.log(auth)
        router.push('/') // redirect to the feed
      })
      .catch(error => {
        console.log(error.code)
        alert(error.message);
      });
  }
  const registerWithGoogle = () => {
  const auth = getAuth();
  const provider = new GoogleAuthProvider();
  signInWithPopup(auth, provider)
    .then(result => {
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


<style scoped>
</style>