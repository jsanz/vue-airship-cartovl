import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
/* Airship */
import '@carto/airship-style'
import { defineCustomElements } from '@carto/airship-components/dist/loader'

Vue.config.ignoredElements = [/as-\w+/]
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

defineCustomElements(window)
