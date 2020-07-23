<template>
    <div class="user-order">
        <Header/>
        <div class="main">
            <div class="banner"></div>
            <div class="profile">
                <div class="profile-info">
                    <div class="avatar"><img class="newImg" width="100%" alt="" src="../../static/image/logo.png"></div>
                    <span class="user-name">{{user.username}} </span>
                    <span class="user-job">北京市 | Python</span>
                </div>
                <ul class="my-item">
                    <li :class="tabIndex===1?'active':''" @click="tabIndex=1">我的账户</li>
                    <li :class="tabIndex===2?'active':''" @click="tabIndex=2">我的订单</li>
                    <li :class="tabIndex===3?'active':''" @click="tabIndex=3">个人资料</li>
                    <li :class="tabIndex===4?'active':''" @click="tabIndex=4">账号安全</li>
                </ul>
            </div>
            <div class="user-data" v-if="tabIndex===2">
                <ul class="nav">
                    <li class="order-info">订单</li>
                    <li class="course-expire">有效期</li>
                    <li class="course-price">课程价格</li>
                    <li class="real-price">实付金额</li>
                    <li class="order-status">交易状态</li>
                    <li class="order-do">交易操作</li>
                </ul>
                <div class="my-order-item"  v-for="order in this.order_list">
                    <div class="user-data-header">
                        <span class="order-time">{{order.create_time}}</span>
                        <span class="order-num">订单号：
                        <span class="my-older-number">{{order.order_number}}</span>
                    </span>
                    </div>
                    <ul class="nav user-data-list" v-for="course in order.myorders">
                        <li class="order-info">
                            <img :src="course.course_img" alt="">
                            <div class="order-info-title">
                                <p class="course-title">{{course.course_name}}</p>
                                <p class="price-service">{{course.discount_name}}</p>
                            </div>
                        </li>
                        <li class="course-expire" v-if="course.expire===0">永久</li>
                        <li class="course-expire" v-else-if="course.expire===1">一个月</li>
                        <li class="course-expire" v-else-if="course.expire===2">两个月</li>
                        <li class="course-expire" v-else-if="course.expire===3">半年</li>
                        <li class="course-price">{{course.price}}</li>
                        <li class="real-price">{{course.real_price}}</li>
                        <li class="order-status" v-if="order.order_status===0">未支付</li>
                        <li class="order-status" v-else-if="order.order_status===1">已支付</li>
                        <li class="order-status" v-else-if="order.order_status===2">已取消</li>
                        <li class="order-status" v-else-if="order.order_status===3">超时取消</li>
                        <li class="order-do">
                            <span class="btn btn2" v-if="order.order_status===0">去结算</span>
                            <span class="btn btn2" v-if="order.order_status===1">去学习</span>

                        </li>
                    </ul>
                </div>
            </div>
          <div class="user-data" v-if="tabIndex===3">
            <div v-html="user.brief_html"></div>
          </div>
          <div class="user-data" v-if="tabIndex===4">
            <div class="success-tips">
                              <p class="tips1">这里还未完成哦 要完成：UpdateMixin:用户各字段的修改，密码的修改（发送短信验证），邮箱绑定与验证，退出登录和切换用户 </p>
            </div>
          </div>
            <div v-if="tabIndex===1">

              <div class="success">

                  <div class="main">
                      <div class="title">
                          <!--          <img src="../../static/images/right.svg" alt="">-->
                          <div class="success-tips">
                              <p class="tips1">用户名:{{user.username}} </p>
                          </div>
                      </div>
                      <div class="order-info">
                          <p class="info1"><b>ID：</b><span>{{user.id}}</span></p>
                          <p class="info2"><b>电话：</b><span>{{user.phone}}</span></p>
                          <p class="info3"><b>邮箱：</b><span>{{user.email}}</span></p>
                          <p class="info4"><b>注册时间：</b><span>{{user.date_joined}}</span></p>
                      </div>
                  </div>

    </div>
            </div>
        </div>
        <Footer/>
    </div>
</template>

<script>
    import Header from "./common/Header"
    import Footer from "./common/Footer"

    export default {
        name: "UserOrder",
        data() {
            return {
              order_list:[],
              user:[],
              tabIndex:1
            };
        },
        created() {
            this.check_user();

        },
        methods: {
            get_user(){
                let id = localStorage.user_id||sessionStorage.user_id
                this.$axios.get(`${this.$settings.HOST}user/getuser/`+id).then(response => {
                    this.user=response.data
                    console.log(this.user,'user');
                }).catch(error => {
                    console.log(error.response);
                })
            },
            check_user() {
                let token = localStorage.user_token || sessionStorage.user_token;
                if (!token) {
                    this.$alert("对不起，您尚未登录，请登录以后查看个人信息哦").then(() => {
                        this.$router.push("/home/login/");
                    })
                }else {
                  this.get_user_order()
                  this.get_user()
                }
            },
            get_user_order() {
                // 获取当前登录用户的所有订单
              let user_id=localStorage.user_id || sessionStorage.user_id
              this.$axios.get(`${this.$settings.HOST}order/oederlist/`,{
                  params:{
                    user_id:user_id
                  }
              }).then(response => {
                    console.log(response.data);
                    this.order_list = response.data.results
                    console.log('3333',this.order_list)
                }).catch(error => {
                    console.log(error.response);
                })
            },
        },
        components: {
            Header,
            Footer,
        }
    }
</script>

<style scoped>
   .success {
        padding-top: 80px;
    }

    .main {
        height: 100%;
        padding-top: 25px;
        padding-bottom: 25px;
        margin: 0 auto;
        width: 1200px;
        background: #fff;
    }

    .main .title {
        display: flex;
        -ms-flex-align: center;
        align-items: center;
        padding: 25px 40px;
        border-bottom: 1px solid #f2f2f2;
    }

    .main .title .success-tips {
        box-sizing: border-box;
    }

    .title img {
        vertical-align: middle;
        width: 60px;
        height: 60px;
        margin-right: 40px;
    }

    .title .success-tips {
        box-sizing: border-box;
    }

    .title .tips1 {
        font-size: 22px;
        color: #000;
    }

    .title .tips2 {
        font-size: 16px;
        color: #4a4a4a;
        letter-spacing: 0;
        text-align: center;
        margin-top: 10px;
    }

    .title .tips2 span {
        color: #ec6730;
    }

    .order-info {
        padding: 25px 48px;
        padding-bottom: 15px;
        border-bottom: 1px solid #f2f2f2;
    }

    .order-info p {
        display: -ms-flexbox;
        display: flex;
        margin-bottom: 10px;
        font-size: 16px;
    }

    .order-info p b {
        font-weight: 400;
        color: #9d9d9d;
        white-space: nowrap;
    }
    .main .banner {
        width: 100%;
        height: 324px;
        background: url(../../static/image/03.png) no-repeat;
        background-size: cover;
        z-index: 1;
    }

    .profile {
        width: 1200px;
        margin: 0 auto;
    }

    .profile-info {
        text-align: center;
        margin-top: -80px;
    }

    .avatar {
        width: 120px;
        height: 120px;
        border-radius: 60px;
        overflow: hidden;
        margin: 0 auto;
    }

    .user-name {
        display: block;
        font-size: 24px;
        color: #4a4a4a;
        margin-top: 14px;
    }

    .user-job {
        display: block;
        font-size: 11px;
        color: #9b9b9b;
    }

    .my-item {
        list-style: none;
        line-height: 1.42857143;
        color: #333;
        width: 474px;
        height: 31px;
        display: -ms-flexbox;
        display: flex;
        cursor: pointer;
        margin: 41px auto 0;
        -ms-flex-pack: justify;
        justify-content: space-between;
    }

    .my-item .active {
        border-bottom: 1px solid #000;
    }

    .user-data {
        width: 1200px;
        height: auto;
        margin: 0 auto;
        padding-top: 30px;
        border-top: 1px solid #e8e8e8;
        margin-bottom: 63px;
    }

    .nav {
        width: 100%;
        height: 60px;
        background: #e9e9e9;
        display: -ms-flexbox;
        display: flex;
        -ms-flex-align: center;
        align-items: center;
    }

    .nav li {
        margin-left: 20px;
        margin-right: 28px;
        height: 60px;
        line-height: 60px;
        list-style: none;
        font-size: 13px;
        color: #333;
        border-bottom: 1px solid #e9e9e9;
        width: 160px;
    }

    .nav .order-info {
        width: 325px;
    }

    .nav .course-expire {
        width: 60px;
    }

    .nav .course-price {
        width: 130px;
    }

    .user-data-header {
        display: flex;
        height: 44px;
        color: #4a4a4a;
        font-size: 14px;
        background: #f3f3f3;
        -ms-flex-align: center;
        align-items: center;
    }

    .order-time {
        font-size: 12px;
        display: inline-block;
        margin-left: 20px;
    }

    .order-num {
        font-size: 12px;
        display: inline-block;
        margin-left: 29px;
    }

    .user-data-list {
        height: 100%;
        display: flex;
    }

    .user-data-list {
        background: none;
    }

    .user-data-list li {
        height: 60px;
        line-height: 60px;
    }

    .user-data-list .order-info {
        display: flex;
        align-items: center;
        margin-right: 28px;
    }

    .user-data-list .order-info img {
        max-width: 100px;
        max-height: 75px;
        margin-right: 22px;
    }

    .course-title {
        width: 203px;
        font-size: 13px;
        color: #333;
        line-height: 20px;
        margin-top: -10px;
    }

    .order-info-title .price-service {
        line-height: 18px;
    }

    .price-service {
        font-size: 12px;
        color: #fa6240;
        padding: 0 5px;
        border: 1px solid #fa6240;
        border-radius: 4px;
        margin-top: 4px;
        position: absolute;
    }

    .order-info-title {
        margin-top: -10px;
    }

    .user-data-list .course-expire {
        font-size: 12px;
        color: #ff5502;
        width: 60px;
        text-align: center;
    }

    .btn {
        width: 100px;
        height: 32px;
        font-size: 14px;
        color: #fff;
        background: #ffc210;
        border-radius: 4px;
        border: none;
        outline: none;
        transition: all .25s ease;
        display: inline-block;
        line-height: 32px;
        text-align: center;
        cursor: pointer;
    }
</style>
