<template>
  <main>
    <h1>Register</h1>

    <p><input type="text" placeholder="Pseudo" v-model="displayName" /></p>

    <p><input type="text" placeholder="Email" v-model="email" /></p>

    <p><input type="password" placeholder="Password" v-model="password" /></p>

    <p><input type="password" placeholder="Confirm Password" v-model="confirmPassword" /></p>

    <p v-if="passwordMismatch" class="error-message">Mots de passes différents.</p>

    <p><button @click="registerWithEmail" :disabled="passwordMismatch">Submit</button></p>

    <br>

    <p><RouterLink to="/login">Already have an account?</RouterLink></p>
  </main>
</template>

<script setup>
import { ref, watch } from 'vue';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
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
      .then((data) => {
        CreateUserData(data, displayName.value);
        router.push('/');
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
</style>
