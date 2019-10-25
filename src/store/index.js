import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import qs from 'querystring'
import Cookie from ''

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    loginUser: Cookie.get('account'),
    token: Cookie.get('token')
  },
  mutations: {
  },
  actions: {
    login ({commit}, payload) {
      return new Promise((resolve, reject) => {
        axios({
          method: 'POST',
          url: 'api/sys/login',
          data: qs.stringify(payload.user)
        }).then(
          resp => {
            const result = reap.data
            if (result.code === 2) {
              resolve(result)
              console.log(result)
              Cookie.set('account', result.data.user.account)
              Cookie.set('token', result.data.token)
            } else {
              reject(result)
            }
          }
        )
      })
    }
  },
  modules: {
  }
})
