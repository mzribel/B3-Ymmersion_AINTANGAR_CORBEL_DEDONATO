<template>
  <div class="login-container">
    <h2>Connexion</h2>
    <form @submit.prevent="login">
      <input v-model="email" type="email" placeholder="Email" required />
      <input v-model="password" type="password" placeholder="Mot de passe" required />
      <button @click="forgotPassword" class="forgot-pswd-btn">J'ai oublié mon mot de passe</button>
      <button type="submit">Se connecter</button>
    </form>

    <button @click="loginWithGoogle">Se connecter avec Google</button>

    <p><RouterLink to="/register">Pas encore de compte ? S'inscrire</RouterLink></p>
  </div>
</template>

<script setup>
import { getAuth, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, sendPasswordResetEmail } from 'firebase/auth';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import UserComposable from '../composables/UserComposable.js';

const { CreateUserData, CheckUserExists } = UserComposable();

const email = ref('');
const password = ref('');
const router = useRouter();
const auth = getAuth();

const login = () => {
  signInWithEmailAndPassword(auth, email.value, password.value)
      .then(() => {
        router.push('/');
      })
      .catch(error => {
        console.log(error.code);
        alert(error.message);
      });
};

const loginWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    const userExists = await CheckUserExists(result.user.email);
    if (!userExists) {
      await CreateUserData(result, result.user.displayName);
    }

    router.push('/');
  } catch (error) {
    console.log(error.code);
    alert(error.message);
  }
};

const forgotPassword = () => {
  if (!email.value) {
    alert('Veuillez entrer votre adresse email.');
    return;
  }
  sendPasswordResetEmail(auth, email.value)
      .then(() => {
        alert('Email de réinitialisation de mot de passe envoyé.');
      })
      .catch(error => {
        console.log(error.code);
        alert(error.message);
      });
};
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

.forgot-pswd-btn {
  background-color: transparent;
  margin-bottom: 10px;
  padding: 0;
  border: none;
  color: blue;
  cursor: pointer;
  border-bottom: 1px solid blue;
  text-align: right;
  width: fit-content;
}
</style>
