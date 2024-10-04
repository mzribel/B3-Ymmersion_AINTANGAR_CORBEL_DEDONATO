<!--<template>-->
<!--  <div class="login-container">-->
<!--    <h2>Connexion</h2>-->
<!--    <form @submit.prevent="login">-->
<!--      <input v-model="email" type="email" placeholder="Email" required />-->
<!--      <input v-model="password" type="password" placeholder="Mot de passe" required />-->
<!--      <button type="submit">Se connecter</button>-->
<!--    </form>-->
<!--    <button @click="loginWithGoogle">Se connecter avec Google</button>-->
<!--  </div>-->
<!--</template>-->

<!--<script>-->
<!--import { getAuth, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';-->
<!--import { ref, set } from 'firebase/database';-->
<!--import { db } from '../firebase';-->

<!--export default {-->
<!--  data() {-->
<!--    return {-->
<!--      email: '',-->
<!--      password: ''-->
<!--    };-->
<!--  },-->
<!--  methods: {-->
<!--    login() {-->
<!--      const auth = getAuth();-->
<!--      signInWithEmailAndPassword(auth, this.email, this.password)-->
<!--        .then((userCredential) => {-->
<!--          const user = userCredential.user;-->
<!--          this.saveUserToDatabase(user);-->
<!--          this.$router.push('/'); -->
<!--        })-->
<!--        .catch(error => {-->
<!--          console.error('Erreur de connexion:', error);-->
<!--        });-->
<!--    },-->
<!--    loginWithGoogle() {-->
<!--      const auth = getAuth();-->
<!--      const provider = new GoogleAuthProvider();-->
<!--      signInWithPopup(auth, provider)-->
<!--        .then(result => {-->
<!--          const user = result.user;-->
<!--          this.saveUserToDatabase(user);-->
<!--          this.$router.push('/');-->
<!--        })-->
<!--        .catch(error => {-->
<!--          console.error('Erreur avec Google:', error);-->
<!--        });-->
<!--    },-->
<!--    saveUserToDatabase(user) {-->
<!--      const userRef = ref(db, `users/${user.uid}`);-->
<!--      set(userRef, {-->
<!--        uid: user.uid,-->
<!--        displayName: user.displayName || 'Utilisateur anonyme',-->
<!--        email: user.email,-->
<!--        createdAt: Date.now()-->
<!--      });-->
<!--  }-->
<!--</script>-->

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
      })};

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
