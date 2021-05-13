<template>
    <div>
        <el-tabs v-model="activeName" >
            <el-tab-pane label="基础信息" name="first">
                <el-form ref="editForm1" :rules="rules" :model="editForm" label-position="left" label-width="100px" style="width:80%;margin-bottom:50px">
                    <el-form-item label="经营范围" prop="merch_scope_ids">
                        <el-checkbox-group v-model="merch_scope_ids">
                          <el-checkbox v-for="(item,index) in businessScope" :key="index" :label="item.id" name="type">{{item.name}}</el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                    <el-form-item label="所属分类" prop="merch_cate_id">
                        <span slot="label">
                            <span>所属分类</span>
                            <i class="el-icon-question" @click="merchantTypeDetail('2')"></i>
                        </span>
                        <el-select v-model="editForm.merch_cate_id" placeholder="请选择所属分类" style="width:400px">
                          <el-option v-for="(item,index) in classify" :key="index" :label="item.name" :value="item.id" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="商家类型" prop="merch_type">
                        <span slot="label">
                            <span>商家类型</span>
                            <i class="el-icon-question" @click="merchantTypeDetail('1')"></i>
                        </span>
                        <el-select v-model="editForm.merch_type" placeholder="请选择商家类型" style="width:400px">
                            <el-option v-for="(item,index) in merchantType" :key="index" :label="item.name" :value="item.value" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="商家名称" prop="name">
                        <el-input v-model="editForm.name" style="width:400px"></el-input>
                    </el-form-item>
                    <!-- <el-form-item label="企业名称" prop="name">
                        <el-input v-model="editForm.name"></el-input>
                    </el-form-item> -->
                    <el-form-item label="联系电话" prop="telephone" >
                        <el-input v-model="editForm.telephone" oninput="value=value.replace(/[^\d]/g,'')" style="width:400px"></el-input>
                    </el-form-item>
                    <el-form-item label="公司地址" prop="address">
                        <el-input v-model="editForm.address" style="width:400px"></el-input>
                    </el-form-item>
                </el-form>
            </el-tab-pane>
            <el-tab-pane label="认证材料" name="second">
                <el-form ref="editForm2" :rules="rules" :model="editForm" label-position="left" label-width="100px" style="width:100%;margin-bottom:50px">
                    <span style="color:red">注意：本功能是用于商家资质验证，标准用户不需要进行配置</span>
                    <el-form-item label="认证方式" prop="auth_type">
                        <el-radio-group v-model="editForm.auth_type">
                            <el-radio label="1">卫生许可证</el-radio>
                            <el-radio label="2">营业执照</el-radio>
                            <el-radio label="3">特种行业许可证</el-radio>
                            <el-radio label="4">消防证</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <div v-if="editForm.auth_type == '1'">
                        <el-form-item label="卫生许可证号码" prop="license_no">
                            <el-input v-model="editForm.license_no"></el-input>
                        </el-form-item>
                        <el-form-item label="卫生许可证图片" prop="license_image">
                            <el-button type="primary" size="small" @click="selectImg('1')" style="display: block;">选择图片</el-button>
                            <el-image class="img-certificate" :src="editForm.license_image"></el-image>
                        </el-form-item>
                    </div>
                    <div v-if="editForm.auth_type == '2'">
                        <el-form-item  label="营业执照" prop="certify_no">
                            <el-input v-model="editForm.certify_no"  style="width:300px"></el-input>
                        </el-form-item>
                        <el-form-item label="营业执照图片" prop="certify_image">
                            <el-button type="primary" size="small" @click="selectImg('2')" style="display: block;">选择图片</el-button>
                            <el-image class="img-certificate" :src="editForm.certify_image"></el-image>
                        </el-form-item>
                    </div>
                    <div v-if="editForm.auth_type == '3'">
                        <el-form-item  label="特种行业许可证号码" prop="special_no">
                            <el-input v-model="editForm.special_no" style="width:300px"></el-input>
                        </el-form-item>
                        <el-form-item label="特种行业许可证图片" prop="special_image">
                            <el-button type="primary" size="small" @click="selectImg('3')" style="display: block;">选择图片</el-button>
                            <el-image class="img-certificate" :src="editForm.special_image"></el-image>
                        </el-form-item>
                    </div>
                    <div v-if="editForm.auth_type == '4'">
                        <el-form-item  label="消防证号码" prop="fire_no">
                            <el-input v-model="editForm.fire_no" style="width:300px"></el-input>
                        </el-form-item>
                        <el-form-item label="消防证图片" prop="fire_image">
                            <el-button type="primary" size="small" @click="selectImg('4')" style="display: block;">选择图片</el-button>
                            <el-image class="img-certificate" :src="editForm.fire_image"></el-image>
                        </el-form-item>
                    </div>
                    <el-form-item label="企业名称" prop="company_name">
                        <el-input v-model="editForm.company_name" style="width:300px"></el-input>
                    </el-form-item>
                    <el-form-item label="法人代表" prop="legal_person">
                        <el-input v-model="editForm.legal_person" style="width:300px"></el-input>
                    </el-form-item>
                    <!-- <el-form-item label="公司地址" prop="address">
                        <el-input v-model="editForm.address"></el-input>
                    </el-form-item> -->
                    <el-form-item label="认证状态" prop="status">
                        <el-radio-group v-model="editForm.status">
                          <el-radio v-for="(item,index) in certificationStatus" :key="index" :label="item.value">{{item.name}}</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item v-if="editForm.status ==2" label="未通过原因" prop="reason">
                        <el-input v-model="editForm.reason"></el-input>
                    </el-form-item>
                </el-form>
            </el-tab-pane>
            <el-tab-pane label="联系人" name="third">
                <el-form ref="editForm3" :rules="rules" :model="editForm" label-position="left" label-width="100px" style="width:80%;margin-bottom:50px">
                    <el-form-item label="手机号码" prop="mobile">
                        <el-input v-model="editForm.mobile" oninput="value=value.replace(/[^\d]/g,'')" style="width:300px"></el-input>
                    </el-form-item>
                     <el-form-item  prop="password">
                        <span slot="label">
                            <span>登录密码</span>
                            <!-- <i class="el-icon-question" @click="merchantTypeDetail('3')"></i> -->
                        </span>
                        <el-input v-model="editForm.password" style="width:300px"></el-input>
                    </el-form-item>
                     <el-form-item label="姓名" prop="link_person">
                        <el-input v-model="editForm.link_person" style="width:300px"></el-input>
                    </el-form-item>
                     <el-form-item label="电子邮箱" prop="email">
                        <el-input v-model="editForm.email" style="width:300px"></el-input>
                    </el-form-item>
                     <el-form-item label="QQ" prop="qq">
                        <el-input v-model="editForm.qq" oninput="value=value.replace(/[^\d]/g,'')" style="width:300px"></el-input>
                    </el-form-item>
                     <el-form-item label="传真" prop="fax">
                        <el-input v-model="editForm.fax" style="width:300px"></el-input>
                    </el-form-item>
                </el-form>
            </el-tab-pane>
            <el-tab-pane label="高级" name="fourth">
                <el-form ref="editForm4" :rules="rules" :model="editForm" label-position="left" label-width="100px" style="width:100%;margin-bottom:50px">
                    <el-form-item label="坐标" prop="lng" class="coordinate-wrap">
                        <div class="coordinate-box">
                            <span>经度(Lng)：</span>
                            <el-input v-model="editForm.lng" style="display: inline-block;width:150px" oninput="value=value.replace(/[^0-9.]/g,'')"></el-input>
                        </div>
                         <div class="coordinate-box">
                            <span>纬度(Lat)：</span>
                            <el-input v-model="editForm.lat" style="display: inline-block;width:150px" oninput="value=value.replace(/[^0-9.]/g,'')"></el-input>
                        </div>
                        <el-button type="primary" size="small" style="height:32px;margin-top:2px" @click="mapSelect">选择</el-button>
                    </el-form-item>
                    <el-form-item label="所在城市" >
                      <el-cascader v-model="destination"  :options="siteOptions" :props="belongRegoinProps" clearable style="width:550px"></el-cascader>
                    </el-form-item>
                    <el-form-item label="商家图片" >
                        <el-button type="primary" size="small" @click="selectImg('5')" >选择图片</el-button>
                        <el-button v-if="merchantImgList.length>0" type="primary" size="small" @click="setCoverImg()">设为封面</el-button>
                        <el-button v-if="merchantImgList.length>0" type="danger" size="small" @click="delCoverImg()">删除</el-button>
                        <div class="merchant-img-box" v-if="merchantInit">
                            <div class="img-box" v-for="(item,index) in merchantImgList" :key="index">
                              <!-- v-on:mouseover="item.coverFlag = true" v-on:mouseout="item.coverFlag = false" -->
                                <div class="top-tool">
                                    <!-- <div v-if="item.coverFlag && !item.coverImgIf" class="btn-back" @click="setCoverImg(index)">设为封面</div> -->
                                    <div v-if="item.coverImgIf" class="btn-back" :class="{'actvie-btn-back':item.coverImgIf}">已设为封面</div>
                                    <!-- <i class="el-icon-close btn-back" v-if="item.coverFlag"></i> -->
                                </div>
                                <el-image class="img-merchant"  :src="item.file_url" @click="selectMerchantImg(item)"></el-image>
                                <div  v-if="item.coverFlag" class="select-mask" @click="selectMerchantImg(item)">
                                  <i class="el-icon-check" />
                                </div>
                            </div>
                        </div>
                        
                    </el-form-item>
                    <el-form-item label="商家介绍" prop="describe">
                        <tinymce ref="tinymce" v-model="editForm.describe" style="width:600px" :height="250"/>
                    </el-form-item>
                </el-form>
            </el-tab-pane>
        </el-tabs>
        <div class="bottom-btn">
            <el-button size="small" type="primary" @click="submitHandle">确定</el-button>
        </div>
        <!-- 商家类型解释 -->
        <el-dialog :visible.sync="merchantTypeHelp" title="详情" width="40%" >
            <div v-html="helpDetail" class="help-detail"></div>
        </el-dialog>
        <!-- 图片库 -->
        <img-gallery ref="imgGalleryChild" @selectImgList="selectImgList"/>
        <!-- 百度地图 -->
        <baidu-mapmy ref="baiduMapChild" @getCoordinate="getCoordinate"/>
    </div>
</template>

<script>
import {getMerchantInfo, getBusinessScopeList,getMerchantClassifyList,setMerchantInfo} from '@/api/personal-data'
import { allAddressList } from '@/api/common'
import ImgGallery from '@/components/ImgGallery'
import Tinymce from '@/components/Tinymce'
import BaiduMapmy from '@/components/BaiduMapmy'
    export default {
        components: { ImgGallery,Tinymce,BaiduMapmy },
        data() {
            var checkPhone = (rule, value, callback) => {
                const reg = /^1[0-9]{10}$/
                if(value == '' || value == null){
                    return callback()
                }
                if (reg.test(value)) {
                    return callback()
                }
                callback('请输入正确的手机号')
            }
            return {
                belongRegoinProps: {
                    checkStrictly: true,
                    value:'code',
                    label:'name',
                    lazy: true,
                    lazyLoad: (node, resolve) => {
                        this.$nextTick(()=>{
                            this.getAreaForLazyLoad(node, resolve)
                        })
                    }
                },//级联框prop
                activeName:'first',
                rules: {
                    name:[{ required: true, message: '请输入内容', trigger: 'blur' }],
                    mobile:[{ validator: checkPhone, required: false, trigger: 'blur' }],
                },
                editForm: {
                    id:'',
                    name: '',
                    telephone:'',
                    mobile:'',
                    address:'',
                    link_person:'',
                    email:'',
                    qq:'',
                    fax:'',
                    province_id:'',
                    city_id:'',
                    area_id:'',
                    legal_person:'',
                    describe:'',
                    images:'',
                    status:0,
                    reason:'',
                    merch_cate_id:'',
                    merch_type:'',
                    merch_scope_ids:'',
                    password:'',
                    company_name:'',
                    auth_type:'',
                    license_no:'',
                    license_image:'',
                    certify_no:'',
                    certify_image:'',
                    special_no:'',
                    special_image:'',
                    fire_no:'',
                    fire_image:'',
                    lng:'',
                    lat:'',
                },
                siteOptions: [],
                merchantImgList:[],
                merch_scope_ids:[],
                destination:[],
                merchantTypeHelp:false,
                businessScope:[],
                classify:[],
                merchantType:[
                    {
                    name: '平台商家',
                    value: 0
                    },
                    {
                    name: '第三方商家',
                    value: 1
                    }
                ],
                certificationStatus:[
                    {
                    name: '未认证',
                    value: 0
                    },
                    {
                    name: '审核中',
                    value: 1
                    },
                    {
                    name: '未通过',
                    value: 2
                    },
                    {
                    name: '已认证',
                    value: 3
                    }
                ],
                merchantInit:true,
                helpDetail:'',
            }
        },
        mounted () {
            this.businessScopeList();
            this.merchantClassifyList();
            this.merchantInfo()
            setInterval(function() {
                document.querySelectorAll(".el-cascader-node__label").forEach(el => {
                    el.onclick = function() {
                    if (this.previousElementSibling) this.previousElementSibling.click();
                    };
                });
            }, 1000);
        },
        methods: {
            //获取商家信息
            merchantInfo(){
                getMerchantInfo().then(res=>{
                    let item = res.data
                    for (const key in item) {
                        if (this.editForm[key] != undefined) {
                            this.editForm[key] = item[key]
                        }
                    }
                    this.editForm.auth_type = this.editForm.auth_type.toString()
                    // 经营范围
                    this.merch_scope_ids = []
                    if(item.merch_scope_ids == null || item.merch_scope_ids == ''){
                    }else{
                    if(item.merch_scope_ids.length>1){
                       let arr = item.merch_scope_ids.split(',')
                       arr.map(item=>{
                            this.merch_scope_ids.push(parseInt(item))
                       })
                    }else{
                        this.merch_scope_ids.push(item.merch_scope_ids)
                    }
                    }
                    //所在城市
                    this.destination = []
                    if(item.province_id == null || item.province_id == '') {}else{
                        this.destination.push(item.province_id.toString())
                    }
                    if(item.city_id == null || item.city_id=='') {}else{
                        this.destination.push(item.city_id.toString())
                    }
                    if(item.area_id == null || item.area_id == '') {}else{
                        this.destination.push(item.area_id.toString())
                    }
                    if(item.street_id == null || item.street_id == '') {}else{
                        this.destination.push(item.street_id.toString())
                    }
                    //商家图片
                    this.merchantImgList = []
                    if(item.images == null ){
                    }else{
                    if(item.images.length>1){
                        let json = item.images.split(',')
                        json.map((item,i)=>{
                        let list = {file_url:item,coverFlag:false,coverImgIf:false}
                        this.merchantImgList.push(list)
                        })
                    }else{
                        let list = {file_url:item.images,coverFlag:false,coverImgIf:false}
                        this.merchantImgList.push(list)
                    }
                    }
                    //认证材料
                    let item2 = item.qualification 
                    if(item2){
                    for (const key in item2.qualification) {
                        if (this.editForm[key] != undefined) {
                        this.editForm[key] = item2[key]
                        }
                    }
                    this.$refs.tinymce.setContent(item.describe)
                    }
                    //所属分类
                    this.classify.map(item=>{
                    if(item.id == this.editForm.merch_cate_id){
                    
                    }else{
                        this.editForm.merch_cate_id = ''
                    }
                    })
                })
            },
            //获取经营范围
            businessScopeList() {
                getBusinessScopeList().then(res => {
                    this.businessScope = res.data
                })
            },
            //商家分类
            merchantClassifyList() {
                getMerchantClassifyList().then(res => {
                    this.classify = res.data
                })
            },
            //获取省市区街道地址
            getAreaForLazyLoad(node, resolve) {
                // console.log(node)
                const  level  = node.level
                if(level >= 4){
                    resolve()
                    return
                }
                let params = {
                    code: node.value
                }
                let childProjects = []
                allAddressList(params).then(res => {
                    if (res.code == 0) {
                        // console.log(res)
                        childProjects = res.data.data
                        childProjects.map(item => {
                            item.leaf = level >= 3; //判断是否为末尾节点
                        })
                        resolve(childProjects)
                    }
                }).catch(err => { console.log(err) })
            },
            //查看商家类型解释
            merchantTypeDetail(flag){
                this.merchantTypeHelp = true
                if(flag == '1'){
                    this.helpDetail = `<div>供应商类型分为第三方供应商和平台供应商。</div>
                    <div>第三方供应商：</div>
                    <div>可在供应商返佣中设置三方供应商的返佣金额，交易完成后平台会自动扣除佣金，将订单金额结算到供应商账户中。</div>
                    <div>平台供应商：</div>
                    <div>默认平台返佣比例为100%。交易完成后，订单金额全部打入平台账户中。</div>`
                }else if(flag == '2'){
                    this.helpDetail = `<div>1.供应商所属分类</div>
                    <div>a.作用：方便商家对供应商进行分类管理</div>
                    <div>b.设置：请在供应商管理-供应商设置-供应商分类中进行设置</div>
                    <div style="margin-top:20px">2.供应商经营范围</div>
                    <div>a.经营范围：指供应商在系统中供应的产品类型。</div>
                    <div>b.作用：1).方便商家根据供应商供应产品类型对供应商进行分类管理 2).供应商在供应商中心可操作的产品类型。</div>
                    <div>c.经营范围的内容：与我的应用-供应商产品应用的安装情况有关</div>`
                }else if(flag == '3'){
                    this.helpDetail = `<div>从后台添加的供应商账号，密码需要管理员手动设置。</div>
                    <div>如果供应商忘记密码无法登陆，管理员也可以从此处帮其重置。</div>`
                }
            },
            //选择地图
            mapSelect(){
                this.$refs.baiduMapChild.init()
            },
            // 获取地图坐标
            getCoordinate(data){
                console.log(data)
                this.editForm.lng =data.lng
                this.editForm.lat =data.lat
            },
            //弹出图片库
            selectImg(flag) {
                this.$refs.imgGalleryChild.init(flag,1,this.editForm.id)
            },
            // 选择商家图片
            selectMerchantImg(item){
                this.merchantInit = false
                if(item.coverFlag){
                    item.coverFlag = false
                }else{
                    item.coverFlag = true
                }
                this.merchantInit = true
            },
            //设为封面图
            setCoverImg(){
                let arr = []
                this.merchantImgList.map((item,index)=>{
                    if(item.coverFlag){
                    arr.push(index)
                    }
                })
                if(arr.length == 0){
                    this.$message({
                    type: 'warning',
                    message: '请选择设置的图片'
                    })
                    return
                }
                if(arr.length>1){
                    this.$message({
                    type: 'warning',
                    message: '封面图只能设置一张'
                    })
                }else{
                    this.merchantInit = false
                    this.merchantImgList.map((item,index)=>{
                    item.coverImgIf = false
                    item.coverFlag = false
                    })
                    this.merchantImgList[arr[0]].coverImgIf = true
                    this.merchantInit = true
                }
            },
            //删除图片
            delCoverImg(){
                let arr = []
                this.merchantImgList.map((item,index)=>{
                    if(item.coverFlag){
                    arr.push(index)
                    }
                })
                if(arr.length == 0){
                    this.$message({
                    type: 'warning',
                    message: '请选择要删除的图片'
                    })
                }else{
                    this.merchantInit = false
                    this.merchantImgList = this.merchantImgList.filter(item=>!item.coverFlag)
                    this.merchantInit = true
                }
            },
            //获取选择的图片
            selectImgList(data){
                // console.log(data)
                if(data.flag == '1'){
                    this.editForm.license_image = data.item[0].file_url
                }else if(data.flag == '2'){
                    this.editForm.certify_image = data.item[0].file_url
                }else if(data.flag == '3'){
                    this.editForm.special_image = data.item[0].file_url
                }else if(data.flag == '4'){
                    this.editForm.fire_image = data.item[0].file_url
                }else if(data.flag == '5'){
                    let arr = [...this.merchantImgList,...data.item]
                    const res = new Map();  //定义常量 res,值为一个Map对象实例
                    //返回arr数组过滤后的结果，结果为一个数组   过滤条件是，如果res中没有某个键，就设置这个键的值为1
                    this.merchantImgList = arr.filter((arr) => !res.has(arr.file_url) && res.set(arr.file_url, 1)) 
                    this.merchantImgList.map(item=>{
                    item.coverFlag = false
                    item.coverImgIf = false
                    })
                }
            },
            // 确定
            submitHandle() {
                this.$refs.editForm1.validate((valid) => {
                    if (valid) {
                        this.$refs.editForm3.validate((valid) => {
                            if (valid) {
                        this.editForm.merch_scope_ids =  this.merch_scope_ids.join(',')
                        this.destination.map((item,i)=>{
                            if(i == 0){
                                this.editForm.province_id = item
                                this.editForm.city_id = ''
                                this.editForm.area_id = ''
                                this.editForm.street_id = ''
                            }else if(i == 1){
                                this.editForm.city_id = item
                            }else if(i == 2){
                                this.editForm.area_id = item
                            }else if(i == 3){
                                this.editForm.street_id = item
                            }
                        });
                        let arr =[]
                        this.merchantImgList.map(item=>{
                            arr.push(item.file_url)
                        })
                        this.editForm.images = arr.join(',')
                        const params =  this.editForm 
                        // console.log('params',params)
                        setMerchantInfo(params).then(res => {
                            if (res.code === 0) {
                                this.$message({
                                    type: 'success',
                                    message: '编辑成功!'
                                })
                                this.editDialogVisible = false
                            }
                        })
                          }
                })
                    }
                })
            },
        },
    }
</script>
<style lang="scss" scoped>
.help-detail{
    line-height:2;
}
.el-icon-question{
    cursor: pointer;
}
.img-certificate{
    width: 120px;
    margin-top: 10px;
}
.coordinate-wrap{
    /deep/.el-form-item__content{
        display: flex;
    }
    .coordinate-box{
        display: flex;
        margin-right:15px;
        span{
            display: inline-block;
        }
    }
}
.merchant-img-box{
    display: flex;
    flex-wrap: wrap;
    margin-top: 20px;
    .img-box{
        margin-right: 15px;
        // border: 1px solid #DCDFE6;
        // padding: 0 10px;
        position: relative;
        cursor: pointer;
        .img-merchant{
            width: 100px;
            position: relative;
            // cursor:pointer;
        }
        .top-tool{
            position: absolute;
            z-index: 99;
            // pointer-events: none;
            .btn-back{
                display: inline-block;
                padding: 0 5px;
                height: 22px;
                line-height: 22px;
                font-size: 12px;
                color: #fff;
                background: rgba(0,0,0,.6);
                position: relative;
                cursor:pointer;
                top: -8px;
            }
            .actvie-btn-back{
              background: #42b983;
            }
            .el-icon-close{
              right: -15px;
            }
        }
        .select-mask{
                position: absolute;
                top: 0;
                bottom: 0;
                left: 0;
                right: 0;
                background: rgba(0,0,0,.3);
                text-align: center;
                z-index: 100;
                .el-icon-check{
                    font-size: 50px;
                    color: #fff;
                    position: relative;
                    top: 50%;
                    transform: translateY(-50%);
                }
            }
    }
}
.bottom-btn{
    padding-left: 100px;
}
</style>
