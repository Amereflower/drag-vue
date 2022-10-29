import Vue from 'vue'
import Router from 'vue-router'
import appDrag from '@/components/appDrag'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/appdrag',
      name: 'index',
      component: appDrag
    }
  ]
})
