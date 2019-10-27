import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: Home,
    redirect: '/user-management',
    children: [
      {
        path: '/user-management',
        name: 'UserManagement',
        component: () => import('@/views/components/UserManagement')
      }, {
        path: '/supplier',
        name: 'Supplier',
        component: () => import('@/views/components/Supplier')
      }, {
        path: '/add-purchase-note',
        name: '/AddPurchaseNote',
        component: () => import('@/views/components/AddPurchaseNote')
      }, {
        path: '/done-purchase-note',
        name: 'DonePurchaseNote',
        component: () => import('@/views/components/AddPurchaseNote')
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
