import request from '@/utils/request'

// 列表
export function getRoleList(data) {
  return request({
    url: '/merch/group/list',
    method: 'get',
    params: data
  })
}
// 添加
export function getRoleAdd(data) {
  return request({
    url: '/merch/group/add',
    method: 'post',
    data
  })
}
// 编辑
export function getRoleEdit(data) {
  return request({
    url: '/merch/group/update',
    method: 'post',
    data
  })
}
// 删除
export function getRoleDel(data) {
  return request({
    url: '/merch/group/delete',
    method: 'get',
    params:data
  })
}
//获取树形菜单
export function getTreeList(data) {
  return request({
    url: '/merch/menu/list',
    method: 'get',
    params: data
  })
}
