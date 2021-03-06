// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from  './store/index'

Vue.config.productionTip = false
import axios from "axios"
Vue.prototype.$axios =axios;
// 导入Element UI的组件
import ElementUI from 'element-ui'
// 导入样式
import "element-ui/lib/theme-chalk/index.css"

// 全局注册element组件
Vue.use(ElementUI);
Vue.config.productionTip = false;

//自定义域名
import settings from "./settings";
Vue.prototype.$settings = settings;


// vue-video-player
require('video.js/dist/video-js.css');
require('vue-video-player/src/custom-theme.css');
import VideoPlayer from 'vue-video-player'

Vue.use(VideoPlayer);

// 全局css
import "../static/css/global.css"

// 导入极验
import "../static/js/gt.js"
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
