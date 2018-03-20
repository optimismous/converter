import Vue from 'vue'
import Router from 'vue-router'
import CurrencyPage from '@/components/CurrencyPage'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'CurrencyPage',
      component: CurrencyPage
    }
  ]
})
