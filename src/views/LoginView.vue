<template>
  <div class="login-container">
    <h2>Connexion</h2>
    <form @submit.prevent="login">
      <input v-model="email" type="email" placeholder="Email" required />
      <input v-model="password" type="password" placeholder="Mot de passe" required />
      <button type="submit">Se connecter</button>
    </form>
<!--    <button @click="loginWithGoogle">Se connecter avec Google</button>-->
    <p><RouterLink to="/register">Pas encore de compte ? S'inscrire</RouterLink></p>

  </div>
</template>

<script setup>
import { getAuth, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import {ref} from "vue";
import {useRouter} from "vue-router";

const email = ref('');
const password = ref('')
const router = useRouter();
const auth = getAuth();

const login = () => {
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

const loginWithGoogle = () => {
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
.login-container {
  width: 300px;
  margin: 100px auto;
  text-align: center;
}

input {
  display: block;
  width: 100%;
  margin: 10px 0;
  padding: 10px;
}

button {
  margin: 10px 0;
  padding: 10px;
  width: 100%;
}
</style>
