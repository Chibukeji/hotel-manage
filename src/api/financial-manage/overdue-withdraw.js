import request from '@/utils/request'

//列表
export function getWithdrawList(data) {
  return request({
    url: '/merch/divtime_expire/list',
    method: 'get',
    params:data
  })
}
//详情
export function getWithdrawDetailList(data) {
  return request({
    url: '/merch/divtime_expire/detail',
    method: 'get',
    params:data
  })
}
//提现
export function getToWithdraw(data) {
  return request({
    url: '/merch/divtime_expire/toWithdraw',
    method: 'get',
    params:data
  })
}
//导出数据
export function orderWithdrawListExcel(data) {
  return request({
    url: '/merch/divtime_expire/exportExcel',
    method: 'get',
    params:data
  })
}