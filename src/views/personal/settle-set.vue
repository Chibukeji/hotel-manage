<template>
    <div>
        <el-tabs v-model="activeName">
            <el-tab-pane label="微信" name="first">
                <el-form :model="wechatForm" :rules="wechatRules" ref="wechatForm" label-width="120px" class="demo-ruleForm">
                    <!-- <el-form-item label="微信号" v-if="merchantInfoList.wechat_account!== null ||merchantInfoList.wechat_account!=='' " >
                        <span>{{merchantInfoList.wechat_account}}</span>
                    </el-form-item> -->
                    <el-form-item label="微信号" prop="account" style="width:400px">
                        <el-input v-model="wechatForm.account" placeholder="请输入微信号"></el-input>
                    </el-form-item>
                    <el-form-item prop="member_id">
                        <span slot="label">
                            <span>会员</span>
                            <i class="el-icon-question" @click="merchantTypeDetail('1')"></i>
                        </span>
                        <el-select  v-model="wechatForm.member_id" filterable clearable remote placeholder="请输入会员昵称搜索"
                        :remote-method="remoteMethod" :loading="loadingSearch" @change="selectMember" style="display:inline-block">
                        <el-option v-for="item in memberList" :key="item.id" :label="item.nickname" :value="item.id" >
                            <img :src="item.head_pic" style="width:20px;height:20px;vertical-align: middle;margin-right:2px">
                            <span style="vertical-align: middle;">{{item.nickname}}(id:{{item.id}})</span>
                        </el-option>
                    </el-select>
                    <span>
                        <img :src="initList.head_pic" style="width:20px;height:20px;vertical-align: middle;margin-right:2px">
                        <span style="vertical-align: middle;">{{initList.nickname}}(id:{{wechatForm.member_id}})</span>
                    </span>
                    </el-form-item>
                </el-form>
            </el-tab-pane>
            <el-tab-pane label="支付宝" name="second">
                <el-form :model="alipayForm" :rules="alipayRules" ref="alipayForm" label-width="120px" class="demo-ruleForm" style="width:400px">
                    <!-- <el-form-item label="支付宝号" v-if="merchantInfoList.alipay_account!== null ||merchantInfoList.alipay_account!=='' ">
                        <span>{{merchantInfoList.alipay_account}}</span>
                    </el-form-item> -->
                    <el-form-item label="支付宝号" prop="account">
                        <el-input v-model="alipayForm.account" placeholder="请输入支付宝号"></el-input>
                    </el-form-item>
                    <el-form-item label="支付宝账户姓名" prop="accountUser">
                        <el-input v-model="alipayForm.accountUser" placeholder="请输入支付宝账户姓名"></el-input>
                    </el-form-item>
                </el-form>
            </el-tab-pane>
            <el-tab-pane label="银行卡" name="third">
                <el-form :model="bankForm" :rules="bankRules" ref="bankForm" label-width="120px" class="demo-ruleForm" style="width:400px">
                    <!-- <el-form-item label="银行卡号" v-if="merchantInfoList.bank_card_number!== null ||merchantInfoList.bank_card_number!=='' ">
                        <span>{{merchantInfoList.bank_card_number}}</span>
                    </el-form-item> -->
                    <el-form-item label="银行卡号" prop="bank_card_number">
                        <el-input v-model="bankForm.bank_card_number" placeholder="请输入银行卡号" oninput="value=value.replace(/[^\d]/g,'')"></el-input>
                    </el-form-item>
                    <el-form-item label="银行名称" prop="bank_name">
                        <el-select v-model="bankForm.bank_name" placeholder="请选择银行名称" style="width:100%">
                            <el-option v-for="(item,index) in bankList" :key="index" :label="item.name" :value="item.name"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="银行支行" prop="bank_address">
                        <el-input v-model="bankForm.bank_address" placeholder="请输入银行支行"></el-input>
                    </el-form-item>
                    <el-form-item label="银行账户名" prop="bank_acount_name">
                        <el-input v-model="bankForm.bank_acount_name" placeholder="请输入银行账户名"></el-input>
                    </el-form-item>
                </el-form>
            </el-tab-pane>
            <el-form :model="commonForm" :rules="commonRules" ref="commonForm" label-width="120px" class="demo-ruleForm" style="width:400px">
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
                <el-button type="primary" size="small" @click="savaSubmit">保存</el-button>
            </div>
        </el-tabs>
        <!-- 解释 -->
        <el-dialog :visible.sync="merchantTypeHelp" title="详情" width="40%" >
            <div v-html="helpDetail" class="help-detail"></div>
        </el-dialog>
    </div>
</template>

<script>
import SIdentify from '@/components/identify/index'
import { getSearchMemberList} from '@/api/member-manage/member-list'
import { getMobileCode,setWechat,setAlipay,setBank,getMerchantInfo,getBank } from '@/api/personal-data'
    export default {
        components: { SIdentify },
        data() {
            return {
                activeName:'first',
                wechatForm:{
                    account:'',
                    member_id:'',
                },
                wechatRules:{
                    account:[{ required: true, message: '请输入微信号', trigger: 'blur' }],
                },
                alipayForm:{
                    account:'',
                    accountUser:'',
                },
                alipayRules:{
                    account:[{ required: true, message: '请输入支付宝账号', trigger: 'blur' }],
                    accountUser:[{ required: true, message: '请输入支付宝账户姓名', trigger: 'blur' }],
                },
                bankForm:{
                    bank_card_number:'',
                    bank_name:'',
                    bank_address:'',
                    bank_acount_name:'',
                },
                bankRules:{
                    bank_card_number:[{ required: true, message: '请输入银行卡号', trigger: 'blur' }],
                    bank_name:[{ required: true, message: '请选择银行名称', trigger: 'change' }],
                    bank_address:[{ required: true, message: '请输入银行支行', trigger: 'blur' }],
                    bank_acount_name:[{ required: true, message: '请输入银行账户名', trigger: 'blur' }],
                },
                commonForm:{
                    verifycode:'',
                    phoneCode:'',
                },
                commonRules:{
                    verifycode: [{  required: true, message: '请输入验证码', trigger: 'blur' }],
                    phoneCode:[{  required: true, message: '请输入验证码', trigger: 'blur' }],
                },
                identifyCode: '',
                identifyCodes: '1234567890abcdefghijklmnopqrstuvwxyz',
                show:true,
                contentHeight:36,
                timer:'',
                count:60,
                countBtn:false,
                bankList:[],
                loadingSearch: false,
                memberList: [],
                merchantTypeHelp:false,
                helpDetail:'',
                merchantInfoList:'',
                initList:{
                    head_pic:'',
                    nickname:'',
                }
            }
        },
        mounted () {
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
            this.merchantInfo()
            
        },
        methods: {
            //获取信息
            merchantInfo(){
                getMerchantInfo().then(res=>{
                    this.merchantInfoList = res.data
                    this.getBankList()
                    this.remoteMethod(this.merchantInfoList.nickname)
                    this.wechatForm.member_id = this.merchantInfoList.member_id
                    this.wechatForm.account = this.merchantInfoList.wechat_account
                    this.alipayForm.account = this.merchantInfoList.alipay_account
                    this.alipayForm.accountUser = this.merchantInfoList.alipay_account_name
                    this.bankForm.bank_name = this.merchantInfoList.bank_name
                    this.bankForm.bank_card_number = this.merchantInfoList.bank_card_number
                    this.bankForm.bank_address = this.merchantInfoList.child_bank_name
                    this.bankForm.bank_acount_name = this.merchantInfoList.bank_account_name
                    this.initList = {
                        head_pic:this.merchantInfoList.head_pic,
                        nickname:this.merchantInfoList.nickname,
                    }
                })
            },
            //获取银行列表
            getBankList(){
                getBank().then(res=>{
                    this.bankList = res.data
                    // this.bankList.map(item=>{
                    //     if(item.name == this.merchantInfoList.bank_name){
                            // this.bankForm.bank_name = item.id
                    //     }
                    // })
                })
            },
            // 搜索会员
            remoteMethod(query) {
                if (query == '' || query == null) {
                    this.memberList = []
                } else {
                    this.loadingSearch = true
                    getSearchMemberList({ keyword: query, page: 1, size: 20,}).then(res => {
                        this.loadingSearch = false
                        this.memberList = res.data.data
                    })
                }
            },
            selectMember(){
                this.memberList.map(item=>{
                    if(item.id == this.wechatForm.member_id ){
                        this.initList = {
                            head_pic:item.head_pic,
                            nickname:item.nickname,
                        }
                    }
                })
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
             //查看商家类型解释
            merchantTypeDetail(flag){
                this.merchantTypeHelp = true
                if(flag == '1'){
                    this.helpDetail = `<div>选择绑定系统会员。</div>`
                }
            },
            // 获取短信验证码
            getCode() {
                getMobileCode().then(res=>{
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
            //保存
            savaSubmit(){
                let activeName = this.activeName
                if(activeName == 'first'){
                    this.$refs.wechatForm.validate((valid) => {
                        if (valid) {
                            if(this.commonForm.phoneCode == '' || this.commonForm.phoneCode == null){
                                this.$message({
                                    type: 'warning',
                                    message: '短信验证码不能为空!'
                                })
                                return
                            }
                            let params={
                                wechat_account:this.wechatForm.account,
                                member_id:this.wechatForm.member_id,
                                code:this.commonForm.phoneCode
                            }
                            setWechat(params).then(res=>{
                                if(res.code == 0){
                                    this.$message({
                                        message: '保存成功',
                                        type: 'success'
                                    })
                                    this.show = true;
                                    clearInterval(this.timer);
                                    this.timer = null;
                                    // location.reload();
                                }
                            })
                        }
                    })
                }else if(activeName == 'second'){
                    this.$refs.alipayForm.validate((valid) => {
                        if (valid) {
                            if(this.commonForm.phoneCode == '' || this.commonForm.phoneCode == null){
                                this.$message({
                                    type: 'warning',
                                    message: '短信验证码不能为空!'
                                })
                                return
                            }
                            let params={
                                alipay_account:this.alipayForm.account,
                                alipay_account_name:this.alipayForm.accountUser,
                                code:this.commonForm.phoneCode
                            }
                            setAlipay(params).then(res=>{
                                if(res.code == 0){
                                    this.$message({
                                        message: '保存成功',
                                        type: 'success'
                                    })
                                    this.show = true;
                                    clearInterval(this.timer);
                                    this.timer = null;
                                    // location.reload();
                                }
                            })
                        }
                    })
                }else if(activeName == 'third'){
                    this.$refs.bankForm.validate((valid) => {
                        if (valid) {
                            if(this.commonForm.phoneCode == '' || this.commonForm.phoneCode == null){
                                this.$message({
                                    type: 'warning',
                                    message: '短信验证码不能为空!'
                                })
                                return
                            }
                            let params={
                                bank_name:this.bankForm.bank_name+this.bankForm.bank_address,
                                bank_card_number:this.bankForm.bank_card_number,
                                bank_account_name:this.bankForm.bank_acount_name,
                                code:this.commonForm.phoneCode
                            }
                            setBank(params).then(res=>{
                                if(res.code == 0){
                                    this.$message({
                                        message: '保存成功',
                                        type: 'success'
                                    })
                                    this.show = true;
                                    clearInterval(this.timer);
                                    this.timer = null;
                                    // location.reload();
                                }
                            })
                        }
                    })
                }
            }
        },
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
    // width: 500px;
 }
 .bottom-btn-box{
    width: 400px;
    text-align: center;
    margin-top: 30px;
 }
</style>