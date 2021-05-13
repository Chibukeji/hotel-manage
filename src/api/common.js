import request from '@/utils/request'

//省市区地址
export function allAddressList(data) {
  return request({
    url: '/main/area/list',
    method: 'get',
    params:data
  })
}
//订单通知
export function getNotification(data) {
  return request({
    url: '/merch/order/getPendingOrderNum',
    method: 'get',
    params:data
  })
}
//是否有酒店使用默认安全码
export function isDefaultSafePassword(data) {
  return request({
    url: '/merch/merch_account/isDefaultSafePassword',
    method: 'get',
    params:data
  })
}