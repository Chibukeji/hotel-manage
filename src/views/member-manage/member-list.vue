<template>
  <div>
    <div class="filter-container">
      <div>
      <span class="filter-item">
        <!-- <el-select v-model="listQuery.idcard_verify_status" placeholder="实名认证" style="width: 160px">
            <el-option label="全部" value="" />
           <el-option v-for="(item,index) in verifyList" :key="index" :label="item.name" :value="item.value" />
        </el-select> -->
      </span>
       <span class="filter-item">
        <el-select v-model="listQuery.source" placeholder="会员来源" style="width: 160px">
            <el-option label="全部" value="" />
           <el-option v-for="(item,index) in sourceList" :key="index" :label="item.name" :value="item.value" />
        </el-select>
      </span>
       <span class="filter-item">
        <el-select v-model="listQuery.sex" placeholder="会员性别" style="width: 160px">
            <el-option label="全部" value="" />
           <el-option v-for="(item,index) in sexList" :key="index" :label="item.name" :value="item.value" />
        </el-select>
      </span>
      <el-input v-model="listQuery.keyword" placeholder="会员昵称/手机号/邮箱" style="width:300px" class="filter-item" />
      <el-button class="filter-item" type="primary" size="mini" icon="el-icon-search" @click="handleFilter">搜索</el-button>
        <span class="right-font filter-item">上周会员注册数：{{lastWeekMember}}</span>
        <span class="right-font filter-item">本周会员注册数：{{thisWeekMember}}</span>
        <span class="right-font filter-item">分时积分：{{time_score_all}}</span>
        <span class="right-font filter-item">专属积分：{{exclusive_score_all}}</span>
      </div>
      <div>
        <el-button class="filter-item" type="success" size="mini" icon="el-icon-refresh" @click="refresh">刷新</el-button>
        <el-button v-if="btnAry.findIndex(x => x.id == '77')!=-1" class="filter-item" type="primary" size="mini" :loading="exportAllloading" @click="exportTable('1')">全部导出</el-button>
        <el-button v-if="btnAry.findIndex(x => x.id == '78')!=-1" class="filter-item" type="primary" size="mini" @click="exportTable('2')">按页导出</el-button>
      </div>
    </div>
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%;">
      <el-table-column label="ID" align="center" width="60">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
       <el-table-column label="会员昵称" align="left"  width="180">
        <template slot-scope="{row}">
          <div style="display:flex;cursor: pointer;" @click="handleDetail(row,'first')"> 
            <img v-if="row.head_pic == '' || row.head_pic == null" src="../../assets/images/default_author_head.png" class="heder-img">
            <img v-else :src="row.head_pic" class="heder-img">
            <span class="member-name">{{row.nickname}}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="真实姓名" align="center">
        <template slot-scope="{row}">
          <span v-if="row.real_name == null ||row.real_name == ''">-</span>
          <span v-else>{{ row.real_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="手机号码" align="center">
        <template slot-scope="{row}">
          <span v-if="row.phone == null ||row.phone == ''">-</span>
          <span v-else>{{row.phone}}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="余额" align="center" width="100">
        <template slot-scope="{row}">
          <span>{{row.money}}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="订单数" align="center" width="100">
        <template slot-scope="{row}">
          <span class="member-source">{{row.order_nums}}</span>
        </template>
      </el-table-column>
      <el-table-column label="分时积分" align="center" width="100">
        <template slot-scope="{row}">
          <span>{{row.time_score}}</span>
        </template>
      </el-table-column>
      <el-table-column label="专属积分" align="center" width="100">
        <template slot-scope="{row}">
          <span>{{row.exclusive_score}}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="商城金币" align="center" width="100">
        <template slot-scope="{row}">
          <span>{{row.gold}}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="会员来源" align="center"  width="100">
        <template slot-scope="{row}">
          <span v-if="row.source == 0" >公众号</span>
          <span v-if="row.source == 1" >安卓</span>
          <span v-if="row.source == 2" >ios</span>
          <span v-if="row.source == 3" >美团</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="会员级别" align="center" width="100">
        <template slot-scope="{row}">
          <span >{{row.member_level_name}}</span>
        </template>
      </el-table-column> -->
       <el-table-column label="注册时间" align="center" width="160">
        <template slot-scope="{row}">
          <div class="font-12">{{row.create_time}}</div>
        </template>
      </el-table-column>
       <el-table-column label="最后登录" align="center" width="160">
        <template slot-scope="{row}">
          <div  v-if="row.login_time == null ||row.login_time == ''">-</div>
          <div  class="font-12" v-else>{{ row.login_time }}</div>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="150" class-name="fixed-width">
        <template slot-scope="{row}">
          <!-- <el-button v-if="btnAry.findIndex(x => x.id == '79')!=-1" type="primary" size="mini" icon="el-icon-edit" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button v-if="btnAry.findIndex(x => x.id == '80')!=-1" type="primary" size="mini" @click="handleRecharge(row)">充值</el-button> -->
          <el-button v-if="btnAry.findIndex(x => x.id == '81')!=-1" type="primary" size="mini"  @click="handleDetail(row,'second')">
            订单详情
          </el-button>
          <!-- <el-dropdown v-if="moreBtnFlag" trigger="click">
            <el-button type="primary" size="mini">
              更多<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-if="btnAry.findIndex(x => x.id == '79')!=-1"  @click.native="handleUpdate(row)">编辑</el-dropdown-item>
              <el-dropdown-item v-if="btnAry.findIndex(x => x.id == '80')!=-1" @click.native="handleRecharge(row)">充值</el-dropdown-item>
              <el-dropdown-item v-if="btnAry.findIndex(x => x.id == '81')!=-1" @click.native="handleDetail(row,'second')">订单详情</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown> -->
        </template>
      </el-table-column>
    </el-table>
    <pagination :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.size" @pagination="paginHandle" />
    <el-dialog :visible.sync="editDialogVisible" :title="dialogTitle" class="right-dialog" custom-class="left">
      <el-form ref="editForm" :rules="rules" :model="editForm" label-position="left" label-width="80px" style="width:80%;margin-bottom:50px">
        <el-form-item label="会员昵称" prop="nickname">
          <el-input v-model="editForm.nickname" placeholder="请输入会员昵称" />
        </el-form-item>
        <el-form-item label="真实姓名" prop="real_name">
          <el-input v-model="editForm.real_name" placeholder="请输入真实姓名"/>
        </el-form-item>
        <el-form-item label="电子邮件" prop="email">
          <el-input v-model="editForm.email" placeholder="请输入电子邮件"/>
        </el-form-item>
         <el-form-item label="微信号" prop="wechat_no">
          <el-input v-model="editForm.wechat_no" placeholder="请输入微信号"/>
        </el-form-item>
         <el-form-item label="籍贯" prop="native_place">
          <el-input v-model="editForm.native_place" placeholder="请输入籍贯"/>
        </el-form-item>
        <el-form-item label="性别" prop="status">
          <el-radio-group v-model="editForm.sex" style="width:100%;text-align: left;">
            <el-radio v-for="(item,index) in sexList" :key="index" :label="item.value">{{item.name}}</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="editDialogVisible = false">取消</el-button>
        <el-button size="small" type="primary" @click="submitHandle">确定</el-button>
      </div>
    </el-dialog>
    <!-- 订单详情 -->
    <member-detail ref="memberDetailChild" />
    <!-- 充值弹窗 -->
    <recharge-form ref="rechargeDetailChild" @successRecharge="successRecharge"/>
  </div>
</template>

<script>
import { getMemberList,   getMemberEdit, getMemberWeekNumsList,getMemberExportExcel } from '@/api/member-manage/member-list'
import MemberDetail from "./component/member-detail";
import RechargeForm from "./component/recharge-form";
import Pagination from '@/components/Pagination'
import mix from '@/mixs/mix'
export default {
  components: { Pagination,MemberDetail,RechargeForm },
  mixins: [mix],
  data() {
    return {
      listQuery: {
        keyword: '',
        // idcard_verify_status:'',
        source:null,
        sex:null,
        page: 1,
        size: 20
      },
      total: 0,
      listLoading: false,
      list: [],
      multipleSelection: [],
      rules: {
        nickname:[{ required: true, message: '请输入内容', trigger: 'blur' }],
      },
      editDialogVisible: false,
      dialogTitle: '',
      editForm: {
        nickname:'',
        real_name:'',
        email:'',
        wechat_no:'',
        native_place:'',
        sex:0,
      },
      calendarTypeOptions: [],
      editFlag:'',
      verifyList:[
          {name:'未认证',value:0},
          {name:'审核中',value:1},
          {name:'通过',value:2},
          {name:'不通过',value:3}
      ],
      sourceList:[
        {name:'公众号',value:0},
        {name:'安卓',value:1},
        {name:'ios',value:2},
        {name:'美团',value:3}
      ],
      sexList:[
        {name:'保密',value:0},
        {name:'男',value:1},
        {name:'女',value:2},
      ],
      lastWeekMember:0,
      thisWeekMember:0,
      time_score_all:0,
      exclusive_score_all:0,
      exportAllloading:false,
      btnAry:[],
      moreBtnFlag:true
    }
  },
  mounted () {
    this.getList();
    this.memberWeekNumsList()
    this.$store.dispatch('user/showBtn', { id: 21 }).then(res => {
      // console.log('res', res)
      this.btnAry = res.children
      if(this.btnAry.findIndex(x => x.id == '81')!=-1){
        this.moreBtnFlag = true
       }else{
        this.moreBtnFlag = false
       }
    })
  },
  methods: {
    // 获取列表
    getList() {
      this.listLoading = true
      getMemberList(this.listQuery).then(res => {
        this.list = res.data.data.data
        this.total = res.data.data.total
        this.listLoading = false
      })
    },
     //刷新
    refresh(){
      this.listQuery = {
        keyword: '',
        source:null,
        sex:null,
        page: 1,
        size: 20
      }
      this.getList();
      this.memberWeekNumsList()
    },
    //会员上周和本周注册数接口
    memberWeekNumsList(){
        getMemberWeekNumsList().then(res=>{
            this.lastWeekMember = res.data.last_num
            this.thisWeekMember = res.data.now_num
            this.time_score_all = res.data.time_score
            this.exclusive_score_all = res.data.exclusive_score
        })
    },
    // 勾选表格内容
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    // 点击搜索
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    // 点击翻页
    paginHandle(val) {
      if (val != undefined) {
        const json = JSON.parse(JSON.stringify(val))
        this.listQuery.page = parseInt(json.page)
        this.listQuery.size = parseInt(json.limit)
      }
      this.getList()
    },
    // 点击添加
    handleCreate() {
      this.editDialogVisible = true
      this.dialogTitle = '添加'
      this.editFlag = true
    },
    // 点击编辑
    handleUpdate(item) {
      this.editDialogVisible = true
      this.dialogTitle = item.nickname+'-编辑'
      this.editId = item.id
      this.editFlag = false
      for (const key in item) {
        if (this.editForm[key] != undefined) {
            this.editForm[key] = item[key]
        }
      }
     
    },
    // 弹窗确定
    submitHandle() {
      this.$refs.editForm.validate((valid) => {
        if (valid) {
           this.editForm.sorts = parseInt(this.editForm.sorts)
          if (!this.editFlag) {
            const params =  Object.assign(this.editForm,{id:this.editId}) 
            getMemberEdit(params).then(res => {
              if (res.code === 0) {
                this.$message({
                  type: 'success',
                  message: '编辑成功!'
                })
                this.getList()
                this.editDialogVisible = false
              }
            })
          }
        }
      })
    },
    //查看订单详情
    handleDetail(row,flag){
        this.$refs.memberDetailChild.init(row,flag)
    },
    //充值
    handleRecharge(row){
       this.$refs.rechargeDetailChild.init(row) 
    },
    successRecharge(){
      this.getList();
      this.memberWeekNumsList()
    },
    //导出数据
    exportTable(flag){
      let params
      if(flag == '1'){
        this.exportAllloading = true
        params={
          keyword:this.listQuery.keyword,
          source:this.listQuery.source,
          sex:this.listQuery.sex,
        }
      }else{
        params = this.listQuery
      }
      getMemberExportExcel(params).then(res=>{
        // console.log(res)
        this.exportAllloading = false
        if(res.code == 0){
          window.open(res.data)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.filter-container{
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    .right-font{
        font-size: 14px;
        margin-left: 10px;
    }
}
.my-dropdown{
  /deep/.el-button-group>.el-button+.el-button {
    height: 28px;
  }
}
/deep/.el-dropdown-menu__item {
  padding: 5px 30px;
}
.font-12{
  font-size: 12px;
}
.heder-img{
  width: 24px;
  height: 24px;
  vertical-align: middle;
}
.member-name{
  vertical-align: middle;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  margin-left: 5px;
  color:#008ed8
}
/deep/.el-tab-pane{
  margin-top: 15px;
}
</style>
