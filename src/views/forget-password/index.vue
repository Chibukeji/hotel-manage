<template>
    <div class="forget-password-page">
        <div class="top-title">找回密码</div>
        <div v-if="pageFlag">
            <el-form :model="commonForm" :rules="commonRules" ref="commonForm" label-width="120px" class="demo-ruleForm">
                <el-form-item label="手机号" prop="mobile">
                    <el-input v-model="commonForm.mobile" placeholder="请输入手机号" oninput="value=value.replace(/[^\d]/g,'')"></el-input>
                </el-form-item>
                <div class="erifycode-wrap-box">
                    <el-form-item label="验证码" prop="verifycode" class="verifycode-input-box">
                        <el-input v-model="commonForm.verifycode" placeholder="请输入验证码" class="identifyinput" @input='codeChange'/>
                    </el-form-item>
                    <el-form-item class="verifycode-btn-box">
                        <div class="verifycode-btn" @click="refreshCode">
                        <s-identify :identify-code="identifyCode" :content-height="contentHeight" />
                        </div>
                    </el-form-item>
                </div>
                <el-form-item label="短信验证码" prop="phoneCode" class="phone-code-box" >
                    <el-input placeholder="短信验证码"  v-model="commonForm.phoneCode"  style="display: inline-block;width:150px"></el-input>
                    <el-button v-show="show" :disabled="!countBtn" type="primary" size="small" @click.prevent="getCode()" class="phone-code-btn">获取动态验证码</el-button>
                    <el-button v-show="!show" type="primary" class="phone-code-btn">{{count}} s</el-button>
                </el-form-item>
            </el-form>
            <div class="bottom-btn-box">
                <el-button type="primary" size="small" @click="nextSubmit">下一步</el-button>
            </div>
        </div>
        <div v-else>
            <el-form :model="passwordForm" :rules="passwordRules" ref="passwordForm" label-width="120px" class="demo-ruleForm">
                <el-form-item label="新密码" prop="password">
                    <el-input type="password" v-model="passwordForm.password" placeholder="请输入新密码" autocomplete="on"></el-input>
                </el-form-item>
                <el-form-item label="确认密码" prop="repassword">
                    <el-input type="password" v-model="passwordForm.repassword" placeholder="请确认密码"></el-input>
                </el-form-item>
            </el-form>
            <div class="bottom-btn-box">
                <el-button type="primary" size="small" @click="savaSubmit">保存</el-button>
            </div>
        </div>
    </div>
</template>

<script>
import SIdentify from '@/components/identify/index'
import { getMobileCode,verifyPhone,setFindPassword } from '@/api/forget-password'
import { setToken } from '@/utils/auth'
    export default {
        components: { SIdentify },
        data() {
            var checkPhone = (rule, value, callback) => {
                const reg = /^1[0-9]{10}$/
                if (reg.test(value)) {
                    return callback()
                }
                callback('请输入正确的手机号')
            }
            return {
                commonForm:{
                    mobile:'',
                    verifycode:'',
                    phoneCode:'',
                },
                passwordForm:{
                    password:'',
                    repassword:'',
                },
                commonRules:{
                    mobile: [{  required: true, trigger: 'blur',validator: checkPhone, }],
                    verifycode: [{  required: true, message: '请输入验证码', trigger: 'blur' }],
                    phoneCode:[{  required: true, message: '请输入验证码', trigger: 'blur' }],
                },
                passwordRules:{
                    password: [{  required: true, message: '请输入验证码', trigger: 'blur' }],
                    repassword:[{  required: true, message: '请输入验证码', trigger: 'blur' }],
                },
                identifyCode: '',
                identifyCodes: '1234567890abcdefghijklmnopqrstuvwxyz',
                show:true,
                contentHeight:36,
                timer:'',
                count:60,
                countBtn:false,
                merchantInfoList:'',
                pageFlag:true,
            }
        },
        mounted () {
            if (window.history && window.history.pushState) {
                // 向历史记录中插入了当前页
                history.pushState(null, null, document.URL);
                window.addEventListener('popstate', this.goBack, false);
            }
            // 验证码
            this.identifyCode = ''
            this.makeCode(this.identifyCodes, 4)
            // disableBrowserBack();
            history.pushState(null, null, document.URL)
            if (window.history && window.history.pushState) {
                window.addEventListener('popstate', function() {
                    window.history.pushState('forward', null, '')
                    window.history.forward(1)
                })
                window.history.pushState('forward', null, '') // 在IE中必须得有这两行
                window.history.forward(1)
            }
        },
        destroyed () {
            window.removeEventListener('popstate', this.goBack, false);
        },
        methods: {
            //点击浏览器返回上一页
            goBack () {
                this.$store.commit('user/SET_TOKEN', '')
                setToken('')
                this.$router.push('/login')
            },
            // 切换验证码
            refreshCode() {
                this.identifyCode = ''
                this.makeCode(this.identifyCodes, 4)
            },
            makeCode(o, l) {
                for (let i = 0; i < l; i++) {
                    this.identifyCode += this.identifyCodes[
                    this.randomNum(0, this.identifyCodes.length)]
                }
                },
                randomNum(min, max) {
                return Math.floor(Math.random() * (max - min) + min)
            },
            // 监听输入验证码值
            codeChange(){
                if(this.commonForm.verifycode == this.identifyCode){
                    if(this.timer == ''){
                        this.countBtn = true
                        this.show = true
                        this.count = 60
                    }
                }else{
                    this.countBtn = false
                }
            },
            // 获取短信验证码
            getCode() {
                if(this.commonForm.mobile == '' || this.commonForm.mobile == null){
                    this.$message({
                        message: '请输入手机号！',
                        type: 'warning'
                    })  
                    return
                }
                getMobileCode({mobile:this.commonForm.mobile}).then(res=>{
                    if(res.code == 0){
                        this.$message({
                            message: '短信验证码已发送',
                            type: 'success'
                        })
                    }
                })
                // 验证码倒计时
                if (!this.timer) {
                    this.count = 60;
                    this.show = false;
                    this.timer = setInterval(() => {
                    if (this.count > 0 && this.count <= 60) {
                        this.count--;
                    } else {
                        this.show = true;
                        clearInterval(this.timer);
                        this.timer = null;
                    }
                    }, 1000);
                }
            },
            //下一步
            nextSubmit(){
                this.$refs.commonForm.validate((valid) => {
                    if (valid) {
                        let params={
                            mobile:this.commonForm.mobile,
                            sms_code:this.commonForm.phoneCode
                        }
                        verifyPhone(params).then(res=>{
                            if(res.code == 0){
                                // this.$message({
                                //     message: '保存成功',
                                //     type: 'success'
                                // })
                                this.$store.commit('user/SET_TOKEN', res.data.access_token)
                                setToken(res.data.access_token)
                                this.pageFlag = false
                            }else{
                               this.pageFlag = true 
                            }
                            this.show = true;
                            clearInterval(this.timer);
                            this.timer = null;
                        })
                    }
                })
            },
            //保存
            savaSubmit(){
                this.$refs.passwordForm.validate((valid) => {
                    if (valid) {
                        let params={
                            password:this.passwordForm.password,
                            repassword:this.passwordForm.repassword,
                        }
                        setFindPassword(params).then(res=>{
                            if(res.code == 0){
                                this.$message({
                                    message: '保存成功',
                                    type: 'success'
                                })
                            }
                            this.show = true;
                            this.timer = null;
                        })
                    }
                })
            },
        }
    }
</script>

<style lang="scss" scoped>
.erifycode-wrap-box{
   display: flex;
   .verifycode-input-box{
    //  flex: 1;
     margin-right: 15px;
     height: 40px;
   }
   .verifycode-btn-box{
     width: 112px;
     height: 43px;
     margin-top: 1px;
     .verifycode-btn{
       background: #fff;
     }
     /deep/.el-form-item__content{
        margin-left: 0!important;
     }
   }
 }
 .phone-code-box{
//    display: flex; 
    .phone-code-input{
        display: inline-block;
    } 
    .phone-code-btn{
        height:36px;
        float:right
    }
 }
 .demo-ruleForm{
    width: 400px;
 }
 .bottom-btn-box{
    width: 400px;
    text-align: center;
    margin-top: 30px;
 }
 .forget-password-page{
     padding: 20px;
     .top-title{
         border-bottom: 1px solid #dedede;
         margin-bottom: 30px;
         padding-bottom: 5px;
        //  color: #409EFF;
     }
 }

</style>