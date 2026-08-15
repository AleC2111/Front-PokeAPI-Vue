import { createRouter, createWebHistory } from 'vue-router'
import SingleSearchView from '../views/SingleSearchView.vue'
import AboutView from '../views/AboutView.vue'
import CompareSearchView from '../views/CompareSearchView.vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import FavoritesView from '../views/FavoritesView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: AboutView,
    },
    {
      path: '/single-search',
      name: 'single-search',
      component: SingleSearchView,
    },
    {
      path: '/compare-search',
      name: 'compare-search',
      component: CompareSearchView,
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
    },
    {
      path: '/favorites',
      name: 'favorites',
      component: FavoritesView,
    },
    {
      path: '/list-search',
      name: 'list-search',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/ListSearchView.vue'),
    },
  ],
})

export default router
