<template>
  <div>
    <div class="filter-container">
        <span class="filter-item">
            <!-- <el-select v-model="listQuery.hotel_id" placeholder="我的酒店" style="width: 160px">
                <el-option v-for="(item,index) in hotelList" :key="index" :label="item.title" :value="item.id" />
            </el-select> -->
          <span class="select-title">酒店：</span>
            <el-select  v-model="listQuery.hotel_id" filterable clearable  remote placeholder="请输入酒店关键字搜索"
                :remote-method="remoteMethod2" :loading="loadingSearch2" >
              <el-option v-for="item in hotelList2" :key="item.id" :label="item.title" :value="item.id" />
          </el-select>
        </span>
        <el-input v-model="listQuery.keyword" placeholder="员工姓名/员工账号" style="width: 300px" class="filter-item" />
        <el-button class="filter-item" type="primary" size="mini" icon="el-icon-search" @click="handleFilter">搜索</el-button>
        <el-button class="filter-item" type="success" size="mini" icon="el-icon-refresh" @click="refresh">刷新</el-button>
        <el-button v-if="btnAry.findIndex(x => x.id == '109')!=-1" class="filter-item" type="primary" size="mini" icon="el-icon-plus" @click="handleCreate">添加</el-button>
        <el-button v-if="btnAry.findIndex(x => x.id == '110')!=-1" class="filter-item" type="danger" size="mini" icon="el-icon-close" @click="delMore()">删除</el-button>
    </div>
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%;" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" />
      <el-table-column label="ID" align="center" width="80">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
       <el-table-column label="用户名" align="center" width="150">
        <template slot-scope="{row}">
          <span>{{row.username}}</span>
        </template>
      </el-table-column>
       <el-table-column label="登录密码" align="center" width="150">
        <template slot-scope="{row}">
          <span>{{row.password_show}}</span>
        </template>
      </el-table-column>
      <el-table-column label="员工姓名" align="center" >
        <template slot-scope="{row}">
          <span>{{ row.tname }}</span>
        </template>
      </el-table-column>
      <el-table-column label="手机号" align="center" >
        <template slot-scope="{row}">
          <span>{{ row.mobile }}</span>
        </template>
      </el-table-column>
      <el-table-column label="角色名称" align="center" >
        <template slot-scope="{row}">
          <span>{{ row.group_name }}</span>
        </template>
      </el-table-column>
       <el-table-column label="管理酒店" align="left" width="250">
        <template slot-scope="{row}">
          <span>{{ row.hotel_names }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" width="150">
        <template slot-scope="{row}">
          <el-button v-if="row.status==1" type="primary" size="mini" @click="handleStatus(row)">禁用</el-button>
          <el-button v-if="row.status==0" type="danger" size="mini" @click="handleStatus(row)">启用</el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="200" class-name="fixed-width">
        <template slot-scope="{row,$index}">
          <el-button v-if="btnAry.findIndex(x => x.id == '111')!=-1" type="primary" size="mini" icon="el-icon-edit" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button v-if="row.is_delete == 1 && btnAry.findIndex(x => x.id == '110')!=-1" size="mini" type="danger" icon="el-icon-close" @click="handleDelete(row,$index)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.size" @pagination="paginHandle" />
    <el-dialog :visible.sync="editDialogVisible" :title="dialogTitle" class="right-dialog" custom-class="left">
      <el-form ref="editForm" :rules="rules" :model="editForm" label-position="left" label-width="120px" style="width:80%;margin-bottom:50px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="editForm.username" placeholder="请输入用户名" :disabled="!editFlag"/>
        </el-form-item>
        <el-form-item label="登录密码" prop="password">
          <el-input v-model="editForm.password" placeholder="请输入登录密码"/>
        </el-form-item>
        <el-form-item label="姓名" prop="tname">
          <el-input v-model="editForm.tname" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item label="手机号码" prop="mobile">
          <el-input v-model="editForm.mobile" placeholder="请输入手机号码" oninput="value=value.replace(/[^\d]/g,'')"/>
        </el-form-item>
        <el-form-item label="员工可管理酒店" prop="hotel_ids">
            <el-checkbox-group v-model="editForm.hotel_ids">
                <el-checkbox v-for="(item,index) in hotelList" :key="index" :label="item.id" name="type">{{item.title}}</el-checkbox>
            </el-checkbox-group>
        </el-form-item>
        <el-form-item label="角色" prop="group_id">
            <el-select v-model="editForm.group_id" placeholder="请选择" >
                <el-option v-for="(item,index) in roleList" :key="index" :label="item.title" :value="item.id" />
            </el-select>
        </el-form-item>
        <el-form-item label="关联会员" prop="member_id">
           <el-select  v-model="editForm.member_id" filterable clearable remote placeholder="请输入会员昵称搜索"
            :remote-method="remoteMethod" :loading="loadingSearch" >
            <el-option v-for="item in memberList" :key="item.id" :label="item.nickname" :value="item.id">
                <img :src="item.head_pic" style="width:20px;height:20px;vertical-align: middle;margin-right:2px">
                <span style="vertical-align: middle;">{{item.nickname}}(id:{{item.id}})</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="editForm.status" style="width:100%;text-align: left;">
            <el-radio label="1">启用</el-radio>
            <el-radio label="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="editDialogVisible = false">取消</el-button>
        <el-button size="small" type="primary" @click="submitHandle">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getMerchAccountList,  getMerchAccountAdd,  getMerchAccountEdit,  getMerchAccountDel } from '@/api/staff-manage/staff-list'
import { getRoleList} from '@/api/system-manage/role-list'
import { getHotelList} from '@/api/hotel-manage/hotel-list'
import { getSearchMemberList} from '@/api/member-manage/member-list'
import Pagination from '@/components/Pagination'
import mix from '@/mixs/mix'
export default {
  components: { Pagination },
  mixins: [mix],
  data() {
    var checkPhone = (rule, value, callback) => {
      const reg = /^1[0-9]{10}$/
      if (reg.test(value)) {
        return callback()
      }
      callback('请输入正确的手机号')
    }
    return {
      listQuery: {
        keyword: '',
        hotel_id:null,
        page: 1,
        size: 20
      },
      total: 0,
      listLoading: false,
      list: [],
      multipleSelection: [],
      rules: {
        username:[{ required: true, message: '请输入内容', trigger: 'blur' }],
        password:[{ required: true, message: '请输入内容', trigger: 'blur' }],
        tname:[{ required: true, message: '请输入内容', trigger: 'blur' }],
        mobile:[{ required: true,  trigger: 'blur',validator: checkPhone, }],
        hotel_ids:[{ type: 'array', required: true, message: '请至少选择一个', trigger: 'change' }],
        group_id:[{ required: true, message: '请选择', trigger: 'change' }],
        member_id:[{ required: true, message: '请输入内容', trigger: 'blur' }],
        status: [{ required: true, message: '请选择', trigger: 'change' }],

      },
      editDialogVisible: false,
      dialogTitle: '',
      editForm: {
        username: '',
        password:'',
        tname:'',
        mobile:'',
        hotel_ids:[],
        group_id:'',
        member_id:'',
        status: '1',
      },
      calendarTypeOptions: [],
      editFlag:'',
      hotelList:[],
      roleList:[],
      loadingSearch: false,
      memberList: [],
      btnAry:[],
      loadingSearch2:false,
      hotelList2:[],
    }
  },
  mounted () {
    //  console.log(this.$route.params)
    if(this.$route.params.name != undefined){
     
      this.remoteMethod2(this.$route.params.name)
      this.listQuery.hotel_id = this.$route.params.id
    }
    this.getHotel();
    this.getList();
    this.getRole();
    this.$store.dispatch('user/showBtn', { id: 27 }).then(res => {
      // console.log('res', res)
      this.btnAry = res.children
    })
  },
  methods: {
    // 获取列表
    getList() {
      this.listLoading = true
      getMerchAccountList(this.listQuery).then(res => {
        this.list = res.data.data.data
        this.total = res.data.data.total
        this.listLoading = false
      })
    },
    //刷新
    refresh(){
      this.listQuery = {
        keyword: '',
        hotel_id:null,
        page: 1,
        size: 20
      }
      this.getList();
    },
    // 搜索酒店
    remoteMethod2(query) {
      if (query == '' || query == null) {
        this.hotelList2 = []
      } else {
        this.loadingSearch2 = true
        getHotelList({ name: query, page: 1, size: 9999,}).then(res => {
          this.loadingSearch2 = false
          this.hotelList2 = res.data.data.data
        })
      }
    },
    //获取我的酒店列表
    getHotel(){
        getHotelList({page:1,size:9999}).then(res=>{
            this.hotelList = res.data.data.data
             if(this.$route.params != undefined){
              this.listQuery.hotel_id = this.$route.params.id
            }
        })
    },
    // 获取角色列表
    getRole() {
      getRoleList({page:1,size:9999}).then(res => {
        this.roleList = res.data.data
      })
    },
    // 勾选表格内容
    handleSelectionChange(val) {
      this.multipleSelection = val
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
    //搜索
    handleFilter(){
        this.listQuery.page = 1
        this.getList();
    },
    // 点击添加
    handleCreate() {
      this.editDialogVisible = true
      this.dialogTitle = '添加'
      this.editFlag = true
      this.$nextTick(()=>{
        this.$refs.editForm.resetFields();
        this.editForm.status = '1'
        this.editForm.group_id = this.roleList[0].id
      })
    },
    // 点击编辑
    handleUpdate(item) {
      // console.log(item)
      this.editDialogVisible = true
      this.dialogTitle = item.username+'-编辑'
      this.editId = item.id
      this.editFlag = false
      this.$nextTick(()=>{
        for (const key in item) {
          if (this.editForm[key] != undefined) {
            this.editForm[key] = item[key]
          }
        }
        this.editForm.member_id = item.member_id
        this.remoteMethod(item.member_name)
        this.editForm.password = item.password_show
        this.editForm.status = item.status.toString()
        this.editForm.hotel_ids = []
        let arr = item.hotel_ids.split(',')
        arr.map(item=>{
          if(item == 'NaN'){}
          else{
            this.editForm.hotel_ids.push(parseInt(item))
          }
        })
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
    // 弹窗确定
    submitHandle() {
      this.$refs.editForm.validate((valid) => {
        if (valid) {
           let params = {
                username: this.editForm.username,
                password:this.editForm.password,
                tname:this.editForm.tname,
                mobile:this.editForm.mobile,
                hotel_ids:this.editForm.hotel_ids.join(','),
                group_id:this.editForm.group_id,
                member_id:this.editForm.member_id,
                status: this.editForm.status,
            }
          if (this.editFlag) {
            getMerchAccountAdd(params).then(res => {
              if (res.code === 0) {
                this.$message({
                  type: 'success',
                  message: '添加成功!'
                })
                this.getList()
                this.editDialogVisible = false
              }
            })
          } else {
            let params2 =  Object.assign(params,{id:this.editId}) 
            getMerchAccountEdit(params2).then(res => {
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
    // 点击修改状态
    handleStatus(row) {
      if (this.btnAry.findIndex(x => x.id == '112') == -1) {
        this.$message({
          type: 'warning',
          message: '您没有权限修改'
        })
        return
      }
      let text
      if (row.status == 1) {
        text = '启用'
      } else if (row.status == 0) {
        text = '禁用'
      }
      this.$confirm('确定要改为' + text + '状态吗', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let status
        if (row.status == 0) {
          status = 1
        } else if (row.status == 1) {
          status = 0
        }
        const params = {
          id: row.id,
          status: status
        }
        getMerchAccountEdit(params).then(res => {
          if (res.code == 0) {
            this.$message({
              message: '修改成功',
              type: 'success'
            })
            this.getList()
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    },
    // 删除单条数据
    handleDelete(row, index) {
      this.$confirm('确认要删除吗', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          const params = {
            id: row.id
          }
          getMerchAccountDel(params).then(res => {
            if (res.code === 0) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              this.getList()
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
    },
     //删除多条数据
    delMore() {
      if(this.multipleSelection.length == 0){
        this.$message({
          type: 'warning',
          message: '请选择要删除的项'
        })
        return
      }
      this.$confirm('确认要删除吗', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          const idArr = this.multipleSelection.map(x => { return x.id })
          const params = {
            ids: idArr.join(',')
          }
          getMerchAccountDel(params).then(res => {
            if (res.code === 0) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              this.getList()
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
    },
  }
}
</script>

<style lang="scss" scoped>

</style>
