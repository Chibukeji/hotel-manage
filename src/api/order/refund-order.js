import request from '@/utils/request'

// 列表
export function getRefundOrderList(data) {
  return request({
    url: '/merch/order_refund/list',
    method: 'get',
    params: data
  })
}
//退款
export function refundOrder(data) {
    return request({
      url: '/merch/order_refund/refund',
      method: 'post',
      data
    })
}