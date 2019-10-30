import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Cookie from 'js-cookie'

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
        component: () => import('@/views/components/UserManagement'),
        meta: {
          login_require: true 
        }
      }, {
        path: '/purchase/supplier',
        name: 'Supplier',
        component: () => import('@/views/components/purchase/Supplier'),
        meta: {
          login_require: true 
        }
      }, {
        path: '/purchase/add-purchase-note',
        name: 'AddPurchaseNote',
        component: () => import('@/views/components/purchase/AddPurchaseNote'),
        meta: {
          login_require: true 
        }
      }, {
        path: '/purchase/done-purchase-note',
        name: 'DonePurchaseNote',
        component: () => import('@/views/components/purchase/DonePurchaseNote'),
        meta: {
          login_require: true 
        }
      }, {
        path: '/sell-manage/product-category-manage',
        name: 'ProductCategoryManage',
        component: () => import('@/views/components/ProductCategoryManage'),
        meta: {
          login_require: true 
        }
      }, {
        path: '/sell-manage/product-manage',
        name: 'ProductManage',
        component: () => import('@/views/components/ProductManage'),
        meta: {
          login_require: true 
        }
      }, {
        path: '/purchase/add-purchase-note/add-note',
        name: 'AddNote',
        component: () => import('@/views/components/purchase/templates/AddNote'),
        meta: {
          login_require: true 
        }
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

router.beforeEach((to, from , next) => {
  if (to.meta.login_require) {
    const account = Cookie.get('account')
    if (account) {
      next ()
    } else {
      next ('/sys-manage/login')
    }
  } else {
    next ()
  }
})



export default router
