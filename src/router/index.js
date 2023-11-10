import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Menu',
      component: () => import('../layouts/MainMenuLayout.vue'),
      children: [
        {
          path: '',
          name: 'MainMenu',
          component: () => import('../views/MainMenu/MainMenuPage.vue'),
        },
        {
          path: '/about',
          name: 'AboutPage',
          component: () => import('../views/MainMenu/AboutPage.vue'),
        },
      ],
    },
    {
      path: '/play',
      name: 'PlayMenu',
      component: () => import('../layouts/GameplayLayout.vue'),
      children: [
        {
          path: '/play',
          name: 'LineSelector',
          component: () => import('../views/Game/LineSelector.vue')
        },
        {
          path: '/play/:linea',
          name: 'Gameplay',
          component: () => import('../views/Game/LineGameplay.vue')
        }
      ]
    }
  ]
})

export default router
