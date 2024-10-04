<template>
  <div class="login-container">
    <h2>Connexion</h2>
    <form @submit.prevent="login">
      <input v-model="email" type="email" placeholder="Email" required />
      <input v-model="password" type="password" placeholder="Mot de passe" required />
      <button type="submit">Se connecter</button>
    </form>
    <button @click="loginWithGoogle">Se connecter avec Google</button>
    <p><RouterLink to="/register">Pas encore de compte ? S'inscrire</RouterLink></p>

  </div>
</template>

<script setup>
import { getAuth, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { set } from 'firebase/database';
import { db } from '../firebase';
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
      const user = result.user;
      saveUserToDatabase(user);
      this.$router.push('/');
    })
    .catch(error => {
      console.error('Erreur avec Google:', error);
    });
}

// Todo : MOVE TO COMPOSABLES
function saveUserToDatabase(user) {
  const userRef = ref(db, `users/${user.uid}`);
  set(userRef, {
    uid: user.uid,
    displayName: user.displayName || 'Utilisateur anonyme',
    email: user.email,
    createdAt: Date.now()
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
