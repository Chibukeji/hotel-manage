<template>
  <div class="login-container">
    <div class="login-wrap-box">
      <div class="left-wrap">
        <div class="login-logo">
          <svg-icon icon-class="login-logo" />
        </div>
        <div class="big-title">酒店O2O服务解决方案</div>
        <div class="small-title">驰步优宿商家管理系统为各类型酒店提供客源拓展、接待经营、口碑维护、数据指导、宣传营销、客户管理等一站式解决方案</div>
      </div>
      <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" autocomplete="on" label-position="left" style="width:350px">

        <div class="title-container">
          <h3 class="title">酒店登录</h3>
        </div>

        <el-form-item prop="username">
          <span class="svg-container">
            <svg-icon icon-class="user" />
          </span>
          <el-input
            ref="username"
            v-model="loginForm.username"
            placeholder="账号"
            name="username"
            type="text"
            tabindex="1"
            autocomplete="on"
          />
        </el-form-item>

        <el-tooltip v-model="capsTooltip" content="Caps lock is On" placement="right" manual>
          <el-form-item prop="password">
            <span class="svg-container">
              <svg-icon icon-class="password" />
            </span>
            <el-input
              :key="passwordType"
              ref="password"
              v-model="loginForm.password"
              :type="passwordType"
              placeholder="密码"
              name="password"
              tabindex="2"
              autocomplete="on"
              @keyup.native="checkCapslock"
              @blur="capsTooltip = false"
              @keyup.enter.native="handleLogin"
            />
            <span class="show-pwd" @click="showPwd">
              <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
            </span>
          </el-form-item>
        </el-tooltip>
        <div class="erifycode-wrap-box" >
          <el-form-item prop="verifycode" class="verifycode-input-box">
            <el-input v-model="loginForm.verifycode" placeholder="请输入验证码" class="identifyinput" @keyup.enter.native="handleLogin" />
          </el-form-item>
          <el-form-item class="verifycode-btn-box" style="margin-top:1px">
            <div @click="getCode" class="verifycode-btn">
              <s-identify :identify-code="identifyCode" />
            </div>
          </el-form-item>
        </div>
        <el-button :loading="loading" type="primary" class="login-btn" @click.native.prevent="handleLogin">登陆</el-button>
        <div class="forget-password">
          <span @click="forgetPasswordPage">忘记密码</span>
        </div>
      </el-form>
    </div>
    <div class="footer">
      <div class="footer-wrap">
        <div class="footer-er">
          <img class="footer-img" src="../../assets/images/client.png">
          <div class="footer-font-wrap">
            <div class="footer-title">驰步优宿APP下载</div>
            <div class="footer-msg">为酒店提供一个品牌连锁化的共赢发展平台</div>
          </div>
        </div>
        <div class="footer-er">
          <img class="footer-img" src="../../assets/images/merchant.png">
          <div class="footer-font-wrap">
            <div class="footer-title">驰步优宿APP(商家)下载</div>
            <div class="footer-msg">为酒店提供一个品牌连锁化的共赢发展平台</div>
          </div>
        </div>
        <div class="footer-er">
          <img class="footer-img" src="../../assets/images/wechat-code.png" alt="">
          <div class="footer-font-wrap">
            <div class="footer-title">关注公众号</div>
            <div class="footer-msg">打开微信，扫描二维码点击关注完成绑定</div>
          </div>
        </div>
      </div>
      <div class="footer-back">
        <div>24小时分时入住</div>
        <div class="e-phone">400-765-9131</div>
      </div>
    </div>
  </div>
</template>

<script>
import { validUsername } from '@/utils/validate'
import SIdentify from '../../components/identify/index'
import { getVerifiCode} from '@/api/user'
export default {
  name: 'Login',
  components: { SIdentify },
  data() {
    // 验证账号
    const validateUsername = (rule, value, callback) => {
      /* if (!validUsername(value)) {
        callback(new Error('Please enter the correct user name'))
      } else {  */
      callback()
      // }
    }
    // 验证密码
    const validatePassword = (rule, value, callback) => {
      // if (value.length < 6) {
      //   callback(new Error('密码不能少于6位'))
      // } else {
        callback()
      // }
    }
    return {
      loginForm: {
        username: '',
        password: '',
        verifycode: ''
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }],
      },
      passwordType: 'password',
      capsTooltip: false,
      loading: false,
      showDialog: false,
      redirect: undefined,
      otherQuery: {},
      identifyCode: '',
      verifi_key:'',
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        const query = route.query
        if (query) {
          this.redirect = query.redirect
          this.otherQuery = this.getOtherQuery(query)
        }
      },
      immediate: true
    }
  },
  created() {
    // window.addEventListener('storage', this.afterQRScan)
  },
  mounted() {
    this.getCode()
    if (this.loginForm.username === '') {
      this.$refs.username.focus()
    } else if (this.loginForm.password === '') {
      this.$refs.password.focus()
    }
  },
  destroyed() {
    // window.removeEventListener('storage', this.afterQRScan)
  },
  methods: {
    //获取验证码
    getCode(){
      let num = []
      for (var i = 0; i < 4; i++) {
        num += Math.floor(Math.random() * 9 + 1);
      }
      var timestamp = Date.parse(new Date());
      // console.log(timestamp+num)
      this.verifi_key = timestamp+num
      getVerifiCode({verifi_key:this.verifi_key}).then(res=>{
        this.identifyCode = res.data.verifi_code
      })
    },
    checkCapslock(e) {
      const { key } = e
      this.capsTooltip = key && key.length === 1 && (key >= 'A' && key <= 'Z')
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          let params
          if(this.loginForm.verifycode == '' || this.loginForm.verifycode == null){
            this.$message({
              message:'请输入验证码',
              type: 'warning',
            })
            return
          }
          params={
            username: this.loginForm.username.trim(), 
            password: this.loginForm.password,
            verifi_code:this.loginForm.verifycode.replace(/\s+/g,""),
            verifi_key:this.verifi_key
          }                              
          this.loading = true
          this.$store.dispatch('user/login', params).then(async(res) => {
              // this.$router.push({ path: this.redirect || '/', query: this.otherQuery })
              // console.log('res',res)
              this.loading = false
              const { roles } = await this.$store.dispatch('user/getInfo')
              const accessRoutes = await this.$store.dispatch('permission/generateRoutes', roles)
              this.$router.push({ path: accessRoutes[0].path + '/' + accessRoutes[0].children[0].path, query: this.otherQuery })
              location.reload()
            })
            .catch(() => {
              this.loading = false
            })
        } else {
          console.log('error submit!!')
          return false
        }
        this.getCode()
      })
    },
    getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== 'redirect') {
          acc[cur] = query[cur]
        }
        return acc
      }, {})
    },
    //忘记密码
    forgetPasswordPage(){
      this.$router.push('/forget-password')
    }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg:#283443;
$light_gray:#fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 40px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color:#000;
      height: 40px;
      caret-color: #000;

      // &:-webkit-autofill {
      //   box-shadow: 0 0 0px 1000px $bg inset !important;
      //   -webkit-text-fill-color: $cursor !important;
      // }
    }
  }

  .el-form-item {
    // border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;

.login-container {
  height: 100%;
  width: 100%;
  background: url('../../assets/images/login-back.png');
  overflow: hidden;
  background-size: 100% 100%;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  .login-wrap-box{
    width: 70%;
    display: flex;
    justify-content: center;
    margin-top: -150px;
    .left-wrap{
      flex: 1;
      margin-top:100px;
      margin-right: 40px;
      .login-logo{
        svg{
          font-size: 60px;
          width: 250px;
          text-align: left;
          margin-left: -14px;
          margin-bottom: 20px;
        }
      }
      .big-title{
        font-size: 28px;
        color: rgba(255,255,255, .9);
        font-weight: 300;
      }
      .small-title{
        color: rgba(255,255,255, .9);
        font-size: 15px;
      }
    }
  }
  .login-form {
    padding: 0px 35px;
    background: #fff;
    border-radius: 6px;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 3px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;
    .title {
      font-size: 22px;
      color: #333;
      margin: 50px auto 40px auto;
      text-align: center;
      font-weight: normal;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }

  .thirdparty-button {
    position: absolute;
    right: 0;
    bottom: 6px;
  }

  @media only screen and (max-width: 470px) {
    .thirdparty-button {
      display: none;
    }
  }
}
 .erifycode-wrap-box{
   display: flex;

   .verifycode-input-box{
     flex: 1;
     margin-right: 15px;
     height: 40px;
   }
   .verifycode-btn-box{
     width: 112px;
     height: 43px;
     margin-top: 2px;
     .verifycode-btn{
       background: #fff;
     }
   }
 }
 /deep/.el-form-item__content {
    height: 40px;
    background: #e8f0fe;
}
.login-btn{
  width:100%;
  margin-bottom:30px;
  background: #FF7500;
  border-color: #FF7500;
}
.footer{
    position: absolute;
    bottom: 4vh;
    width: 90%;
    background: #fff;
    box-sizing: border-box;
    border-radius: 6px;
    height: 125px;
    .footer-wrap {
      display: flex;
      padding: 20px;
      .footer-er {
        display: flex;
        align-items: center;
        width: 26%;
        .footer-img {
          width: 90px;
          margin-right: 10px;
        }
        .footer-title {
          margin-bottom: 10px;
          color: #333;
          font-size: 16px;
          font-weight: 700;
        }
        .footer-msg {
          color: #999;
          font-size: 12px;
        }
      }
    }
    .footer-back {
      width: 20%;
      height: 126px;
      background: url('../../assets/images/3.10.png') no-repeat;
      background-size: 100% 100%;
      position: relative;
      right: -80.1%;
      top: -130px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      color: #fff;
      flex-direction: column;
      .e-phone {
        font-size: 22px;
        font-weight: 700;
        color: #fff;
        margin-top: 5px;
      }
  }
}
.forget-password{
  text-align: right;
  font-size: 14px;
  color: #FF7500;
  margin-top: -18px;
  margin-bottom: 10px;
  span{
    cursor: pointer;
  }
}
</style>
