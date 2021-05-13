<template>
  <div class="mixin-components-container">
    <div style="height:130px;">
      <aside style="height:130px;width:48%;float:left;">
        <div class="title-text">结算总额</div>
        <div class="all-money">
          <span class="num">￥</span><span v-if="settlementAmount.hotel_total_amount==null" class="num">0</span>
          <span v-else class="num">{{ settlementAmount.hotel_total_amount }}</span>
          <span class="money-text">订单金额:</span><span v-if="settlementAmount.all_total_amount==null" class="money-num">￥0</span>
          <span v-else class="money-num">￥{{ settlementAmount.all_total_amount }}</span>
        </div>
        <div class="money-detail all-money">
          <span class="money-text">未提现:</span><span v-if="settlementAmount.cash_no_amount==null" class="money-num">0</span>
          <span v-else class="money-num">￥{{ settlementAmount.cash_no_amount }}</span>
          <span class="money-text">提现中:</span><span v-if="settlementAmount.cashing_amount==null" class="money-num">0</span>
          <span v-else class="money-num">￥{{ settlementAmount.cashing_amount }}</span>
          <span class="money-text">已提现:</span><span v-if="settlementAmount.cash_amount==null" class="money-num">0</span>
          <span v-else class="money-num">￥{{ settlementAmount.cash_amount }}</span>
          <span class="money-text">未通过:</span><span v-if="settlementAmount.audit_amount==null" class="money-num">0</span>
          <span v-else class="money-num">￥{{ settlementAmount.audit_amount }}</span>
        </div>
      </aside>
      <aside style="height:130px;width:48%;float:right;">
        <div class="title-text">未申请提现金额
          <el-tooltip class="item" effect="dark" content="未申请提现金额不包含当天的" placement="top-start">
            <i class="el-icon-question" />
          </el-tooltip>
        </div>
        <div class="all-money">
          <span class="num">￥</span><span class="num">{{ settlementAmount.cash_no_amount }} </span>
          <span class="right-btn-group">
            <router-link to="/financial/hotel-withdraw">
              <el-button v-if="btnAry.findIndex(x => x.id == '103')!=-1" type="primary" size="mini" plain>提现记录</el-button>
            </router-link>
          </span>
        </div>
        <div class="money-detail all-money">
          <span class="money-text">申请提现总额:</span><span v-if="settlementAmount.cash_amount==null" class="money-num">0</span>
          <span v-else class="money-num">￥{{ settlementAmount.cash_amount }}</span>
          <span class="money-text">已提现:</span><span v-if="settlementAmount.cash_amount==null" class="money-num">0</span>
          <span v-else class="money-num">￥{{ settlementAmount.cash_amount }}</span>
          <span class="money-text">待打款:</span><span v-if="settlementAmount.cashing_amount==null" class="money-num">0</span>
          <span v-else class="money-num">￥{{ settlementAmount.cashing_amount }}</span>
        </div>
      </aside>
    </div>
    <div class="filter-container">
      <span class="filter-item">
        <span class="select-title">时间范围：</span>
        <el-date-picker
          v-model="dateRange"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          style="width: 280px"
          value-format="timestamp"
        />
      </span>
      <span class="filter-item">
        <span class="select-title">酒店：</span>
         <el-select  v-model="listQuery.hotel_id" filterable clearable  remote placeholder="请输入酒店关键字搜索"
            :remote-method="remoteMethod" :loading="loadingSearch" >
          <el-option v-for="item in hotelList" :key="item.id" :label="item.title" :value="item.id" />
        </el-select>
      </span>
      <span class="filter-item">
        <span class="select-title">状态：</span>
        <el-select v-model="listQuery.status" placeholder="状态" style="width: 160px">
          <el-option v-for="(item,index) in statusList" :key="index" :label="item.name" :value="item.value" />
        </el-select>
      </span>
      <el-button class="filter-item" type="primary" size="mini" icon="el-icon-search" @click="handleFilter">搜索</el-button>
      <el-button class="filter-item" type="success" size="mini" icon="el-icon-refresh" @click="refresh">刷新</el-button>
      <el-button v-if="btnAry.findIndex(x => x.id == '100')!=-1" class="filter-item" type="primary" size="mini" @click="exportTable('1')">全部导出</el-button>
      <el-button v-if="btnAry.findIndex(x => x.id == '101')!=-1" class="filter-item" type="primary" size="mini" @click="exportTable('2')">按页导出</el-button>
    </div>
    <el-table :data="list" element-loading-text="Loading..." border fit highlight-current-row>
      <el-table-column align="center" label="ID" prop="id" width="80px" />
      <el-table-column align="center" label="日期" width="160px">
        <template slot-scope="scope"><span>{{ scope.row.time }}</span></template>
      </el-table-column>
      <el-table-column align="left" label="酒店" width="160" prop="hotel_name" />
      <el-table-column align="center" label="订单数" width="160" prop="number" />
      <el-table-column align="center" label="总金额" >
        <template slot-scope="scope">{{ scope.row.all_amount }}</template>
      </el-table-column>
      <el-table-column label="实收金额" align="center" >
        <template slot-scope="scope">{{ scope.row.total_amount }}</template>
      </el-table-column>
      <el-table-column label="酒店结算金额" align="center" >
        <template slot-scope="scope">{{ scope.row.hotel_amount }}</template>
      </el-table-column>
      <el-table-column label="状态" align="center" width="120px">
        <template slot-scope="scope">
            <span v-if="scope.row.status ==0">可提现</span>
            <span v-if="scope.row.status ==1">提现审核中</span>
            <span v-if="scope.row.status ==2">已提现</span>
            <span v-if="scope.row.status ==3">未通过</span>
            <span v-if="scope.row.status ==4">不可提现</span>
        </template>
      </el-table-column>
      <el-table-column v-if="btnAry.findIndex(x => x.id == '102')!=-1" label="操作" align="center" width="150">
        <template slot-scope="scope">
          <el-button v-if="scope.row.hotel_amount != 0" type="primary" size="mini" @click="getDetailList(scope.row)">查看详情</el-button>
          <span v-else>-</span>
        </template>
      </el-table-column>
    </el-table>
    <pagination :total="pageTotal" :page.sync="listQuery.page" :limit.sync="listQuery.size" @pagination="paginHandle" />
    <!-- 查看详情弹窗 -->
    <!-- <el-dialog :visible.sync="detailPop" title="查看详情" class="center-dialog" width="90%">
          <el-table v-loading="listLoading" :data="billList" border style="width: 100%">
            <el-table-column prop="order_sn" label="订单号" align="center"  width="190"/>
            <el-table-column prop="hotel_name" label="酒店" align="center" />
             <el-table-column prop="order_amount" label="订单金额" width="100" align="center" />
            <el-table-column prop="settle_amount" label="应结算金额" width="100" align="center" />
            <el-table-column prop="rate" label="分佣比例" width="100" align="center" />
            <el-table-column label="结算状态" width="100" align="center">
              <template slot-scope="scope">
                <span v-if="scope.row.status ==1">未结算</span>
                <span v-if="scope.row.status ==2">已结算</span>
              </template>
            </el-table-column>
            <el-table-column label="时间" width="160" align="center">
              <template slot-scope="{row}">
                <span v-if="row.create_time==null || row.create_time==''">-</span>
                <span v-else>{{ row.create_time }}</span>
              </template>
            </el-table-column>
          </el-table>
        <pagination :total="popTotal" :page.sync="currentPage1" :limit.sync="currentSize1" @pagination="getPopList" />
    </el-dialog> -->
    <!-- 详情弹窗 -->
    <withdraw-detail ref="withdrawDetailChild" />
  </div>
</template>

<script>
import { getMerchStatisticsList,getMerchStatisticsDetailList,getTotalStatisticsList,orderStatisticsExportExcel} from '@/api/financial-manage/hotel-statistics'
import { getHotelList} from '@/api/hotel-manage/hotel-list'
import Pagination from '@/components/Pagination' // 分页
import WithdrawDetail from './components/withdraw-detail'
import mix from '@/mixs/mix'
export default {
  name: 'ExportExcel',
  components: { Pagination,WithdrawDetail },
  mixins: [mix],
  data() {
    return {
      list: [],
      listLoading: true,
      detailPop: false,
      activeName: 'first',
      currentPage1: 1,
      currentSize1: 10,
      settlementAmount: {
        hotel_total_amount: 0,
        all_total_amount: 0,
        cash_no_amount: 0,
        cashing_amount: 0,
        cash_amount: 0,
        audit_amount:0,
        profit_amount:0,
      },
      listQuery: {
        hotel_id:'',
        status: '',
        start_time:'',
        end_time:'',
        page: 1,
        size: 20
      },
      dateRange:[],
      billList: [],
      orderDetail: '',
      rowList: '',
      pageTotal: 0,
      popTotal: 0,
      withdraw_config: '',
      statusList: [
        { name: '全部', value: '' },
        { name: '未提现', value: 0 },
        { name: '提现审核中', value: 1 },
        { name: '已提现', value: 2 },
        { name: '未通过', value: 3 }
      ],
      loadingSearch:false,
      hotelList:[],
      editId:'',
      totalData: {//未提现
        total_amount:0,//实收金额
        cash_no_amount: 0,//未提现金额
        cash_no_count: 0,//结束单数
        profit_amount: 0//平台利润
      },
      btnAry:[],
    }
  },
  created() {
    this.getList()
    this.getStatisticsList()
    this.$store.dispatch('user/showBtn', { id: 25 }).then(res => {
      // console.log('res', res)
      this.btnAry = res.children
    })
  },
  methods: {
    getList() {
      if (this.dateRange == null || this.dateRange.length === 0) {
        this.listQuery.start_time = ''
        this.listQuery.end_time = ''
      } else {
        this.listQuery.start_time = this.dateRange[0] / 1000
        this.listQuery.end_time = this.dateRange[1] / 1000
      }
      this.listLoading = true
      getMerchStatisticsList(this.listQuery).then(res => {
        this.list = res.data.data.data
        this.pageTotal = res.data.data.total
        // this.totalData = res.data.totalData
        this.listLoading = false
      })
    },
    //刷新
    refresh(){
      this.listQuery = {
        hotel_id:'',
        status: '',
        start_time:'',
        end_time:'',
        page: 1,
        size: 20
      }
      this.dateRange = []
      this.getList();
      this.getStatisticsList()
    },
    getStatisticsList() {
      getTotalStatisticsList().then(res => {
        if (res.data != null) {
          this.settlementAmount = res.data
        }
      })
    },
    // 搜索酒店
    remoteMethod(query) {
      if (query == '' || query == null) {
        this.hotelList = []
      } else {
        this.loadingSearch = true
        getHotelList({ name: query, page: 1, size: 9999,}).then(res => {
          this.loadingSearch = false
          this.hotelList = res.data.data.data
        })
      }
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
    // 点击搜索
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    // 查看详情
    getDetailList(row) {
      // console.log(row.admin)
      let id
      if (row == undefined) {
        id = this.editId
      } else {
        id = row.id
        this.editId = row.id
        this.currentPage1 = 1
        this.rowList = row
      }
      this.detailPop = true
      this.$refs.withdrawDetailChild.init(this.rowList)
    },
    // 分页
    getPopList(val) {
      if (val != undefined) {
        const json = JSON.parse(JSON.stringify(val))
        this.currentPage1 = parseInt(json.page)
        this.currentSize1 = parseInt(json.limit)
      }
      this.getDetailList()
    },
    // 导出数据
    exportTable(flag) {
      let params
      if (this.dateRange == null || this.dateRange.length == 0) {
        this.listQuery.start_time = ''
        this.listQuery.end_time = ''
      } else {
        this.listQuery.start_time = this.dateRange[0] / 1000
        this.listQuery.end_time = this.dateRange[1] / 1000
      }
      if (flag == '1') {
        this.exportAllloading = true
        params = {
          hotel_id: this.listQuery.hotel_id,
          status: this.listQuery.status,
          start_time: this.listQuery.start_time,
          end_time: this.listQuery.end_time
        }
      } else {
        params = this.listQuery
      }
      orderStatisticsExportExcel(params).then(res => {
        // console.log(res)
        this.exportAllloading = false
        if (res.code == 0) {
          window.open(res.data)
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
/deep/.radio-label {
  font-size: 14px;
  color: #606266;
  line-height: 40px;
  padding: 0 12px 0 30px;
}
.mixin-components-container {
  min-height: calc(100vh - 84px);
  .title-text{
    font-size: 14px;
    color: #606266;
  }
  .all-money{
    .num{
      font-size: 32px;
      color: blue;
    }
    .money-text{
      font-size: 12px;
      color: #495060;
      margin-left: 5px;
    }
    .money-num{
      font-size: 12px;
      color: #8a6d3b;
    }
  }
  .right-btn-group{
    margin-left:10px;
    vertical-align: 20%;
  }
}
.component-item {
  min-height: 10px;
}
.el-divider {
  margin: 10px 0;
}
.el-form-item {
  margin-bottom: 10px;
}
.photo-img{
  width: 25px;
  height: 25px;
  border-radius: 50%;
  vertical-align: middle;
  margin-right: 10px;
}
.commont-border{
  border-bottom: 1px dashed #eee;
  display: flex;
  padding: 10px 0;
}
.first-line{
  padding-bottom: 20px;
}
.item-box{
  width: 50%;
  display: flex;
  .title-name{
    font-size: 14px;
    color: #606266;
    display: inline-block;
    width: 100px;
  }
  .content-text{
    // color: #000;
  }
  .final-statement{
    font-size: 32px;
    color: #42b983;
  }
  .item-money{
    margin: 15px 0;
  }
  .first-item{
    margin-top: 0;
  }
  .bank-card{
    color: #1654CC;
  }
}
.no-withdraw-deposit-box{
    margin-top: 20px;
    margin-left: 100px;
    .no-withdraw-deposit-btn{
      border: 2px solid orange;
      color: orange;
      font-size: 32px;
      padding: 10px;
      width: 120px;
      text-align: center;
    }
  }
  /deep/.line-margin{
    margin: 20px 0px;
  }
.margin-right-20{
  margin-right: 20px;
}
</style>
