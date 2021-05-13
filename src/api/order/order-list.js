import request from '@/utils/request'

// 列表
export function getMemberOrderList(data) {
  return request({
    url: '/merch/order/list',
    method: 'get',
    params: data
  })
}
//设为已读
export function getMemberOrderReadList(data) {
  return request({
    url: '/main/member_order/setRead',
    method: 'get',
    params: data
  })
}
//获取子订单
export function getMemberOrderChildList(data) {
  return request({
    url: '/merch/order/orderChild',
    method: 'get',
    params: data
  })
}
//获取订单日志
export function getMemberOrderLogList(data) {
  return request({
    url: '/merch/order/orderLog',
    method: 'get',
    params: data
  })
}
//入住人信息
export function getStayPeopleList(data) {
  return request({
    url: '/merch/order/getLinkName',
    method: 'get',
    params: data
  })
}
//退款订单
export function getRefundOrderList(data) {
  return request({
    url: '/merch/order_refund/list',
    method: 'get',
    params: data
  })
}
//统计金额
export function totalByDate(data) {
  return request({
    url: '/merch/order/totalByDate',
    method: 'get',
    params: data
  })
}
//导出数据
export function getOrderExportExcel(data) {
  return request({
    url: '/merch/order/exportExcel',
    method: 'get',
    params: data
  })
}
// 修改订单状态
export function editOrderStatus(data) {
  return request({
    url: '/merch/order/editOrderStatus',
    method: 'post',
    data
  })
}
//获取协商退款信息
export function getOrderPayInfo(data) {
  return request({
    url: '/merch/order/getOrderPayInfo',
    method: 'get',
    params: data
  })
}
//修改协商退款
export function consultRefundOrder(data) {
  return request({
    url: '/merch/order/consultRefundOrder',
    method: 'post',
    data
  })
}
// 退房提交
export function getRoomNums(data) {
  return request({
    url: '/merch/order/getRoomNums',
    method: 'get',
    params:data
  })
}
//获取订单打印信息
export function getPrintInfo(data) {
  return request({
    url: '/merch/order/getPrintInfo',
    method: 'get',
    params:data
  })
}