<template>
  <div class="login-container">
          <h2>Register</h2>

    <p><input type="text" placeholder="Pseudo" v-model="displayName" /></p>

    <p><input type="text" placeholder="Email" v-model="email" /></p>

    <p><input type="password" placeholder="Password" v-model="password" /></p>

    <p><input type="password" placeholder="Confirm Password" v-model="confirmPassword" /></p>

    <p v-if="passwordMismatch" class="error-message">Mots de passes différents.</p>

    <p><button @click="registerWithEmail" :disabled="passwordMismatch">Submit</button></p>

    <br>

    <p><button @click="registerWithGoogle">Register with Google</button></p>

    <p><RouterLink to="/login">Already have an account?</RouterLink></p>
</div>
</template>

<script setup>
import { ref, watch } from 'vue';
import {getAuth, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup} from 'firebase/auth';
import { useRouter } from 'vue-router';
import UserComposable from '../composables/UserComposable.js';

const { CreateUserData } = UserComposable();

const displayName = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const passwordMismatch = ref(false);
const router = useRouter();
const auth = getAuth();


watch([password, confirmPassword], () => {
  passwordMismatch.value = password.value !== confirmPassword.value;
});

const registerWithEmail = () => {

  createUserWithEmailAndPassword(auth, email.value, password.value)
      .then(async (data) => {
        await CreateUserData(data, displayName.value);
        await router.push('/chat');
      })
      .catch((error) => {
        console.log(error.code);
        alert(error.message);
      });
};

const registerWithGoogle = () => {
  const provider = new GoogleAuthProvider();
  signInWithPopup(auth, provider)
      .then(async (result) => {
        await CreateUserData(result, result.user.displayName);

        await router.push('/chat');
      })
      .catch((error) => {
        console.log(error.code);
        alert(error.message);
      });
};

</script>

<style scoped>

.error-message {
  color: red;
  font-weight: bold;
}
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
  border-bottom: 1px solid black;
  text-align: right;
  width: fit-content;
}
</style>
