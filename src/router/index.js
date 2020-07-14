import Vue from 'vue'
import Router from 'vue-router'
import Home from "../components/Home";
import Login from "../components/Login";
import Register from "../components/Register";
import Course from "../components/Course";
import CourseDetail from "../components/CourseDetail";
Vue.use(Router)

export default new Router({
  routes: [
           {path: '/', component: Home,},
           {path: '/home/', component: Home,},
           {path: '/home/login/', component: Login,},
           {path: '/user/register', component: Register,},
           {path: '/python', component:Course},
           {path: '/course/detail', component: CourseDetail,},

  ]
})
