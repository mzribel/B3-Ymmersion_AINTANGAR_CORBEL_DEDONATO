import './assets/css/main.css'
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyClYg2uDrwUfNlb1sav20j3K7IUyn73yN0",
  authDomain: "ymmersion-b3-5254b.firebaseapp.com",
  projectId: "ymmersion-b3-5254b",
  storageBucket: "ymmersion-b3-5254b.appspot.com",
  messagingSenderId: "866490646562",
  appId: "1:866490646562:web:92b456751d3d83e1db8a7b"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const app = createApp(App);

app.use(router);

app.mount("#app");

// const auth = getAuth();
// onAuthStateChanged(auth, user => {
//   if (!app) {
//     app = createApp(App).use(router).mount('#app');
//   }
//   if (user) {
//     console.log("Utilisateur connecté :", user);
//   } else {
//     console.log("Aucun utilisateur connecté");
//   }
// });
