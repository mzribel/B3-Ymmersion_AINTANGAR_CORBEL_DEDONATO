import { createRouter, createWebHistory } from 'vue-router';
import ChatView from '../views/ChatView.vue';
import LoginView from '../views/LoginView.vue';
import { getAuth } from 'firebase/auth';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: ChatView,
      meta: { requiresAuth: true }  // Protection par authentification
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    }
  ]
});

// Navigation guard pour vérifier l'authentification
router.beforeEach((to, from, next) => {
  const auth = getAuth();
  const user = auth.currentUser;

  if (to.matched.some(record => record.meta.requiresAuth) && !user) {
    next('/login');  // Rediriger vers la page de connexion si non connecté
  } else {
    next();  // Sinon, continuer la navigation
  }
});

export default router;
