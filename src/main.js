import Vue from 'vue'
import App from './app.vue'
import router from './routers'
import store from './store'
import '@/styles/reset.less'
// Element UI
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import 'babel-polyfill'
Vue.use(ElementUI)
import Vue2OrgTree from 'vue2-org-tree'

Vue.use(Vue2OrgTree)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: (h) => h(App)
}).$mount('#app')
