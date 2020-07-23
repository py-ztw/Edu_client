<template>
    <div class="login box">
        <img src="../../static/image/3dbcb2a9d8da469db071116bf60529e2.jpeg" alt="">
        <div class="login">
            <div class="login-title">
                <img src="../../static/image/logo.png" alt="">
                <p>百知教育给你最优质的学习体验!</p>
            </div>
           <div class="login_box">
                <div class="title">
                    <span @click="change_login(1)">密码登录</span>
                    <span @click="change_login(2)">短信登录</span>
                </div>
                <div class="inp"  v-if="category==1">
                    <input  type="text" placeholder="用户名 / 手机号码" class="user" v-model="username">
                    <input type="password" name="" class="pwd" placeholder="密码" v-model="password">
                  <div id="geetest1"></div>
                    <div class="rember">
                        <p>
                            <input type="checkbox" class="no" v-model="remember_me"  id="rem" checked="checked"/>
                            <span>记住密码</span>
                        </p>
                        <p>忘记密码</p>
                    </div>
                    <button class="login_btn btn btn-primary" @click="get_captcha">登录</button>
                    <p class="go_login">没有账号
                        <router-link to="/user/register" style="color: greenyellow"> 立即注册</router-link>
                    </p>
                </div>
                <div class="inp" v-if="category==2">
                    <input type="text" placeholder="手机号码" class="user" v-model="username"  @blur="checkMobile">
                    <div class="sms-box">
                        <input v-model="code" type="text" maxlength="6" placeholder="输入验证码" class="user">
                        <div class="sms-btn" @click="get_code">{{sms_text}}</div>
                    </div>
                    <div id="geetest2"></div>
                    <button class="login_btn" @click="user_register">登录</button>
                    <span class="go_login">没有账号
                    <router-link to="/user/register" style="color: greenyellow"> 立即注册</router-link>
                </span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "Login",
        data() {
            return {
                username: "",
                password: "",
                remember_me: false,
                category:1,
                sms_text: "点击获取验证码", // 提示语
                user_phone:"",
                code:"",

            }
        },
        methods: {

          user_register() {
                this.$axios({
                    url: this.$settings.HOST + "user/userlogin/",
                    method: "post",
                    data: {
                        phone: this.username,
                        sms_code: this.code,
                    }
                }).then(response => {
                     localStorage.clear();
                     sessionStorage.clear()
                    // localStorage.removeItem("username");
                    this.password=response.data.results['test']
                    this.user_login()
                }).catch(error => {
                    console.log(error.response);
                    this.$message.error("登录失败");
                })
            },
               checkMobile() {
                this.$axios({
                    url: this.$settings.HOST + "user/phone/" + `${this.username}`,
                    method: "get",
                }).catch(error => {
                    this.$message.error(error.response.data)
                })
            },



           get_code() {

                // 验证手机号格式
                if (!/1[35689]\d{9}/.test(this.username)||this.username.length!==11) {
                    this.$alert("手机号格式有误", "警告");
                    return false
                }

                this.$axios({
                    url: this.$settings.HOST + "user/sms/" + `${this.username}`,
                    method: "get",
                }).then(response => {
                    console.log(response.data);

                    // 成功则可以再次发送短信
                    this.sms_flag = true;
                    let interval = 60;
                    let timer = setInterval(() => {
                        if (interval <= 1) {
                            // 停止倒计时  允许发送短信
                            clearInterval(timer);
                            this.sms_flag = false; // 设置允许发送短信 false
                            this.sms_text = `点击发送短信`
                        } else {
                            interval--;
                            this.sms_text = `${interval}后可以点击发送`;
                        }
                    }, 1000)

                }).catch(error => {
                    console.log(error.response);
                    this.$message.error("当前手机号已经发送过短信")
                })
            },
            change_login(num){
              this.category=num
            },
            // 点击登录时  弹出验证码框 当验证码成功验证后  才可以发起登录请求
            get_captcha() {
                // 向API服务端发起请求获取验证码
                this.$axios({
                    url: this.$settings.HOST + "user/captcha/",
                    method: 'get',
                    params: {
                        username: this.username,
                    }
                }).then(response => {
                    let data = JSON.parse(response.data);
                    // 使用initGeetest接口
                    // 参数1：配置参数
                    // 参数2：回调，回调的第一个参数验证码对象，之后可以使用它做appendTo之类的事件
                    initGeetest({
                        gt: data.gt,
                        challenge: data.challenge,
                        product: "popup", // 产品形式，包括：float，embed，popup。注意只对PC版验证码有效
                        offline: !data.success, // 表示用户后台检测极验服务器是否宕机，一般不需要关注
                        new_captcha: data.new_captcha
                    }, this.handlerPopup);

                }).catch(error => {
                    console.log(error);
                    this.$message.error("用户名或密码错误");
                })
            },

            // 请求验证码的回调函数  完成验证码的验证
            handlerPopup(captchaObj) {
                // 回调函数中 this指向会被改变成 所以重新赋值
                let self = this;
                captchaObj.onSuccess(function () {
                    let validate = captchaObj.getValidate();
                    self.$axios({
                        url: self.$settings.HOST + "user/captcha/",
                        method: "post",
                        data: {
                            geetest_challenge: validate.geetest_challenge,
                            geetest_validate: validate.geetest_validate,
                            geetest_seccode: validate.geetest_seccode
                        }
                    }).then(response=>{
                        console.log(response.data);
                        if(response.data.status){
                            // 验证码验证成功  登录
                            self.user_login()
                        }
                    }).catch(error=>{
                        console.log(error);
                    });
                });
                if(this.category==1){
                    document.getElementById("geetest1").innerHTML = "";
                captchaObj.appendTo("#geetest1");
                }else {
                   //  将生成的验证码添加到 id为geetest1的div中
                document.getElementById("geetest2").innerHTML = "";
                captchaObj.appendTo("#geetest2");
                }

            },

            // 用户登录的方法
            user_login() {

                this.$axios({
                    url: this.$settings.HOST + "user/login/",
                    method: "post",
                    data: {
                        username: this.username,
                        password: this.password,
                    }
                }).then(response => {
                    console.log(response.data);
                    if (this.remember_me) {
                        // 为True代表需要记住密码  将用户信息记录到localStorage
                        // 需要将sessionStorage中的用户信息删除
                        localStorage.rem =this.remember_me;
                        localStorage.name =this.username;
                        localStorage.pwd =this.password;

                        localStorage.user_token = response.data.token;
                        localStorage.username = response.data.username;
                        localStorage.user_id = response.data.user_id;
                    } else {
                        // 代表用户不需要记住密码  则将已保存的用户信息删除
                        // 用户不需要记住我时  将localStorage中的记录的用户信息删除
                        localStorage.clear()
                        // localStorage.removeItem("username");
                        sessionStorage.username = response.data.username;
                        sessionStorage.user_id = response.data.user_id;
                        sessionStorage.user_token = response.data.token;
                    }
                    this.$message({
                        message: '恭喜你，登录成功',
                        type: 'success'
                    });
                    // 登录成功后返回首页
                    this.$router.push("/");
                }).catch(error => {
                    this.$message.error("用户名或密码错误");
                })
            },
        },

     mounted() {
          if(localStorage.rem){
              this.username= localStorage.name
              this.password= localStorage.pwd
              document.getElementById('rem').checked = 'true'
              this.remember_me=true
          }
      }
    }
</script>

<style scoped>
    .box {
        width: 100%;
        height: 100%;
        position: relative;
        overflow: hidden;
    }

    .box img {
        width: 100%;
        min-height: 100%;
    }

    .box .login {
        position: absolute;
        width: 500px;
        height: 400px;
        top: 0;
        left: 0;
        margin: auto;
        right: 0;
        bottom: 0;
        top: -338px;
    }

    .login .login-title {
        width: 100%;
        text-align: center;
    }

    .login-title img {
        width: 190px;
        height: auto;
    }

    .login-title p {
        font-family: PingFangSC-Regular;
        font-size: 18px;
        color: #fff;
        letter-spacing: .29px;
        padding-top: 10px;
        padding-bottom: 50px;
    }

    .login_box {
        width: 400px;
        height: auto;
        background: #fff;
        box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .5);
        border-radius: 4px;
        margin: 0 auto;
        padding-bottom: 40px;
    }

    .login_box .title {
        font-size: 20px;
        color: #9b9b9b;
        letter-spacing: .32px;
        border-bottom: 1px solid #e6e6e6;
        display: flex;
        justify-content: space-around;
        padding: 50px 60px 0 60px;
        margin-bottom: 20px;
        cursor: pointer;
    }

    .login_box .title span:nth-of-type(1) {
        color: #4a4a4a;
        border-bottom: 2px solid #84cc39;
    }

    .inp {
        width: 350px;
        margin: 0 auto;
    }

    .inp input {
        border: 0;
        outline: 0;
        width: 100%;
        height: 45px;
        border-radius: 4px;
        border: 1px solid #d9d9d9;
        text-indent: 20px;
        font-size: 14px;
        background: #fff !important;
    }

    .inp input.user {
        margin-bottom: 16px;
    }

    .inp .rember {
        display: flex;
        justify-content: space-between;
        align-items: center;
        position: relative;
        margin-top: 10px;
    }

    .inp .rember p:first-of-type {
        font-size: 12px;
        color: #4a4a4a;
        letter-spacing: .19px;
        margin-left: 22px;
        display: -ms-flexbox;
        display: flex;
        -ms-flex-align: center;
        align-items: center;
        /*position: relative;*/
    }

    .inp .rember p:nth-of-type(2) {
        font-size: 14px;
        color: #9b9b9b;
        letter-spacing: .19px;
        cursor: pointer;
    }

    .inp .rember input {
        outline: 0;
        width: 30px;
        height: 45px;
        border-radius: 4px;
        border: 1px solid #d9d9d9;
        text-indent: 20px;
        font-size: 14px;
        background: #fff !important;
    }

    .inp .rember p span {
        display: inline-block;
        font-size: 12px;
        width: 100px;
        /*position: absolute;*/
        /*left: 20px;*/

    }

    #geetest {
        margin-top: 20px;
    }

    .login_btn {
        width: 100%;
        height: 45px;
        background: #84cc39;
        border-radius: 5px;
        font-size: 16px;
        color: #fff;
        letter-spacing: .26px;
        margin-top: 30px;
    }

    .inp .go_login {
        text-align: center;
        font-size: 14px;
        color: #9b9b9b;
        letter-spacing: .26px;
        padding-top: 20px;
    }

    .inp .go_login span {
        color: #84cc39;
        cursor: pointer;
    }
     .sms-box {
        position: relative;
    }

    .sms-btn {
        font-size: 14px;
        color: #ffc210;
        letter-spacing: .26px;
        position: absolute;
        right: 16px;
        top: 10px;
        cursor: pointer;
        overflow: hidden;
        background: #fff;
        border-left: 1px solid #484848;
        padding-left: 16px;
        padding-bottom: 4px;
    }
</style>
