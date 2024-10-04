import './assets/css/main.css'

// import { createApp } from "vue";
// import App from "./App.vue";
// import router from "./router";
// import firebase from "firebase";
//
// const firebaseConfig = {
//   apiKey: "YOUR_API_KEY",
//   authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
//   databaseURL: "https://YOUR_PROJECT_ID.firebaseio.com",
//   projectId: "YOUR_PROJECT_ID",
//   storageBucket: "YOUR_PROJECT_ID.appspot.com",
//   messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
//   appId: "YOUR_APP_ID"
// };
//
//
// const app = createApp(App)
//
// app.use(router)
//
// app.mount('#app')

import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import * as firebase from "firebase/app";

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
