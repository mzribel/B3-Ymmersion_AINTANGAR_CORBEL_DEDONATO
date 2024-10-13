import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faList, faPaperclip, faPaperPlane, faXmark, faRightFromBracket } from "@fortawesome/free-solid-svg-icons"
import { faEnvelope } from "@fortawesome/free-regular-svg-icons"

library.add(faList, faPaperclip, faPaperPlane, faXmark, faEnvelope, faRightFromBracket)
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
