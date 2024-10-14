import { createRouter, createWebHistory } from 'vue-router';
import { getAuth } from 'firebase/auth';
import ChatView from '../views/ChatView.vue';
import LoginView from '../views/LoginView.vue';
import LogoutView from "../views/LogoutView.vue";
import RegisterView from "../views/RegisterView.vue";
import UserComposable from "../composables/UserComposable.js";

const { GetAsyncUser } = UserComposable();

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      redirect: to => {
      // the function receives the target route as the argument
      // a relative location doesn't start with `/`
      // or { path: 'profile'}
      return 'chat'
    }
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      beforeEnter: (to, from) => {
        if (getAuth().currentUser) {
          return '/chat';
        }
      }
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
      beforeEnter: (to, from) => {
        if (getAuth().currentUser) {
          return '/chat';
        }
      }
    },
    {
      path: "/logout",
      name: 'logout',
      component: LogoutView
    },
    {
      path: '/chat',
      name: 'chat',
      component: ChatView,
      beforeEnter: (async (to, from)=> {
        const currentUser = await GetAsyncUser();
        if (!currentUser) { return "/login" }
      })
    },
    {
      path: '/chat/:groupId',
      name: 'chatID',
      component: ChatView,
      beforeEnter: (async (to, from)=> {
        const currentUser = await GetAsyncUser();
        if (!currentUser) { return "/login" }
      })
    },
  ]
});

export default router;
