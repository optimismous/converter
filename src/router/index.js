import Vue from 'vue'
import Router from 'vue-router'
import CurrencyConverter from '@/components/CurrencyConverter'

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
