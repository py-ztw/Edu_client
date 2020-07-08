<template>
    <div class="footer">
        <ul>
             <li v-for="(nav, key) in nav_list" :key="key">
               <a :href="nav.link"v-if="nav.position === 2" style="color: azure">{{nav.title}}</a>
             </li>
        </ul>
    </div>
</template>

<script>
    export default {
        name: "Footer",
        data(){
            return{
                nav_list:[],
            }
        },
        methods:{
            get_all_banner(){
                this.$axios({
                    url:this.$settings.HOST+'home/nav/',
                    method: "get",
                }).then(res=>{
                    console.log(res.data);
                    this.nav_list = res.data;
                    console.log(this.nav_list)
                }).catch(error=>{
                    console.log(error);
                })
            },
        },
        created() {
            // 获取轮播图数据
            this.get_all_banner();
        }
    }
</script>

<style scoped>
    .footer {
        width: 100%;
        height: 128px;
        background: #25292e;
        color: #fff;
    }

    .footer ul {
        margin: 0 auto 16px;
        padding-top: 38px;
        width: 810px;
    }

    .footer ul li {
        float: left;
        width: 112px;
        margin: 0 10px;
        text-align: center;
        font-size: 14px;
    }

    .footer ul::after {
        content: "";
        display: block;
        clear: both;
    }

    .footer p {
        text-align: center;
        font-size: 12px;
    }
</style>
