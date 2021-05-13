import request from '@/utils/request'

//获取今日订单
export function getOrderNum(data) {
  return request({
    url: '/merch/order/getTodayOrderNum ',
    method: 'get',
    params:data
  })
}
//获取累计订单
export function getYesterdayOrderNum(data) {
    return request({
      url: '/merch/order/getYesterdayOrderNum',
      method: 'get',
      params:data
    })
}
// 操作日志
export function getLogList(data) {
  return request({
    url: '/merch/log/list',
    method: 'get',
    params:data
  })
}