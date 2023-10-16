import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui'
import locale from 'element-ui/lib/locale/lang/zh-CN'
import '@/styles/index.scss'
import globalConst from '@/commons/globalConst'

Vue.config.productionTip = false
Vue.use(ElementUI, { locale }).use(globalConst)

new Vue({
  el: '#app',
  render: h => h(App)
}).$mount('#app')
