import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: Home,
    children: [
      {
        path: '/',
        name: 'home'
      }
    ]
  }, {
    path: '/login',
    name: 'login',
    component: () => import('@/views/Login')
  }
]

const router = new VueRouter({
  routes
})

export default router
