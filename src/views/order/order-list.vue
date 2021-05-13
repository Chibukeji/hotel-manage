<template>
  <div>
    <div class="filter-container" style="margin:5px 0px">
        <div class="right-font">
            <span  style="margin-right:10px">今日：<span class="top-num">￥{{dayJson.today_total}}</span>元</span>
            <span  style="margin-right:10px">昨日：<span class="top-num">￥{{dayJson.yesterday_total}}</span>元</span>
            <span  style="margin-right:10px">本周：<span class="top-num">￥{{dayJson.week_total}}</span>元</span>
            <span  style="margin-right:10px">本月：<span class="top-num">￥{{dayJson.month_total}}</span>元</span>
            <span>总销售额：<span class="top-num">￥{{dayJson.total_amonut}}</span>元</span>
        </div>
    </div>
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane label="全部" name="all"></el-tab-pane>
      <el-tab-pane v-for="(item,index) in orderStatusList" :key="index" :label="item.name" :name="item.value"></el-tab-pane>
    </el-tabs>
     <div class="filter-container" style="margin:5px 0px">
        <div class="right-font" style="margin-top:-10px">
            <span  style="margin-right:10px">订单：<span class="top-num">{{totalData.order_nums}}</span>个</span>
            <span  style="margin-right:10px">金额：<span class="top-num">￥{{totalData.total_order_money}}</span>元</span>
            <span  style="margin-right:10px">实收金额/积分：<span class="top-num">￥{{totalData.total_pay_money}}</span>元</span>
        </div>
        <div>
          <el-button class="filter-item" type="success" size="mini" icon="el-icon-refresh" @click="refresh">刷新</el-button>
          <el-button v-if="btnAry.findIndex(x => x.id == '83')!=-1" class="filter-item" type="primary" size="mini" :loading="exportAllloading" @click="exportTable('1')">全部导出</el-button>
          <el-button v-if="btnAry.findIndex(x => x.id == '84')!=-1" class="filter-item" type="primary" size="mini" @click="exportTable('2')">按页导出</el-button>
        </div>
    </div>
    <div class="filter-container">
      <div>
        <!-- <span class="filter-item">
            <el-select v-model="listQuery.status" placeholder="订单状态" style="width: 160px">
                <el-option label="全部" value="" />
                <el-option v-for="(item,index) in orderStatusList" :key="index" :label="item.name" :value="item.value" />
            </el-select>
        </span> -->
        <span class="filter-item">
            <el-select v-model="listQuery.source" placeholder="订单来源" style="width: 160px">
                <el-option label="全部" value="" />
                <el-option v-for="(item,index) in sourceList" :key="index" :label="item.name" :value="item.value" />
            </el-select>
        </span>
       
        <span class="filter-item">
            <el-select v-model="listQuery.pay_way" placeholder="付款方式" style="width: 160px">
                <el-option label="全部" value="" />
                <el-option v-for="(item,index) in payTypeList" :key="index" :label="item.name" :value="item.value" />
            </el-select>
        </span>
        <span class="filter-item">
          <el-select  v-model="listQuery.hotel_id" filterable clearable remote placeholder="请输入酒店名称/酒店编号搜索"
            :remote-method="remoteMethod" :loading="loadingSearch" style="width:250px">
            <el-option v-for="item in hotelList" :key="item.id" :label="item.title" :value="item.id" />
          </el-select>
        </span>
        <span class="filter-item">
            <el-cascader v-model="placeOrigin" :options="siteOptions"  :props="belongRegoinProps"
            clearable placeholder="所属城市" ></el-cascader>
        </span>
        <span class="filter-item">
            <span class="select-title">时间范围：</span>
            <el-date-picker v-model="dateRange" type="daterange" range-separator="至" start-placeholder="开始日期" 
            end-placeholder="结束日期" style="width: 250px"  value-format="timestamp" :default-time="['00:00:00', '23:59:59']">
            </el-date-picker>
        </span>
        <el-input v-model="listQuery.keyword" placeholder="订单号/产品名称/联系人" style="width:250px" class="filter-item" />
        <el-button class="filter-item" type="primary" size="mini" icon="el-icon-search" @click="handleFilter">搜索</el-button>
      </div>
    </div>
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%;">
      <el-table-column label="订单号" fixed align="center" width="180">
        <template slot-scope="{row}">
          <span v-if="btnAry.findIndex(x => x.id == '89')!=-1" style="color:#008ed8;cursor: pointer;"  @click="handleDetail(row,'1')">{{ row.order_sn }}</span>
          <span v-else>{{ row.order_sn }}</span>
        </template>
      </el-table-column>
       <el-table-column label="酒店名称" align="left" :show-overflow-tooltip="true">
        <template slot-scope="{row}">
          <span>{{row.order_title}}</span>
        </template>
      </el-table-column>
       <el-table-column label="会员" align="left"  width="180" :show-overflow-tooltip="true">
        <template slot-scope="{row}">
          <div style="display:flex">
            <img v-if="row.member_head_pic == '' || row.member_head_pic == null" src="../../assets/images/default_author_head.png" class="heder-img">
            <img v-else :src="row.member_head_pic" class="heder-img">
            <span class="member-name">{{row.nickname}}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="住宿人" align="center" width="110">
        <template slot-scope="{row}">
          <span>{{row.link_name.split(',')[0]}}</span>
        </template>
      </el-table-column>
      <el-table-column label="联系电话" align="center" width="110">
        <template slot-scope="{row}">
          <span>{{row.link_phone}}</span>
        </template>
      </el-table-column>
      <el-table-column label="下单日期/离店日期" align="center" width="150">
        <template slot-scope="{row}">
          <div>{{ row.create_time }}</div>
          <div>
            <span v-if="row.finish_time == null || row.finish_time == ''">-</span>
            <span v-else>{{row.finish_time}}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="数量" align="center" width="80">
        <template slot-scope="{row}">
          <div>{{row.total_num}}间房</div>
          <div>{{row.booking_num}}晚</div>
        </template>
      </el-table-column>
       <el-table-column label="总价" align="center" width="80">
        <template slot-scope="{row}">
          <span>{{row.total_price}}</span>
        </template>
      </el-table-column>
       <el-table-column label="实收金额/积分" align="center" width="110">
        <template slot-scope="{row}">
          <span>{{row.total_pay_price}}</span>
        </template>
      </el-table-column>
       <el-table-column label="酒店结算" align="center" width="80">
        <template slot-scope="{row}">
          <span v-if="row.hotel_money == null || row.hotel_money == ''">-</span>
          <span v-else>{{row.hotel_money}}</span>
        </template>
      </el-table-column>
      <el-table-column label="平台佣金" align="center" width="80">
        <template slot-scope="{row}">
          <span v-if="row.platform_commission == null || row.platform_commission == ''">-</span>
          <span v-else>{{row.platform_commission}}</span>
        </template>
      </el-table-column>
      <el-table-column label="订单状态" align="center" width="100">
        <template slot-scope="{row}">
            <span v-if="row.status == 0" >待处理</span>
            <span v-if="row.status == 1" >待付款</span>
            <span v-if="row.status == 2" >待酒店接受</span>
            <span v-if="row.status == 3" >订单取消</span>
            <span v-if="row.status == 4" >已退款</span>
            <span v-if="row.status == 5" >已接受待入住</span>
            <span v-if="row.status == 6" >已入住</span>
            <span v-if="row.status == 7" >交易完成</span>
            <span v-if="row.status == 8" >退款申请</span>
        </template>
      </el-table-column>
       <el-table-column label="订单类型" align="center"  width="80">
        <template slot-scope="{row}">
            <span v-if="row.order_type == 0" >普通</span>
            <span v-if="row.order_type == 1" >扫码</span>
        </template>
      </el-table-column>
      <el-table-column  label="操作" align="center" width="160" class-name="fixed-width">
        <template slot-scope="{row}" >
          <div v-if="row.status == 2 || row.status == 5|| row.status == 6">
            <el-button v-if="row.status == 5 && btnAry.findIndex(x => x.id == '155')!=-1" type="primary" size="mini" @click="refundHandle(row)">协商退款</el-button>
            <el-button v-if="row.status == 2 && btnAry.findIndex(x => x.id == '85')!=-1" type="primary" size="mini" @click="roomStatusHandle(row)">接受</el-button>
            <el-button v-if="row.status == 5 && btnAry.findIndex(x => x.id == '86')!=-1" type="primary" size="mini" @click="roomStatusTimeHandle(row)">入住</el-button>
            <el-button v-if="row.status == 6 && btnAry.findIndex(x => x.id == '87')!=-1" type="primary" size="mini" @click="roomStatusTimeHandle(row)">退房</el-button>
            <el-button v-if="row.status == 2 && btnAry.findIndex(x => x.id == '88')!=-1" type="primary" size="mini" @click="roomStatusHandle(row,'1')">拒绝</el-button>
          </div>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" width="80">
        <template slot-scope="{row}">
          <span v-if="row.is_read == 0" style="color:red">未读</span>
          <span v-if="row.is_read == 1" >已读</span>
        </template>
      </el-table-column>
      <el-table-column v-if="btnAry.findIndex(x => x.id == '89')!=-1" label="管理" align="center" width="80" class-name="fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" v-if="row.is_read == 1" @click="handleDetail(row,'1')">查看</el-button>
          <el-button type="primary" size="mini" v-if="row.is_read == 0" @click="handleDetail(row,'2')">未查看</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.size" @pagination="paginHandle" />
    <!-- 订单详情 -->
    <order-detail ref="orderDetailChild" />
    <!-- 安全码 -->
    <security-code ref="securityCodeChild" @confirmSubmit="confirmSubmit"/>
    <!-- 入住退房时间弹窗 -->
    <el-dialog title="选择时间" :visible.sync="timeVisible" width="500px">
      <el-form :model="timeForm" :rules="timeRules" ref="timeForm" label-width="100px">
          <el-form-item label="选择时间" prop="time">
            <el-date-picker v-model="timeForm.time" type="datetime" placeholder="选择日期时间" value-format="yyyy-MM-dd HH:mm"   format="yyyy-MM-dd HH:mm"
             @change="handleSelectDate()">
            </el-date-picker>
            <!-- :picker-options="pickerOptionsStart" -->
          </el-form-item>
      </el-form>
      <div class="pop-btn-box">
        <el-button  size="small " @click="timeVisible = false">取消</el-button>
        <el-button :loading="btnLoading3" type="primary" size="small " @click="timeSubmit">提交</el-button>
      </div>
    </el-dialog>
    <!-- 协商退款 -->
    <el-dialog title="协商退款" :visible.sync="refundVisible" width="500px">
      <el-form :model="refundForm"  ref="refundForm" label-width="100px">
          <el-form-item v-for="(item,index) in refundForm.refundList" :key="index" 
          :prop="'refundList.' + index + '.price'"
          :rules="[
            { required: true,  trigger: 'blur', message:'请输入内容'},
            {pattern: /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/, message: '请输入正确额格式,可保留两位小数' }
          ]">
            <span slot="label">
              <span>{{item.text}}：</span>
            </span>
            <span>{{item.showPrice}}</span>
            <el-input v-model="item.price" oninput="value=value.replace(/[^0-9.]/g,'')" style="display: inline-block;width:150px;margin-left:20px"></el-input>
          </el-form-item>
      </el-form>
      <div class="pop-btn-box">
        <el-button  size="small " @click="refundVisible = false">取消</el-button>
        <el-button :loading="btnLoading2" type="primary" size="small " @click="refundSubmit">提交</el-button>
      </div>
    </el-dialog>
    <!-- 拒绝理由 -->
    <el-dialog title="拒绝理由" :visible.sync="refuseVisible" width="500px">
      <el-form :model="refuseForm" :rules="refuseRules" ref="refuseForm" label-width="50px">
          <el-form-item label="理由" prop="cause" >
            <el-input type="textarea" v-model="refuseForm.cause" ></el-input>
          </el-form-item>
      </el-form>
      <div class="pop-btn-box">
        <el-button  size="small " @click="refuseVisible = false">取消</el-button>
        <el-button  type="primary" size="small " @click="refuseSubmit">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getMemberOrderList,totalByDate,getMemberOrderReadList,getOrderExportExcel,editOrderStatus,
getOrderPayInfo,consultRefundOrder,getRoomNums} from '@/api/order/order-list'
import { getHotelList} from '@/api/hotel-manage/hotel-list'
import { allAddressList } from '@/api/common'
import OrderDetail from "./component/order-detail";
import Pagination from '@/components/Pagination'
import SecurityCode from '@/components/SecurityCode'
import mix from '@/mixs/mix'
import { mapState } from 'vuex'
export default {
  components: { Pagination,OrderDetail,SecurityCode },
  mixins: [mix],
  data() {
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
      activeName:'all',
      listQuery:{
        keyword:'',
        status:'',
        source:null,
        pay_way:null,
        hotel_id:null,
        start_time:'',
        end_time:'',
        member_id:'',
        province_id:'',
        city_id:'',
        area_id:'',
        street_id:'',
        page: 1,
        size: 20,
      },
      total: 0,
      listLoading: false,
      placeOrigin:[],
      dateRange:[],
      list: [],
      merchantList:[],
      siteOptions:[],
      orderStatusList:[
        {name:'待付款',value:'1'},
        {name:'待酒店接受',value:'2'},
        {name:'订单取消',value:'3'},
        {name:'已退款',value:'4'},
        {name:'已接受待入住',value:'5'},
        {name:'已入住',value:'6'},
        {name:'交易完成',value:'7'},
        {name:'退款申请',value:'8'}
      ],
      sourceList:[
        {name:'公众号',value:0},
        {name:'安卓',value:1},
        {name:'ios',value:2},
      ],
      payTypeList:[
        {name:'微信',value:1},
        {name:'支付宝',value:2},
        {name:'余额',value:3},
        {name:'现金',value:4},
      ],
      dayJson:{
        today_total:0,
        yesterday_total:0,
        week_total:0,
        month_total:0,
        total_amonut:0,
      },
      exportAllloading:false,
      editBtnId:'',
      btnAry:[],
      hotelList:[],
      loadingSearch:false,
      timeVisible:false,
      timeForm:{
        time:''
      },
      timeRules:{
        time:[ {  required: true, message: '请选择时间', trigger: 'change' }]
      },
      detailItem:'',
      pickerOptionsStart: {
        disabledDate: time => {
          return time.getTime() < Date.now() - 24 * 60 * 60 * 1000;
        }
      },
      refundForm:{
        refundList:[],
      },
      refundVisible:false,
      btnLoading1:false,
      btnLoading2:false,
      btnLoading3:false,
      btnLoading4:false,
      refuseVisible:false,
      refuseForm:{
        cause:'',
      },
      refuseRules:{
        cause:[ {  required: true, message: '请填写内容', trigger: 'blur' }],
      },
      refuse:{
        order_id:'',
        status:''
      },
      totalData:{
        order_nums: 0,
        total_order_money: 0,
        total_pay_money: 0,
      }
    }
  },
  computed: {
    ...mapState({
      updatePage: state => state.app.updatePage
    }),
  },
  watch: {
    updatePage(newData, oldData) {
      // console.log(newData)
      if(newData){
        this.handleClick();
        this.$store.commit('app/SET_UPDATEPAGE',false)
      }
    }
  },
  mounted () {
    this.getList();
    this.getTotalByDate()
    this.$store.dispatch('user/showBtn', { id: 22 }).then(res => {
      // console.log('res', res)
      this.btnAry = res.children
    })
    setInterval(function() {
      document.querySelectorAll(".el-cascader-node__label").forEach(el => {
        el.onclick = function() {
          if (this.previousElementSibling) this.previousElementSibling.click();
        };
      });
    }, 1000);
  },
  methods: {
    handleSelectDate(){
      // const startAt = parseInt(new Date(this.timeForm.time).valueOf() / 100000)
      // let date = new Date()
      // date.setMinutes(date.getMinutes()-1)
      // const time = parseInt(date.valueOf() / 100000)
      // console.log(startAt)
      // console.log(time)
      // if(startAt < time){
      //   this.$message({
      //     message: '选择时间不能为过期时间',
      //     type: 'warning',
      //     duration: 5 * 1000
      //   })
      //   this.timeForm.time = ''
      // }
    },
    //点击tab
    handleClick(){
      this.listQuery.page = 1
      this.listQuery.size = 20
      this.getList();
    },
    // 获取列表
    getList() {
        if(this.activeName == 'all'){
          this.listQuery.status = ''
        }else{
          this.listQuery.status = parseInt(this.activeName) 
        }
        if (this.dateRange == null || this.dateRange.length == 0) {
            this.listQuery.start_time = ''
            this.listQuery.end_time = ''
        } else {
            this.listQuery.start_time = this.dateRange[0] / 1000
            this.listQuery.end_time = this.dateRange[1] / 1000
        }
        if(this.placeOrigin.length>0){
          this.placeOrigin.map((item,i)=>{
            if(i == 0){
              this.listQuery.province_id = item
              this.listQuery.city_id = ''
              this.listQuery.area_id = ''
              this.listQuery.street_id = ''
            }else if(i == 1){
              this.listQuery.city_id = item
            }else if(i == 2){
              this.listQuery.area_id = item
            }else if(i == 3){
              this.listQuery.street_id = item
            }
          })
        }else{
          this.listQuery.province_id = ''
          this.listQuery.city_id = ''
          this.listQuery.area_id = ''
          this.listQuery.street_id = ''
        }
        this.listLoading = true
        getMemberOrderList(this.listQuery).then(res => {
            this.list = res.data.data.data
            this.total = res.data.data.total
            this.totalData = res.data.totalData
            this.listLoading = false
        })
    },
     //刷新
    refresh(){
      this.listQuery = {
        keyword:'',
        status:'',
        source:null,
        pay_way:null,
        hotel_id:null,
        start_time:'',
        end_time:'',
        member_id:'',
        province_id:'',
        city_id:'',
        area_id:'',
        street_id:'',
        page: 1,
        size: 20,
      }
      this.dateRange = []
      this.placeOrigin = []
      this.activeName = 'all'
      this.getList();
      this.getTotalByDate()
    },
    //获取省市区地址
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
    //获取统计金额
    getTotalByDate(){
        totalByDate().then(res=>{
            this.dayJson = res.data
        })
    },
    //搜索酒店
    remoteMethod(query) {
        if (query !== '') {
            this.loadingSearch = true
            getHotelList({ keyword: query, page: 1, size: 9999,}).then(res => {
                this.loadingSearch = false
                this.hotelList = res.data.data.data
            })
        } else {
            this.hotelList = []
        }
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
    //查看订单详情
    handleDetail(row,flag){
        this.$refs.orderDetailChild.init(row)
        if(row.is_read == 0){
            getMemberOrderReadList({ids:row.id}).then(res=>{
                if(res.code == 0){
                    this.getList()
                }
            })
        }
    },
    //协商退款
    refundHandle(row){
      this.refundVisible = true
      this.refundItem = row
      getOrderPayInfo({order_id:row.id}).then(res=>{
        this.refundForm.refundList = res.data
        // console.log(this.refundList)
        this.refundForm.refundList.map(item=>{
          item.showPrice = item.price
          switch (item.pay_way) {
            case 1:
                item.text = "微信";
                break;
            case 2:
                item.text = "支付宝";
                break;
            case 3:
                item.text = "余额";
                break;
            case 4:
                item.text = "现金";
                break;
            case 5:
                item.text = "银联";
                break;
            case 6:
                item.text = "分时积分";
                break;
            case 7:
                item.text = "专属积分";
          } 
        })
      })
    },
    refundSubmit(){
      this.$refs.refundForm.validate((valid) => {
        if (valid) {
          let arr=[]
          for(let i = 0;i<this.refundForm.refundList.length;i++){
            let item = this.refundForm.refundList[i]
            if( item.price > item.showPrice){
              this.$message({
                  type: 'warning',
                  message: '退款金额不能超过现有金额'
              })
              return
            }else{
              let json={pay_way:item.pay_way,price:item.price}
              arr.push(json)
            }
          }
          let params={
            order_id:this.refundItem.id,
            data:arr
          }
          this.btnLoading2 = true
          consultRefundOrder(params).then(res=>{
            this.btnLoading2 = false
            if (res.code === 0) {
              this.$message({
                type: 'success',
                message: '操作成功!'
              })
              this.refundVisible = false
              this.getList()
            }
          })
        } else{
          return false;
        }
      });
    },
    // 入住和退房
    roomStatusTimeHandle(row){
      this.detailItem = row
      this.timeForm.time = ''
      if(row.status == 6){
        this.$refs.securityCodeChild.init(row.hotel_id,'')
      }else{
        this.timeVisible = true
      }
    },
    timeSubmit(){
      this.$refs.timeForm.validate((valid) => {
        if (valid) {
          let status 
          if(this.detailItem.status == 5){
            // text = `确认要办理入住吗？`
            status = 6
            this.editOrderStatusApi(status)
          }else if(this.detailItem.status == 6){
            // text = `确认要办理退房吗？`
            status = 7
            let params = {
              order_id: this.detailItem.id,
              time:this.timeForm.time
            }
            getRoomNums(params).then(res=>{
              if (res.code === 0) {
                  if(res.data>0){
                    let text = `会员还有${res.data}晚未入住，是否退房？`
                    this.$confirm(text, '提示', {
                      confirmButtonText: '是',
                      cancelButtonText: '否',
                      type: 'warning'
                    }).then(() => {
                      this.editOrderStatusApi(status)
                    }).catch(() => {
                      this.$message({
                        type: 'info',
                        message: '已取消'
                      })
                    })
                  }else{
                    this.editOrderStatusApi(status)
                }
              }
            })
          }
        }
      });
    },
    //入住和退房接口
    editOrderStatusApi(status){
      let params = {
        order_id: this.detailItem.id,
        status:status,
        time:this.timeForm.time
      }
      this.btnLoading3 = true
      editOrderStatus(params).then(res => {
          this.btnLoading3 = false
          if (res.code === 0) {
            this.$message({
                type: 'success',
                message: '操作成功!'
            })
            this.timeVisible = false
            this.getList()
          }
      })
    },
    //操作退房等
    roomStatusHandle(row,flag){
      this.editBtnId = row.id
      let text,status
      if(flag == undefined){
        if(row.status == 2){
          text = `确认要接受吗？`
          status = 5
          // }else if(row.status == 5){
          //   text = `确认要办理入住吗？`
          //   status = 6
          // }else if(row.status == 6){
          //   text = `确认要办理退房吗？`
          //   status = 7
          this.$confirm(text, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            // beforeClose: (action, instance, done) => {
            //   if (action === 'confirm') {
            //     instance.confirmButtonLoading = true;
            //     setTimeout(() => {
            //       done();
            //       setTimeout(() => {
            //         instance.confirmButtonLoading = false;
            //       }, 300);
            //     }, 3000);
            //   } else {
            //     done();
            //   }
            // }
          }).then(() => {
            const params = {
              order_id: row.id,
              status:status
            }
            editOrderStatus(params).then(res => {
              if (res.code === 0) {
                this.$message({
                    type: 'success',
                    message: '操作成功!'
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
        }
      }else{
        text = `确认要拒绝吗？`
        status = 4
        this.refuse = {
          order_id: row.id,
          status:status
        }
        this.refuseVisible = true
      }
    },
    refuseSubmit(){
      this.$refs.refuseForm.validate((valid) => {
        if (valid) {
          if(this.refuseForm.cause.length>50){
            this.$message({
              type: 'warning',
              message: '不能超过50个字符!'
            })
            return
          }
          const params = {
            order_id: this.refuse.order_id,
            status:this.refuse.status,
            refuse_reason:this.refuseForm.cause
          }
          editOrderStatus(params).then(res => {
            if (res.code === 0) {
              this.$message({
                  type: 'success',
                  message: '操作成功!'
              })
              this.refuseVisible = false
              this.getList()
            }
          })
        }
      })
    },
    //点击退房
    confirmSubmit(flag){
      this.timeVisible = true
    },
    //导出数据
    exportTable(flag){
      if(this.activeName == 'all'){
        this.listQuery.status = ''
      }else{
        this.listQuery.status = parseInt(this.activeName) 
      }
      if (this.dateRange == null || this.dateRange.length == 0) {
          this.listQuery.start_time = ''
          this.listQuery.end_time = ''
      } else {
          this.listQuery.start_time = this.dateRange[0] / 1000
          this.listQuery.end_time = this.dateRange[1] / 1000
      }
      if(this.placeOrigin.length>0){
        this.placeOrigin.map((item,i)=>{
          if(i == 0){
            this.listQuery.province_id = item
            this.listQuery.city_id = ''
            this.listQuery.area_id = ''
            this.listQuery.street_id = ''
          }else if(i == 1){
            this.listQuery.city_id = item
          }else if(i == 2){
            this.listQuery.area_id = item
          }else if(i == 3){
            this.listQuery.street_id = item
          }
        })
      }else{
        this.listQuery.province_id = ''
        this.listQuery.city_id = ''
        this.listQuery.area_id = ''
        this.listQuery.street_id = ''
      }
      let params
      if(flag == '1'){
        this.exportAllloading = true
        params={
          keyword:this.listQuery.keyword,
          status:this.listQuery.status,
          source:this.listQuery.source,
          pay_way:this.listQuery.pay_way,
          merch_id:this.listQuery.merch_id,
          start_time:this.listQuery.start_time,
          end_time:this.listQuery.end_time,
          member_id:this.listQuery.member_id,
          province_id:this.listQuery.province_id,
          city_id:this.listQuery.city_id,
          area_id:this.listQuery.area_id,
          street_id:this.listQuery.street_id,
        }
      }else{
        params = this.listQuery
      }
      getOrderExportExcel(params).then(res=>{
        this.exportAllloading = false
        // console.log(res)
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
    // justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    .right-font{
        // font-size: 14px;
        margin-left: 10px;
        margin-right: 30px;
        .top-num{
            color:red;
            margin-right: 5px;
        }
    }
}
/deep/.el-tabs__header {
    margin: 0 0 20px;
}
.pop-btn-box{
  text-align: center;
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
}
</style>
