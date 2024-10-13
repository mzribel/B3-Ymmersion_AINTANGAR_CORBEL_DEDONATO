import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faSeedling } from "@fortawesome/free-solid-svg-icons"
library.add(faSeedling)
const app = createApp(App);
app.component('font-awesome-icon', FontAwesomeIcon)
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
