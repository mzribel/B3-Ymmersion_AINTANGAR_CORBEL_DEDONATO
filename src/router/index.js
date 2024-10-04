import { createRouter, createWebHistory } from 'vue-router';
import { getAuth } from 'firebase/auth'; 
import ChatView from '../views/MainView.vue'; 
import LoginView from '../views/LoginView.vue';
import GroupChat from '../views/GroupChat.vue'; 

const routes = [
  {
    path: '/',
    name: 'home',
    component: ChatView 
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView 
  },
  {
    path: '/group/:groupId',
    name: 'groupChat',
    component: GroupChat, 
    props: true
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

router.beforeEach((to, from, next) => {
  const auth = getAuth(); 
  const user = auth.currentUser; 

  if (to.name !== 'login' && !user) {
    next({ name: 'login' });
  } else {
    next();
  }
});

export default router;
