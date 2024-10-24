import App from './App'
import uView from '@/uni_modules/uview-ui'
import 'styles/reset.css'
import AppletHeader from '@/components/AppletHeader/AppletHeader.vue'

// #ifndef VUE3
import Vue from 'vue'
import './uni.promisify.adaptor'
Vue.use(uView)
uni.$u.setConfig({
	props: {
		form: {
			size: 14
		}
	}
})

Vue.component('AppletHeader', AppletHeader)
Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
  ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif