import { createRouter, createWebHistory } from 'vue-router';
import { getAuth } from 'firebase/auth'; 
import ChatView from '../views/MainView.vue'; 
import LoginView from '../views/LoginView.vue';
import GroupChat from '../views/GroupChat.vue';
import MainView from "@/views/MainView.vue";
import LogoutView from "@/views/LogoutView.vue";
import RegisterView from "@/views/RegisterView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: MainView,
      beforeEnter: (to, from) => {
        if (!getAuth().currentUser) {
          return '/login';
        }
      }
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      beforeEnter: (to, from) => {
        if (getAuth().currentUser) {
          return '/';
        }
      }
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
      beforeEnter: (to, from) => {
        if (getAuth().currentUser) {
          return '/';
        }
      }
    },
    {
      path: "/logout",
      name: 'logout',
      component: LogoutView
    },
    {
      path: '/group/:groupId',
      name: 'groupChat',
      component: GroupChat,
      props: true
    }
  ]
});



export default router;
