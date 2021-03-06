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
        component: () => import('@/views/components/sell/ProductCategoryManage'),
        meta: {
          login_require: true 
        }
      }, {
        path: '/sell-manage/product-manage',
        name: 'ProductManage',
        component: () => import('@/views/components/sell/ProductManage'),
        meta: {
          login_require: true 
        }
      }, {
        path: '/sell-manage/customer',
        name: 'Customer',
        component: () => import('@/views/components/sell/Customer'),
        meta: {
          login_require: true 
        }
      }, {
        path: '/sell-manage/add-somain',
        name: 'AddSomain',
        component: () => import('@/views/components/sell/AddSomain'),
        meta: {
          login_require: true 
        }
      }, {
        path: '/sell-manage/add-somain/add-somain-note',
        name: 'AddSomainNote',
        component: () => import('@/views/components/sell/templates/AddSomainNote'),
        meta: {
          login_require: true 
        }
      }, {
        path: '/sell-manage/somain-end',
        name: 'SomainEnd',
        component: () => import('@/views/components/sell/SomainEnd'),
        meta: {
          login_require: true 
        }
      }, {
        path: '/sell-manage/somain-query',
        name: 'SomainQuery',
        component: () => import('@/views/components/sell/SomainQuery'),
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
      }, {
        path: '/purchase/purchase-query',
        name: 'PurchaseQuery',
        component: () => import('@/views/components/purchase/PurchaseQuery'),
        meta: {
          login_require: true 
        }
      }, {
        path: '/stock/in-stock',
        name: 'InStock',
        component: () => import('@/views/components/stockManage/InStock'),
        meta: {
          login_require: true 
        }
      }, {
        path: '/stock/out-stock',
        name: 'OutStock',
        component: () => import('@/views/components/stockManage/OutStock'),
        meta: {
          login_require: true 
        }
      }, {
        path: '/stock/stock-query',
        name: 'StockQuery',
        component: () => import('@/views/components/stockManage/StockQuery'),
        meta: {
          login_require: true 
        }
      }, {
        path: '/stock/check-stock',
        name: 'CheckStock',
        component: () => import('@/views/components/stockManage/CheckStock'),
        meta: {
          login_require: true 
        }
      }, {
        path: '/finance/pay',
        name: 'Pay',
        component: () => import('@/views/components/finance/Pay'),
        meta: {
          login_require: true 
        }
      }, {
        path: '/finance/receipt',
        name: 'Receipt',
        component: () => import('@/views/components/finance/Receipt'),
        meta: {
          login_require: true 
        }
      }, {
        path: '/finance/finance-query',
        name: 'FinanceQuery',
        component: () => import('@/views/components/finance/FinanceQuery'),
        meta: {
          login_require: true 
        }
      }, {
        path: '/report/pomain-report',
        name: 'PomainReport',
        component: () => import('@/views/components/report/PomainReport'),
        meta: {
          login_require: true 
        }
      }, {
        path: '/report/payment-report',
        name: 'PaymentReport',
        component: () => import('@/views/components/report/PaymentReport'),
        meta: {
          login_require: true 
        }
      }, {
        path: '/report/instock-report',
        name: 'InstockReport',
        component: () => import('@/views/components/report/InstockReport'),
        meta: {
          login_require: true 
        }
      }, {
        path: '/report/outstock-report',
        name: 'OutstockReport',
        component: () => import('@/views/components/report/OutstockReport'),
        meta: {
          login_require: true 
        }
      }, {
        path: '/report/stock-report',
        name: 'StockReport',
        component: () => import('@/views/components/report/StockReport'),
        meta: {
          login_require: true 
        }
      }, {
        path: '/report/somain-report',
        name: 'SomainReport',
        component: () => import('@/views/components/report/SomainReport'),
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
