// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from './App.vue';
import router from './router';
import VueResource from 'vue-resource'
import VueAwesomeSwiper from 'vue-awesome-swiper' // 引入轮播图插件
import 'swiper/dist/css/swiper.css'  // 样式
Vue.use(ElementUI);
Vue.use(VueResource);
Vue.use(VueAwesomeSwiper, /* { default global options } */)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    components: { App },
    template: '<App/>'
})