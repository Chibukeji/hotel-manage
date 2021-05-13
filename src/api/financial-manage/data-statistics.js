import request from '@/utils/request'

//列表
export function getOrderStatisticsList(data) {
  return request({
    url: '/merch/order_statistics/list',
    method: 'get',
    params:data
  })
}
//统计数据
export function getTotalByDateList(data) {
  return request({
    url: '/merch/order_statistics/totalByDate',
    method: 'get',
    params:data
  })
}
//导出数据
export function orderStatisticsExportExcel(data) {
  return request({
    url: '/merch/order_statistics/exportExcel',
    method: 'get',
    params:data
  })
}