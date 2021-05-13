<template>
  <div class="home-page">
    <div class="left-box">
      <div>
        <div class="title">
          订单
        </div>
          <div class="card-box">
            <div class="card-wrap">
              <div class="big-title">今日订单</div>
              <div class="bold-title">
                <span class="text">待付款：</span>
                <span class="num">{{orderToday.wait_pay}}</span>
              </div>
              <div class="bold-title">
                <span class="text">退款申请：</span>
                <span class="num">{{orderToday.refund_apply}}</span>
              </div>
              <div class="bold-title">
                <span class="text">待酒店接受：</span>
                <span class="num">{{orderToday.payed}}</span>
              </div>
            </div>
             <div class="card-wrap">
              <div class="big-title">累计订单</div>
              <div class="bold-title">
                <span class="text">待付款：</span>
                <span class="num">{{orderAll.wait_pay}}</span>
              </div>
              <div class="bold-title">
                <span class="text">退款申请：</span>
                <span class="num">{{orderAll.refund_apply}}</span>
              </div>
              <div class="bold-title">
                <span class="text">待酒店接受：</span>
                <span class="num">{{orderAll.payed}}</span>
              </div>
            </div>
        </div>
      </div>
    </div>
    <div class="right-box">
      <div class="title">
        操作日志
      </div>
      <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%;">
        <el-table-column label="ID" align="center" width="80">
          <template slot-scope="{row}">
            <span>{{ row.id }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" :show-overflow-tooltip="true">
          <template slot-scope="{row}">
            <span class="desc-box-div">{{ row.text }}</span>
          </template>
        </el-table-column>
        <el-table-column label="时间" align="center" width="200">
          <template slot-scope="{row}">
            <span>{{ row.create_time }}</span>
          </template>
        </el-table-column>
      </el-table>
      <pagination :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.size" @pagination="paginHandle" />
    </div>
    <!-- 日志详情弹窗 -->
    <el-dialog  :visible.sync="logDialogVisible" title="操作详情" width="30%">
      <div>{{itemDetail.text}}</div>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { getOrderNum,getYesterdayOrderNum,getLogList } from '@/api/home'

export default {
  components: { Pagination },
  data() {
    return {
      activeName:'1',
      orderStatusList:[
        {name:'今日订单',value:'1'},
        {name:'累计订单',value:'2'},
      ],
      listQuery: {
        page: 1,
        size: 10,
      },
      total: 0,
      listLoading: false,
      list: [],
      orderToday:{
        wait_pay: 0,
        refund_apply: 0,
        payed: 0
      },
      orderAll:{
        wait_pay: 0,
        refund_apply: 0,
        payed: 0
      },
      logDialogVisible:false,
      itemDetail:'',
    }
  },
  mounted () {
    this.getTotalOrder();
    this.getLog();
  },
  methods: {
    // 获取订单数据
    getTotalOrder(){
      getOrderNum().then(res=>{
        this.orderToday = res.data
      })
      getYesterdayOrderNum().then(res=>{
        this.orderAll = res.data
      })
    },
    //获取操作日志
    getLog(){
      getLogList(this.listQuery).then(res=>{
        this.list = res.data.data.data
        this.total = res.data.data.total
      })
    },
    // 翻页
    paginHandle(val) {
      if (val != undefined) {
        const json = JSON.parse(JSON.stringify(val))
        this.listQuery.page = parseInt(json.page)
        this.listQuery.size = parseInt(json.limit)
      }
      this.getLog()
    },
    //操作详情
    detailHandle(row){
      this.logDialogVisible = true
      this.itemDetail = row
    }
  },
}
</script>

<style lang="scss" scoped>
.home-page{
  .left-box{
    .title{
      border-left: 4px solid #409eff;
      padding-left: 10px;
      margin-bottom: 20px;
      font-size: 14px;
    }
    .card-box{
      margin: 10px 0;
      margin-bottom: 20px;
      display: flex;
      .card-wrap{
        background-color: #f0f2f5;
        flex: 1;
        padding: 20px;
        border-radius: 6px;
        .bold-title{
          font-size: 14px;
          color:  #303133;
          margin-bottom: 10px;
          .text{
            display: inline-block;
            width: 100px;
            // margin-right: 20px;
          }
          .num{
            color: blue;
          }
        }
        .big-title{
          font-size: 16px;
          color: #303133;
          font-weight: bold;
          margin-bottom: 20px;
        }
        .bold-title:last-child{
          margin-bottom: 0px;
        }
      }
      .card-wrap:last-child{
        margin-left: 20px;
      }
    }
  }
  .right-box{
    flex: 1;
    .title{
      border-left: 4px solid #409eff;
      padding-left: 10px;
      margin-bottom: 20px;
      font-size: 14px;
    }
    .right-wrap-box{
      display: flex;
      flex-wrap: wrap;
      border-bottom: 1px solid #dfe6ec;
      .item{
        width: 50%;
        border: 1px solid #dfe6ec;
        border-bottom: none;
        padding: 20px 30px;
        text-align: center;
      }
      .item:nth-child(2n+2){
        border-left: none;
      }
    }
  }
}
.desc-box-div{
  // width: 100%;
  // white-space:nowrap;
  // overflow:hidden;
  // text-overflow: ellipsis;
  cursor: pointer;
  color: #409eff;
}
/deep/.el-dialog__wrapper {
    overflow: auto; 
}
</style>
