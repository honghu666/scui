import Vue from 'vue'
import VueRouter from 'vue-router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import App from './App.vue'
import Clipboard from 'clipboard';
import HomePage from './components/HomePage';
import AboutPage from './components/AboutPage';

Vue.use(ElementUI);
Vue.use(VueRouter);
Vue.config.productionTip = false;
Vue.prototype.Clipboard = Clipboard;

const routes = [{
    path: '/',
    redirect: '/home'
  }, {
    path: '/home',
    component: HomePage
  },
  {
    path: '/bar',
    component: AboutPage
  }
]
const router = new VueRouter({
  routes // (缩写) 相当于 routes: routes
})

new Vue({
  router,
  render: h => h(App),
}).$mount('#app');