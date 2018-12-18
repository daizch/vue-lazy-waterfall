import Vue from 'vue'
import Router from 'vue-router'
import BasicApp from '../examples/basic-app.vue'
import LazyApp from '../examples/lazy-app.vue'
Vue.use(Router)


export default new Router({
  routes: [
    {
      path: '/',
      component: BasicApp
    },
    {
      path: '/lazy',
      component: LazyApp
    },
  ]
})
