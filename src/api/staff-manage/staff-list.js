import request from '@/utils/request'

// 列表
export function getMerchAccountList(data) {
  return request({
    url: '/merch/merch_account/list',
    method: 'get',
    params: data
  })
}
// 添加
export function getMerchAccountAdd(data) {
  return request({
    url: '/merch/merch_account/add',
    method: 'post',
    data
  })
}
// 编辑
export function getMerchAccountEdit(data) {
  return request({
    url: '/merch/merch_account/update',
    method: 'post',
    data
  })
}
// 删除
export function getMerchAccountDel(data) {
  return request({
    url: '/merch/merch_account/delete',
    method: 'get',
    params: data
  })
}