import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import RegisterView from "@/views/RegisterView.vue";
import { getAuth } from "firebase/auth";
import LoginView from "@/views/LoginView.vue";
import * as path from "node:path";
import LogoutView from "@/views/LogoutView.vue";



const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: ChatView,
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
})

export default router;
