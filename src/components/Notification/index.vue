<template>
  <div class="notification-box">
    <div v-if="show" role="alert" class="el-notification right" style="bottom: 16px; z-index: 2000">
      <div class="el-notification__group">
        <h2 class="el-notification__title"></h2>
        <div class="el-notification__content">
          <router-link to="/order/order-list">
            <p>
                <i class="el-icon-message-solid num"></i>
                有<span class="num">{{num}}</span>个订单未处理
                <span class="link-color">查看</span>
            </p>
          </router-link>
        </div>
        <div class="el-notification__closeBtn el-icon-close" @click="closeHandle"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { getNotification } from '@/api/common'
export default {
  data() {
    return {
      show:true,
      num:'',
      redirect:'',
      clearInter:'',
    };
  },
  watch: {
    '$route.path'(newVal,oldVal){
      // console.log(newVal);
      if(newVal === '/login' || newVal === '/forget-password'){
        this.show = false
        sessionStorage.removeItem("closeFlag");
        if(this.clearInter == ''){

        }else{
          clearInterval(this.clearInter)
        }
      }else {
        let closeFlag = sessionStorage.getItem('closeFlag')
        // console.log('closeFlag',closeFlag)
        if(closeFlag == 'false'){
          this.show = false
        }else{
          // console.log(this.clearInter)
          this.show = true
        }
        if(this.clearInter == ''){
            this.getNotificationList()
            // clearInterval(this.clearInter)
            this.clearInter = setInterval(()=>{
              this.getNotificationList()
            },60000)
          }
      }
    },
  },
  mounted() {
    // if(this.show){
    //   this.getNotificationList()
    //   this.clearInter = setInterval(()=>{
    //     this.getNotificationList()
    //   },60000)
    // }
  },
  methods: {
    closeHandle(){
      sessionStorage.setItem('closeFlag',false)
      this.show = false
    },
    //获取消息
    getNotificationList(){
      getNotification().then(res=>{
        this.num  = res.data.num
        if(res.data.num >0){
          let time1 = res.data.create_time
          let time2 = sessionStorage.getItem('orderNewTime')
          let timeFormat = time2
          // let timeFormat = '2021-03-04 10:17:40'
          // console.log(time1)
          // console.log(timeFormat)
          if(time1 == timeFormat){
            let closeFlag = sessionStorage.getItem('closeFlag')
            // console.log(closeFlag)
            if(closeFlag == 'false'){
              this.show = false
            }else{
              this.show = true
            }
          }else{
            this.show = true
            sessionStorage.setItem('closeFlag',true)
            this.$store.commit('app/SET_UPDATEPAGE',true)
          }
          sessionStorage.setItem('orderNewTime',res.data.create_time)
        }else{
          this.show = false
          sessionStorage.setItem('closeFlag',false)
          // clearInterval(this.clearInter)
        }
      })
    }
  },
};
</script>

<style lang="scss" scoped>
.notification-box {
  .num {
    color: red;
  }
  .link-color{
    color: #1890ff;
  }
}
</style>