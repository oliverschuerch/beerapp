import Vue from 'vue'
import App from '@/App.vue'
import router from '@/$plugins/router'
import store from '@/$plugins/store'
import http from '@/$plugins/http'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  http,
  render: h => h(App)
}).$mount('#app')
