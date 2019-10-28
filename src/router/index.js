import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: Home,
    redirect: '/sys-manage/user-management',
    children: [
      {
        path: '/sys-manage/user-management',
        name: 'UserManagement',
        component: () => import('@/views/components/UserManagement')
      }, {
        path: '/purchase/supplier',
        name: 'Supplier',
        component: () => import('@/views/components/Supplier')
      }, {
        path: '/purchase/add-purchase-note',
        name: '/AddPurchaseNote',
        component: () => import('@/views/components/AddPurchaseNote')
      }, {
        path: '/purchase/done-purchase-note',
        name: 'DonePurchaseNote',
        component: () => import('@/views/components/AddPurchaseNote')
      }
    ]
  }, {
    path: '/sys-manage/login',
    name: 'login',
    component: () => import('@/views/Login')
  }
]

const router = new VueRouter({
  routes
})

export default router
