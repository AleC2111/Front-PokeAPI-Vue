import { createRouter, createWebHistory } from 'vue-router'
import SingleSearchView from '../views/SingleSearchView.vue'
import AboutView from '../views/AboutView.vue'

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
