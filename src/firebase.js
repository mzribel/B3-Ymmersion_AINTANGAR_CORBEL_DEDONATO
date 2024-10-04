import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyClYg2uDrwUfNlb1sav20j3K7IUyn73yN0",
  authDomain: "ymmersion-b3-5254b.firebaseapp.com",
  databaseURL: "https://ymmersion-b3-5254b-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "ymmersion-b3-5254b",
  storageBucket: "ymmersion-b3-5254b.appspot.com",
  messagingSenderId: "866490646562",
  appId: "1:866490646562:web:92b456751d3d83e1db8a7b"
};


const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export { db };