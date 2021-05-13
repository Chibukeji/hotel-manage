import request from '@/utils/request'
// 获取验证码
export function getVerifiCode(data) {
  return request({
    url: '/merch/getVerifiCode',
    method: 'get',
    params: data
  })
}

export function login(data) {
  return request({
    url: '/merch/login',
    method: 'post',
    data
  })
}

export function logout() {
  return request({
    url: '/merch/logout',
    method: 'get'
  })
}

// 获取菜单
export function getMenu(data) {
  return request({
    url: '/merch/merch_account/menu',
    method: 'get',
    params: data
  })
}
