import request from '@/utils/request'

//获取所有会员
export function getAllMemberList(data) {
  return request({
    url: '/main/member/list',
    method: 'get',
    params: data
  })
}
//搜索会员列表
export function getSearchMemberList(data) {
  return request({
    url: '/main/member/seachMember',
    method: 'get',
    params: data
  })
}
// 列表(下订单的会员)
export function getMemberList(data) {
  return request({
    url: '/merch/member/list',
    method: 'get',
    params: data
  })
}
// 编辑
export function getMemberEdit(data) {
  return request({
    url: '/merch/member/update',
    method: 'post',
    data
  })
}
//会员上周和本周注册数接口
export function getMemberWeekNumsList(data) {
  return request({
    url: '/merch/member/getWeekNums',
    method: 'get',
    params: data
  })
}
//订单详情
export function getMemberOrderList(data) {
  return request({
    url: '/merch/order/list',
    method: 'get',
    params: data
  })
}
//团队人员
export function getMemberTeamList(data) {
  return request({
    url: '/merch/member/getTeamList',
    method: 'get',
    params: data
  })
}
//团队订单
export function getMemberTeamOrderList(data) {
  return request({
    url: '/merch/member/getTeamOrder',
    method: 'get',
    params: data
  })
}
//团队收益
export function getMemberTeamCommissionList(data) {
  return request({
    url: '/merch/member/getTeamCommission',
    method: 'get',
    params: data
  })
}
//充值
export function getMemberRecharge(data) {
  return request({
    url: '/merch/member/recharge',
    method: 'get',
    params: data
  })
}
//导出数据
export function getMemberExportExcel(data) {
  return request({
    url: '/merch/member/exportExcel',
    method: 'get',
    params: data
  })
}