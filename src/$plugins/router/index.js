import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

export default new VueRouter({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Search',
      component: () => import('@/views/SearchView.vue')
    },
    {
      path: '/results/:id',
      name: 'Result',
      component: () => import(/* webpackChunkName: "result" */ '@/views/ResultView.vue')
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
