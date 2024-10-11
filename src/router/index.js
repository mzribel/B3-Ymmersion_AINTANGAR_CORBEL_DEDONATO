import {createRouter, createWebHistory, useRoute, useRouter} from 'vue-router';
import {getAuth, onAuthStateChanged} from 'firebase/auth';
import ChatView from '../views/ChatView.vue';
import LoginView from '../views/LoginView.vue';
import GroupChat from '../views/GroupChat.vue';
import MainView from "../views/MainView.vue";
import LogoutView from "../views/LogoutView.vue";
import RegisterView from "../views/RegisterView.vue";
import UserComposable from "../composables/UserComposable.js"
import {inject} from "vue";

const { GetAsyncUser } = UserComposable();

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: MainView,
      beforeEnter: (async (to, from)=> {
        const currentUser = await GetAsyncUser();
        if (!currentUser) { return "/login" }
      })
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
